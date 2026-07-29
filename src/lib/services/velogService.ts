import { getHtml } from "@/lib/utils/crawler";
import {
    fetchPostBySlug,
    fetchPostsMissingDetail,
    fetchPostsForDetailRefresh,
    getExistingKeys,
    insertRows,
    fetchRecentPosts,
    updatePostDetailByDetailLink,
    updatePostDetailErrorByDetailLink,
} from "@/lib/repositories/velogRepository";
import { crawlVelogDetail, createSlugFromVelogUrl } from "@/lib/utils/velogDetailCrawler";
import type { BlogCrawl, VelogInsertRow, VelogPostDto } from "@/types/blog";

function createDate(now: Date, daysAgo: number) {
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    date.setHours(18, 0, 0, 0);
    return date;
}

function parseCreatedAt(label: string): Date {
    const now = new Date();

    if (!label || label.trim() === "") return now;

    if (label === "방금") return now;

    if (label === "어제") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(18, 0, 0, 0);
        return yesterday;
    }

    if (label.includes("전")) {
        const numMatch = label.match(/(\d+)/);
        const num = numMatch ? Number(numMatch[1]) : 0;

        if (label.includes("분")) {
            const d = new Date(now);
            d.setMinutes(d.getMinutes() - num);
            return d;
        }
        if (label.includes("시간")) {
            const d = new Date(now);
            d.setHours(d.getHours() - num);
            return d;
        }
        // "N일 전"
        return createDate(now, num);
    }

    // "2024년 1월 15일" 형식
    const parsed = new Date(label.replace("년 ", "-").replace("월 ", "-").replace("일", ""));
    if (isNaN(parsed.getTime())) {
        console.warn(`[service] parseCreatedAt: invalid label="${label}", fallback to now`);
        return now;
    }
    return parsed;
}

function normalizeVelogUrl(url: string) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `https://velog.io${url.startsWith("/") ? "" : "/"}${url}`;
}

function toDetailUpdate(detailLink: string, detail: Awaited<ReturnType<typeof crawlVelogDetail>>) {
    const sourceUrl = detail.sourceUrl || normalizeVelogUrl(detailLink);
    return {
        slug: createSlugFromVelogUrl(sourceUrl || detailLink),
        content_html: detail.contentHtml,
        content_text: detail.contentText,
        source_url: sourceUrl,
        detail_crawled_at: new Date().toISOString(),
        detail_crawl_error: null,
    };
}

function normalizeTextForCompare(text: string | null | undefined) {
    return (text ?? "").replace(/\s+/g, " ").trim();
}

async function crawlAndUpdatePostDetail(post: Pick<VelogPostDto, "detail_link">) {
    const detailLink = post.detail_link;
    const url = normalizeVelogUrl(detailLink);

    if (!url) {
        throw new Error("detail_link가 비어 있습니다.");
    }

    try {
        const detail = await crawlVelogDetail(url);
        await updatePostDetailByDetailLink(detailLink, toDetailUpdate(detailLink, detail));
        return { ok: true as const, detailLink };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown detail crawl error";
        await updatePostDetailErrorByDetailLink(detailLink, message);
        return { ok: false as const, detailLink, message };
    }
}

async function crawlAndRefreshPostDetail(post: Pick<VelogPostDto, "detail_link" | "content_text">) {
    const detailLink = post.detail_link;
    const url = normalizeVelogUrl(detailLink);

    if (!url) {
        throw new Error("detail_link가 비어 있습니다.");
    }

    try {
        const detail = await crawlVelogDetail(url);
        const currentText = normalizeTextForCompare(post.content_text);
        const nextText = normalizeTextForCompare(detail.contentText);

        if (currentText === nextText) {
            return { status: "unchanged" as const, detailLink };
        }

        await updatePostDetailByDetailLink(detailLink, toDetailUpdate(detailLink, detail));
        return { status: "updated" as const, detailLink };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown detail refresh error";
        await updatePostDetailErrorByDetailLink(detailLink, message);
        return { status: "failed" as const, detailLink, message };
    }
}

export async function crawlAndPersist(url: string, expectedCount?: number, detailLimit: number = 10) {
    console.log(`[service] start crawlAndPersist url=${url} expected=${expectedCount ?? "-"}`);
    const articles: BlogCrawl[] = await getHtml(url, expectedCount);
    console.log(`[service] crawled articles=${articles.length}`);
    if (articles.length === 0) return { inserted: 0, scanned: 0, detailUpdated: 0, detailFailed: 0 };

    const existingKeys = await getExistingKeys();
    console.log(`[service] existing keys=${existingKeys.size}`);
    const toInsert: VelogInsertRow[] = articles
        .filter((a) => !existingKeys.has(`${a.title}|${a.detail_link}`))
        .map((item) => ({
            title: item.title ?? "",
            img_src: item.img_src ?? "",
            created_at: parseCreatedAt(item.created_at),
            tags: item.tags ?? [],
            detail_link: item.detail_link ?? "",
            intro: item.intro ?? (null as unknown as string),
            slug: createSlugFromVelogUrl(normalizeVelogUrl(item.detail_link ?? "")),
            source_url: normalizeVelogUrl(item.detail_link ?? ""),
        }));

    console.log(`[service] toInsert=${toInsert.length}`);
    const inserted = await insertRows(toInsert);
    console.log(`[service] inserted=${inserted}`);

    const missingDetailPosts = await fetchPostsMissingDetail(detailLimit);
    const detailResults = [];
    for (const post of missingDetailPosts) {
        detailResults.push(await crawlAndUpdatePostDetail(post));
    }

    const detailUpdated = detailResults.filter((result) => result.ok).length;
    const detailFailed = detailResults.length - detailUpdated;
    console.log(`[service] detailUpdated=${detailUpdated} detailFailed=${detailFailed}`);

    return { inserted, scanned: articles.length, detailUpdated, detailFailed };
}

export async function crawl(url: string): Promise<BlogCrawl[]> {
    console.log(`[service] start crawl url=${url}`);
    const articles: BlogCrawl[] = await getHtml(url);
    console.log(`[service] crawl only articles=${articles.length}`);
    return articles;
}

export async function getRecentPosts(limit: number) {
    // 최근 포스트 조회 서비스 레이어
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 6;
    return fetchRecentPosts(safeLimit);
}

export async function backfillPostDetails(limit: number = 10) {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 30) : 10;
    const posts = await fetchPostsMissingDetail(safeLimit);
    const results = [];

    for (const post of posts) {
        results.push(await crawlAndUpdatePostDetail(post));
    }

    const updated = results.filter((result) => result.ok).length;
    const failed = results.length - updated;
    return { scanned: posts.length, updated, failed, results };
}

export async function refreshPostDetails(limit: number = 10) {
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 30) : 10;
    const posts = await fetchPostsForDetailRefresh(safeLimit);
    const results = [];

    for (const post of posts) {
        results.push(await crawlAndRefreshPostDetail(post));
    }

    const updated = results.filter((result) => result.status === "updated").length;
    const unchanged = results.filter((result) => result.status === "unchanged").length;
    const failed = results.filter((result) => result.status === "failed").length;

    return { scanned: posts.length, updated, unchanged, failed, results };
}

export async function getPostBySlug(slug: string) {
    return fetchPostBySlug(slug);
}
