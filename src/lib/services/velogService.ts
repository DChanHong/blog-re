import { getHtml } from "@/lib/utils/crawler";
import { getExistingTitles, insertNewRows } from "@/lib/repositories/velogRepository";
import type { BlogCrawl, BlogListRow } from "@/types/blog";

function stringFilter(arr: string[]) {
    return arr.join(",");
}

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

export async function crawlAndPersist(url: string) {
    console.log(`[service] start crawlAndPersist url=${url}`);
    const articles: BlogCrawl[] = await getHtml(url);
    console.log(`[service] crawled articles=${articles.length}`);
    if (articles.length === 0) return { inserted: 0, scanned: 0 };

    const existing = await getExistingTitles();
    console.log(`[service] existing titles=${existing.length}`);
    const toInsert: BlogListRow[] = articles
        .filter((a) => !existing.includes(a.title))
        .map((item) => ({
            title: item.title ?? "",
            img_src: item.img_src ?? "",
            created_at: parseCreatedAt(item.created_at),
            tags: stringFilter(item.tags),
            detail_link: item.detail_link ?? "",
            intro: item.intro ?? "",
        }));

    console.log(`[service] toInsert=${toInsert.length}`);
    const inserted = await insertNewRows(toInsert);
    console.log(`[service] inserted=${inserted}`);
    return { inserted, scanned: articles.length };
}
