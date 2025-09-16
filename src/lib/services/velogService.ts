import { getHtml } from "@/lib/utils/crawler";
import { getExistingKeys, insertRows, fetchRecentPosts } from "@/lib/repositories/velogRepository";
import type { BlogCrawl, VelogInsertRow } from "@/types/blog";

function createDate(now: Date, daysAgo: number) {
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);
    date.setHours(18, 0, 0, 0);
    return date;
}

function parseCreatedAt(label: string): Date {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(18, 0, 0, 0);

    if (label === "어제") return yesterday;
    if (label.includes("전")) {
        const days = Number(label.substring(0, 1));
        return createDate(now, days);
    }
    return new Date(label.replace("년 ", "-").replace("월 ", "-").replace("일", ""));
}

export async function crawlAndPersist(url: string, expectedCount?: number) {
    console.log(`[service] start crawlAndPersist url=${url} expected=${expectedCount ?? "-"}`);
    const articles: BlogCrawl[] = await getHtml(url, expectedCount);
    console.log(`[service] crawled articles=${articles.length}`);
    if (articles.length === 0) return { inserted: 0, scanned: 0 };

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
        }));

    console.log(`[service] toInsert=${toInsert.length}`);
    const inserted = await insertRows(toInsert);
    console.log(`[service] inserted=${inserted}`);
    return { inserted, scanned: articles.length };
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
