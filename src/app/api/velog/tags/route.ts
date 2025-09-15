import { NextResponse } from "next/server";
import { fetchAllTags } from "@/lib/repositories/velogRepository";
import { ok, fail, type ApiResponse } from "@/types/api";

export async function GET() {
    try {
        const tags = await fetchAllTags();
        return NextResponse.json<ApiResponse<string[]>>(ok(tags));
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
