import { NextResponse } from "next/server";
import { ok, fail, type ApiResponse } from "@/types/api";
import { getFaqList } from "@/lib/services/chatbotService";
import type { FaqRow } from "@/lib/repositories/chatbotRepository";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const faqs = await getFaqList({ category: category ?? undefined });
        return NextResponse.json<ApiResponse<FaqRow[]>>(ok(faqs));
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
