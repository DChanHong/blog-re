import { NextResponse } from "next/server";
import { fetchPostsByTagsAny, fetchPostsByTagsAll } from "@/lib/repositories/velogRepository";
import { ok, fail, type ApiResponse } from "@/types/api";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
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
        return NextResponse.json<ApiResponse<any[]>>(ok(data));
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
