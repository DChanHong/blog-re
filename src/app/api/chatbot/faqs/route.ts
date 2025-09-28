import { NextResponse } from "next/server";
import { ok, fail, type ApiResponse } from "@/types/api";
import { getFaqList, increaseFaqHit } from "@/lib/services/chatbotService";
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

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { faqId?: string };
        const faqId = (body?.faqId || "").trim();
        if (!faqId) {
            return NextResponse.json<ApiResponse<null>>(
                fail("faqId is required", "VALIDATION_ERROR"),
                { status: 400 },
            );
        }
        const res = await increaseFaqHit(faqId);
        if (!res.ok) {
            return NextResponse.json<ApiResponse<null>>(fail(res.message, "UNEXPECTED_ERROR"), {
                status: 500,
            });
        }
        return NextResponse.json<ApiResponse<null>>(ok(null));
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
