import { NextResponse } from "next/server";
import { crawlAndPersist } from "@/lib/services/velogService";
import { ok, fail, type ApiResponse } from "@/types/api";
import { getHtml } from "@/lib/utils/crawler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CrawlData {
    inserted: number;
    scanned: number;
}

interface DryRunData {
    scanned: number;
    sampleTitles: string[];
}

export async function GET(request: Request) {
    try {
        const url = process.env.NEXT_PUBLIC_BLOG_URL || "";
        const { searchParams } = new URL(request.url);
        const expectedParam = searchParams.get("expected");
        const expected = expectedParam ? Number(expectedParam) : undefined;
        const only = searchParams.get("only");
        console.log(
            `[api] GET /api/velog/crawl url=${url} expected=${expected ?? "-"} only=${only ?? "-"}`,
        );

        if (!url) {
            console.warn(`[api] missing NEXT_PUBLIC_BLOG_URL`);
            return NextResponse.json<ApiResponse<null>>(
                fail("Missing NEXT_PUBLIC_BLOG_URL", "CONFIG_MISSING"),
                { status: 400 },
            );
        }

        if (only === "dry") {
            const articles = await getHtml(url, expected);
            console.log(`[api] dry mode: crawled ${articles.length} articles`);

            console.log("articles", articles);
            const sampleTitles = articles.slice(0, 5).map((a) => a.title);
            return NextResponse.json<ApiResponse<DryRunData>>(
                ok({ scanned: articles.length, sampleTitles }),
                {
                    status: 200,
                },
            );
        }

        const result = await crawlAndPersist(url, expected);
        console.log(`[api] result inserted=${result.inserted} scanned=${result.scanned}`);
        return NextResponse.json<ApiResponse<CrawlData>>(ok(result), {
            status: 200,
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        console.error(`[api] error`, e);
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
