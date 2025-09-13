import { NextResponse } from "next/server";
import { crawlAndPersist } from "@/lib/services/velogService";
import { ok, fail, type ApiResponse } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CrawlData {
    inserted: number;
    scanned: number;
}

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_BLOG_URL || "";
        console.log(`[api] GET /api/velog/crawl url=${url}`);
        if (!url) {
            console.warn(`[api] missing NEXT_PUBLIC_BLOG_URL`);
            return NextResponse.json<ApiResponse<null>>(
                fail("Missing NEXT_PUBLIC_BLOG_URL", "CONFIG_MISSING"),
                { status: 400 },
            );
        }

        const result = await crawlAndPersist(url);
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
