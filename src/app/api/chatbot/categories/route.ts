import { NextResponse } from "next/server";
import { ok, fail, type ApiResponse } from "@/types/api";
import { getFaqCategories } from "@/lib/services/chatbotService";

export async function GET() {
    try {
        const categories = await getFaqCategories();
        return NextResponse.json<ApiResponse<string[]>>(ok(categories));
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
