// Run with: node --env-file=.env scripts/refresh-velog.mjs [--apply]
// Collects every public post before writing; never deletes existing rows.
import { createClient } from "@supabase/supabase-js";
import ts from "typescript";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const source = readFileSync(
    new URL("../src/lib/utils/velogDetailCrawler.ts", import.meta.url),
    "utf8",
);
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const mod = { exports: {} };
new Function("require", "module", "exports", compiled)(require, mod, mod.exports);
const { crawlVelogDetail } = mod.exports;
const apply = process.argv.includes("--apply");
const directory = resolve(process.env.BLOG_CRAWL_OUTPUT || "/private/tmp/blog-refresh");
mkdirSync(directory, { recursive: true });
const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
);
const { data: existing, error } = await db.from("velog").select("*");
if (error) throw error;
const stamp = new Date().toISOString().replaceAll(":", "-");
writeFileSync(`${directory}/backup-${stamp}.json`, JSON.stringify(existing, null, 2));
const username = new URL(process.env.NEXT_PUBLIC_BLOG_URL).pathname.split("/")[1].replace(/^@/, "");
const posts = [];
let cursor;
for (;;) {
    const response = await fetch("https://v3.velog.io/graphql", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
            query: "query velogPosts($input: GetPostsInput!) { posts(input: $input) { id title short_description thumbnail url_slug released_at tags is_private } }",
            variables: { input: { username, limit: 50, ...(cursor ? { cursor } : {}) } },
        }),
    });
    if (!response.ok) throw new Error(`List HTTP ${response.status}`);
    const result = await response.json();
    if (result.errors || !Array.isArray(result.data?.posts))
        throw new Error(JSON.stringify(result.errors));
    const batch = result.data.posts;
    if (!batch.length) break;
    if (batch.some((p) => posts.some((old) => old.id === p.id)))
        throw new Error("Pagination repeated posts");
    posts.push(...batch);
    cursor = batch.at(-1).id;
    console.log(`Discovered ${posts.length}`);
}
if (!posts.length) throw new Error("Empty source; refusing refresh");
const normalize = (value) =>
    decodeURIComponent(new URL(value, "https://velog.io").pathname).replace(/\/$/, "");
const updates = [],
    failures = [];
// Optional cache from this run: successful article bodies can be reused after a failed batch.
const cached = process.env.BLOG_CRAWL_CACHE
    ? JSON.parse(readFileSync(process.env.BLOG_CRAWL_CACHE, "utf8"))
    : [];
for (const post of posts) {
    if (post.is_private) continue;
    const url = `https://velog.io/@${username}/${encodeURIComponent(post.url_slug)}`;
    try {
        const previous = cached.find((item) => item.values.source_url === url);
        const detail = previous
            ? {
                  title: previous.values.title,
                  contentHtml: previous.values.content_html,
                  contentText: previous.values.content_text,
              }
            : await crawlVelogDetail(url);
        if (!detail.title || !detail.contentHtml.trim()) throw new Error("Empty article body");
        const slugMatches = existing.filter((row) => row.slug === post.url_slug);
        const matches = slugMatches.length
            ? slugMatches
            : existing.filter((row) =>
                  [row.detail_link, row.source_url]
                      .filter(Boolean)
                      .some((link) => normalize(link) === normalize(url)),
              );
        if (matches.length > 1) throw new Error("Ambiguous existing rows");
        updates.push({
            id: matches[0]?.id,
            values: {
                title: post.title,
                intro: post.short_description || "",
                img_src: post.thumbnail || "",
                created_at: post.released_at,
                tags: post.tags || [],
                detail_link: url,
                source_url: url,
                slug: post.url_slug,
                content_html: detail.contentHtml,
                content_text: detail.contentText,
                detail_crawled_at: new Date().toISOString(),
                detail_crawl_error: null,
            },
        });
        console.log(`Collected ${updates.length}/${posts.length}: ${post.title}`);
    } catch (error) {
        failures.push({ url, error: error.message });
        console.log("FAILED", url, error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
}
// Preserve old internal URLs for renamed posts while refreshing their source and body.
const aliases = [];
for (const row of existing.filter((row) => !updates.some((update) => update.id === row.id))) {
    const matches = updates.filter((update) => update.values.title.trim() === row.title.trim());
    if (matches.length === 1) {
        updates.push({ id: row.id, values: { ...matches[0].values, slug: row.slug } });
        aliases.push({ id: row.id, slug: row.slug, source: matches[0].values.source_url });
    }
}
const unmatched = existing
    .filter((row) => !updates.some((update) => update.id === row.id))
    .map((row) => ({ id: row.id, title: row.title, slug: row.slug }));
const report = {
    discovered: posts.length,
    collected: updates.length - aliases.length,
    failures,
    aliases,
    unmatched,
    updated: 0,
    inserted: 0,
    apply,
};
writeFileSync(`${directory}/collected-${stamp}.json`, JSON.stringify(updates));
writeFileSync(`${directory}/report-${stamp}.json`, JSON.stringify(report, null, 2));
if (apply && failures.length)
    throw new Error(`Collection failed; no writes performed. ${JSON.stringify(failures)}`);
if (apply)
    for (const update of updates) {
        const query = update.id
            ? db.from("velog").update(update.values).eq("id", update.id)
            : db.from("velog").insert(update.values);
        const { data, error } = await query.select("id");
        if (error || data?.length !== 1)
            throw new Error(`Write failed: ${error?.message || "unexpected row count"}`);
        report[update.id ? "updated" : "inserted"]++;
    }
writeFileSync(`${directory}/report-${stamp}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
