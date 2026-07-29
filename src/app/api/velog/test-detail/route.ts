import { NextResponse } from "next/server";
import { crawlVelogDetail } from "@/lib/utils/velogDetailCrawler";
import { fail, ok, type ApiResponse } from "@/types/api";
import type { CrawledVelogDetail } from "@/types/blog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TEST_VELOG_URL =
    "https://velog.io/@hongchee/AI-%EC%97%90%EC%9D%B4%EC%A0%84%ED%8A%B8-3%EC%A3%BC%EC%B0%A8-RAG-1";

export async function GET() {
    try {
        const post = await crawlVelogDetail(TEST_VELOG_URL);
        return NextResponse.json<ApiResponse<CrawledVelogDetail>>(ok(post), { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "CRAWL_FAILED"), { status: 500 });
    }
}
