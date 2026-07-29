import * as cheerio from "cheerio";
import type { CrawledVelogDetail } from "@/types/blog";

const ALLOWED_TAGS = new Set([
    "a",
    "blockquote",
    "br",
    "code",
    "em",
    "h2",
    "h3",
    "h4",
    "hr",
    "img",
    "li",
    "main",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul",
]);

const ALLOWED_ATTRIBUTES = new Set(["alt", "href", "src", "title"]);

function getMeta($: cheerio.CheerioAPI, selector: string) {
    return $(selector).attr("content")?.trim() ?? "";
}

export function createSlugFromVelogUrl(url: string) {
    try {
        const pathname = new URL(url).pathname;
        const slug = pathname.split("/").filter(Boolean).pop();
        return slug ? decodeURIComponent(slug) : "";
    } catch {
        const slug = url.split("/").filter(Boolean).pop();
        return slug ? decodeURIComponent(slug) : "";
    }
}

function sanitizeContentHtml(rawHtml: string) {
    const $ = cheerio.load(`<main>${rawHtml}</main>`, null, false);

    $("script, style, iframe, button, input, form").remove();

    $("*").each((_, element) => {
        const node = element as { tagName?: string; attribs?: Record<string, string> };
        const tagName = node.tagName?.toLowerCase() ?? "";

        if (!ALLOWED_TAGS.has(tagName)) {
            $(element).replaceWith($(element).contents());
            return;
        }

        for (const attribute of Object.keys(node.attribs ?? {})) {
            if (!ALLOWED_ATTRIBUTES.has(attribute)) {
                $(element).removeAttr(attribute);
            }
        }

        if (tagName === "a") {
            const href = $(element).attr("href") ?? "";
            if (!href.startsWith("http") && !href.startsWith("#")) {
                $(element).removeAttr("href");
            }
            $(element).attr("target", "_blank");
            $(element).attr("rel", "noopener noreferrer");
        }

        if (tagName === "img") {
            const src = $(element).attr("src") ?? "";
            if (!src.startsWith("https://")) {
                $(element).remove();
            }
            if (!$(element).attr("alt")) {
                $(element).attr("alt", "");
            }
        }
    });

    return $("main").html() ?? "";
}

export async function crawlVelogDetail(url: string): Promise<CrawledVelogDetail> {
    const response = await fetch(url, {
        cache: "no-store",
        headers: {
            "user-agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`Velog 상세 페이지 요청 실패: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const content = $("div.atom-one").first();
    const headWrapperText = $("h1").first().parent().text();
    const publishedAt = headWrapperText.match(/\d{4}년\s*\d{1,2}월\s*\d{1,2}일/)?.[0] ?? "";
    const rawContentHtml = content.html() ?? "";

    return {
        title: $("h1").first().text().trim() || getMeta($, 'meta[property="og:title"]'),
        description:
            getMeta($, 'meta[name="description"]') || getMeta($, 'meta[property="og:description"]'),
        image: getMeta($, 'meta[property="og:image"]'),
        author: "성찬홍",
        publishedAt,
        tags: $('a[href*="/tags/"]')
            .map((_, element) => $(element).text().trim())
            .get()
            .filter(Boolean),
        sourceUrl: getMeta($, 'meta[property="og:url"]') || url,
        contentHtml: sanitizeContentHtml(rawContentHtml),
        contentText: content.text().trim(),
    };
}
