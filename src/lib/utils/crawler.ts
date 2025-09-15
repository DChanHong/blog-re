import * as cheerio from "cheerio";
import puppeteer, { type Page } from "puppeteer-core";
import type { BlogCrawl } from "@/types/blog";

const ARTICLE_SELECTOR = "main section > div:nth-child(2) > div:nth-child(3) > div";

async function delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

async function autoScrollAndWait(
    page: Page,
    targetCount?: number,
    maxScrolls: number = 40,
): Promise<void> {
    let lastCount = 0;
    for (let i = 0; i < maxScrolls; i++) {
        const count = await page.$$eval(ARTICLE_SELECTOR, (els) => els.length);
        console.log(`[crawler] scroll#${i} items=${count}`);
        if (targetCount && count >= targetCount) {
            console.log(`[crawler] reached targetCount=${targetCount}`);
            break;
        }
        if (count === lastCount && i > 0) {
            // no growth, try one more scroll
        }
        lastCount = count;
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await delay(900);
    }
}

export const openBrowser = async (
    url: string,
    options?: { targetCount?: number; maxScrolls?: number },
): Promise<string> => {
    try {
        console.log(`[crawler] openBrowser url=${url}`);
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        });
        console.log(`[crawler] browser launched`);

        const page = await browser.newPage();
        try {
            await page.goto(url, { waitUntil: "networkidle2" });
            console.log(`[crawler] page loaded: ${url}`);
        } catch (gotoError) {
            console.error(`[crawler] page.goto error`, gotoError);
            await browser.close();
            throw gotoError;
        }

        await autoScrollAndWait(page, options?.targetCount, options?.maxScrolls);

        const content = await page.content();
        const countAfter = await page.$$eval(ARTICLE_SELECTOR, (els) => els.length);
        console.log(`[crawler] content length=${content.length} items=${countAfter}`);
        await page.close();
        await browser.close();
        return content;
    } catch (error) {
        console.error(`[crawler] openBrowser error`, error);
        return "";
    }
};

export const getHtml = async (url: string, expectedCount?: number): Promise<BlogCrawl[]> => {
    console.log(`[crawler] getHtml url=${url} expectedCount=${expectedCount ?? "-"}`);
    const html = await openBrowser(url, { targetCount: expectedCount });
    if (!html) {
        console.warn(`[crawler] empty html for url=${url}`);
        return [];
    }

    const $ = cheerio.load(html);
    const nodes = $(ARTICLE_SELECTOR);
    console.log(`[crawler] article nodes=${nodes.length}`);

    const getTag = (tagSelector: any) => {
        const result: string[] = [];
        $(tagSelector)
            .find(".FlatPostCard_tagsWrapper__iNQR3 > a")
            .each((idx, el) => {
                result[idx] = $(el).text();
            });
        return result;
    };

    const content: BlogCrawl[] = [];
    nodes.each((idx, el) => {
        content.push({
            img_src: $(el).find("img").attr("src") ?? "",
            created_at: $(el).find(".FlatPostCard_subInfo__cT3J6 > span:first-of-type").text(),
            intro: $(el).find("p").text(),
            detail_link: $(el).find("a:first-child").attr("href") ?? "",
            title: $(el).find("h2").text(),
            tags: getTag(el),
        });
    });

    console.log(`[crawler] parsed articles=${content.length}`);
    if (content[0]) {
        console.log(`[crawler] first title="${content[0].title}"`);
    }
    return content;
};
