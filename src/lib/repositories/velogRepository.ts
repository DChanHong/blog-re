import {
    createSupabaseServerClient,
    createSupabaseServiceRoleClient,
} from "@/lib/db/supabaseServer";
import type { VelogInsertRow, VelogPostDto } from "@/types/blog";

function mapVelogPost(row: any): VelogPostDto {
    return {
        id: row.id?.toString(),
        title: row.title,
        img_src: row.img_src,
        created_at: row.created_at,
        tags: row.tags || [],
        detail_link: row.detail_link,
        intro: row.intro,
        inserted_at: row.inserted_at,
        slug: row.slug,
        content_html: row.content_html,
        content_text: row.content_text,
        source_url: row.source_url,
        detail_crawled_at: row.detail_crawled_at,
        detail_crawl_error: row.detail_crawl_error,
    };
}

export async function getExistingTitles(): Promise<string[]> {
    console.log(`[repo] getExistingTitles`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("title");
    if (error) {
        console.error(`[repo] getExistingTitles error`, error);
        throw error;
    }
    const titles = (data ?? []).map((row: any) => row.title as string);
    console.log(`[repo] getExistingTitles count=${titles.length}`);
    return titles;
}

export async function getExistingKeys(): Promise<Set<string>> {
    console.log(`[repo] getExistingKeys`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("title, detail_link");
    if (error) {
        console.error(`[repo] getExistingKeys error`, error);
        throw error;
    }
    const keys = new Set<string>();
    for (const row of data ?? []) {
        keys.add(`${(row as any).title}|${(row as any).detail_link}`);
    }
    console.log(`[repo] getExistingKeys count=${keys.size}`);
    return keys;
}

export async function insertRows(rows: VelogInsertRow[]): Promise<number> {
    console.log(`[repo] insertRows count=${rows.length}`);
    if (rows.length === 0) return 0;
    const supabase = createSupabaseServiceRoleClient();
    const { error, data } = await supabase.from("velog").insert(rows).select("*");
    if (error) {
        console.error(`[repo] insertRows error`, error);
        throw error;
    }
    const inserted = data?.length ?? rows.length;
    console.log(`[repo] insertRows inserted=${inserted}`);
    return inserted;
}

export async function fetchPostsMissingDetail(limit: number): Promise<VelogPostDto[]> {
    console.log(`[repo] fetchPostsMissingDetail limit=${limit}`);
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("velog")
        .select("*")
        .or("content_html.is.null,content_html.eq.")
        .not("detail_link", "is", null)
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error) throw error;
    return (data || []).map(mapVelogPost);
}

export async function fetchPostsForDetailRefresh(limit: number): Promise<VelogPostDto[]> {
    console.log(`[repo] fetchPostsForDetailRefresh limit=${limit}`);
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("velog")
        .select("*")
        .not("detail_link", "is", null)
        .order("detail_crawled_at", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error) throw error;
    return (data || []).map(mapVelogPost);
}

export async function updatePostDetailByDetailLink(
    detailLink: string,
    values: Pick<
        VelogPostDto,
        "slug" | "content_html" | "content_text" | "source_url" | "detail_crawled_at" | "detail_crawl_error"
    >,
): Promise<void> {
    console.log(`[repo] updatePostDetailByDetailLink detailLink=${detailLink}`);
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
        .from("velog")
        .update(values)
        .eq("detail_link", detailLink);
    if (error) throw error;
}

export async function updatePostDetailErrorByDetailLink(
    detailLink: string,
    errorMessage: string,
): Promise<void> {
    console.log(`[repo] updatePostDetailErrorByDetailLink detailLink=${detailLink}`);
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
        .from("velog")
        .update({
            detail_crawl_error: errorMessage,
            detail_crawled_at: new Date().toISOString(),
        })
        .eq("detail_link", detailLink);
    if (error) throw error;
}

export async function fetchPostBySlug(slug: string): Promise<VelogPostDto | null> {
    console.log(`[repo] fetchPostBySlug slug=${slug}`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("velog")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;
    return data ? mapVelogPost(data) : null;
}

export async function fetchAllTags(): Promise<string[]> {
    console.log(`[repo] fetchAllTags`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("tags");
    if (error) {
        console.error(`[repo] fetchAllTags error`, error);
        throw error;
    }
    const set = new Set<string>();
    for (const row of data ?? []) {
        for (const tag of ((row as any).tags || []) as string[]) set.add(tag);
    }
    const tags = Array.from(set).sort((a, b) => a.localeCompare(b));
    console.log(`[repo] fetchAllTags distinct=${tags.length}`);
    return tags;
}

export async function fetchPostsByTagsAny(tags: string[]) {
    console.log(`[repo] fetchPostsByTagsAny tags=${tags.join(",")}`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("*").overlaps("tags", tags);
    if (error) throw error;
    return data;
}

export async function fetchPostsByTagsAll(tags: string[]) {
    console.log(`[repo] fetchPostsByTagsAll tags=${tags.join(",")}`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("*").contains("tags", tags);
    if (error) throw error;
    return data;
}

export async function fetchRecentPosts(limit: number) {
    console.log(`[repo] fetchRecentPosts limit=${limit}`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("velog")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
    if (error) throw error;
    return (data || []).map(mapVelogPost);
}

export async function fetchPostsForSitemap(): Promise<
    Pick<VelogPostDto, "slug" | "created_at" | "inserted_at" | "detail_crawled_at">[]
> {
    console.log(`[repo] fetchPostsForSitemap`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("velog")
        .select("slug, created_at, inserted_at, detail_crawled_at")
        .not("slug", "is", null)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
}
