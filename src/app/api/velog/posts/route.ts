import { NextResponse } from "next/server";
import { fetchPostsByTagsAny, fetchPostsByTagsAll } from "@/lib/repositories/velogRepository";
import { getRecentPosts } from "@/lib/services/velogService";
import { ok, fail, type ApiResponse } from "@/types/api";
import type { VelogPostDto } from "@/types/blog";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        // recent=true 이면 최근 포스트 조회로 동작
        const isRecent = searchParams.get("recent") === "true";
        if (isRecent) {
            const limitParam = searchParams.get("limit");
            const limit = limitParam ? Number(limitParam) : 6;
            const data = await getRecentPosts(limit);
            return NextResponse.json<ApiResponse<VelogPostDto[]>>(ok(data as VelogPostDto[]));
        }

        const tagsParam = searchParams.get("tags");
        const mode = (searchParams.get("mode") ?? "any").toLowerCase();
        if (!tagsParam) {
            return NextResponse.json<ApiResponse<null>>(
                fail("Missing tags query param", "VALIDATION_ERROR"),
                {
                    status: 400,
                },
            );
        }
        const tags = tagsParam
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        if (tags.length === 0) {
            return NextResponse.json<ApiResponse<null>>(
                fail("No valid tags provided", "VALIDATION_ERROR"),
                {
                    status: 400,
                },
            );
        }

        const data =
            mode === "all" ? await fetchPostsByTagsAll(tags) : await fetchPostsByTagsAny(tags);
        return NextResponse.json<ApiResponse<VelogPostDto[]>>(ok(data as VelogPostDto[]));
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
