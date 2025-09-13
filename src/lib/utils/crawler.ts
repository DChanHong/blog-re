import * as cheerio from "cheerio";
import puppeteer from "puppeteer-core";
import type { BlogCrawl } from "@/types/blog";

export const openBrowser = async (url: string): Promise<string> => {
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

        const content = await page.content();
        console.log(`[crawler] content length=${content.length}`);
        await page.close();
        await browser.close();
        return content;
    } catch (error) {
        console.error(`[crawler] openBrowser error`, error);
        return "";
    }
};

export const getHtml = async (url: string): Promise<BlogCrawl[]> => {
    console.log(`[crawler] getHtml url=${url}`);
    const html = await openBrowser(url);
    if (!html) {
        console.warn(`[crawler] empty html for url=${url}`);
        return [];
    }

    const $ = cheerio.load(html);
    const ARTICLE_SELECTOR = "main section > div:nth-child(2) > div:nth-child(3) > div";
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
