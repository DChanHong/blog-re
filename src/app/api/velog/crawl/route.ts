import { NextResponse } from "next/server";
import {
    backfillPostDetails,
    crawlAndPersist,
    refreshPostDetails,
} from "@/lib/services/velogService";
import { ok, fail, type ApiResponse } from "@/types/api";
import { getHtml } from "@/lib/utils/crawler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CrawlData {
    inserted: number;
    scanned: number;
    detailUpdated: number;
    detailFailed: number;
}

interface BackfillData {
    scanned: number;
    updated: number;
    failed: number;
}

interface RefreshData {
    scanned: number;
    updated: number;
    unchanged: number;
    failed: number;
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
        const backfill = searchParams.get("backfill");
        const refresh = searchParams.get("refresh");
        const limitParam = searchParams.get("limit");
        const detailLimitParam = searchParams.get("detailLimit");
        const limit = limitParam ? Number(limitParam) : undefined;
        const detailLimit = detailLimitParam ? Number(detailLimitParam) : limit;
        console.log(
            `[api] GET /api/velog/crawl url=${url} expected=${expected ?? "-"} only=${only ?? "-"} backfill=${backfill ?? "-"} refresh=${refresh ?? "-"} limit=${limit ?? "-"}`,
        );

        if (backfill === "detail") {
            const result = await backfillPostDetails(limit);
            console.log(
                `[api] detail backfill scanned=${result.scanned} updated=${result.updated} failed=${result.failed}`,
            );
            return NextResponse.json<ApiResponse<BackfillData>>(
                ok({
                    scanned: result.scanned,
                    updated: result.updated,
                    failed: result.failed,
                }),
                { status: 200 },
            );
        }

        if (refresh === "detail") {
            const result = await refreshPostDetails(limit);
            console.log(
                `[api] detail refresh scanned=${result.scanned} updated=${result.updated} unchanged=${result.unchanged} failed=${result.failed}`,
            );
            return NextResponse.json<ApiResponse<RefreshData>>(
                ok({
                    scanned: result.scanned,
                    updated: result.updated,
                    unchanged: result.unchanged,
                    failed: result.failed,
                }),
                { status: 200 },
            );
        }

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

        const result = await crawlAndPersist(url, expected, detailLimit);
        console.log(
            `[api] result inserted=${result.inserted} scanned=${result.scanned} detailUpdated=${result.detailUpdated} detailFailed=${result.detailFailed}`,
        );
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
