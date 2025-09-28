import { NextResponse } from "next/server";
import { ok, fail, type ApiResponse } from "@/types/api";
import { askChatbot } from "@/lib/services/chatbotService";
import type { ChatbotAnswerDto, ChatbotAskRequest } from "@/types/chatbot";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ChatbotAskRequest;
        const question = (body?.question || "").trim();
        if (!question) {
            return NextResponse.json<ApiResponse<null>>(
                fail("question is required", "VALIDATION_ERROR"),
                { status: 400 },
            );
        }

        const result = await askChatbot(request, question);
        if (result.type === "ok") {
            return NextResponse.json<ApiResponse<ChatbotAnswerDto>>(ok(result.data));
        }
        if (result.type === "rate_limited") {
            return NextResponse.json<ApiResponse<null>>(
                fail(`${result.message} (${result.retryAfterMinutes}분 남음)`, "RATE_LIMITED"),
                { status: 429 },
            );
        }
        if (result.type === "config_missing") {
            return NextResponse.json<ApiResponse<null>>(fail(result.message, "CONFIG_MISSING"), {
                status: 400,
            });
        }
        return NextResponse.json<ApiResponse<null>>(fail(result.message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json<ApiResponse<null>>(fail(message, "UNEXPECTED_ERROR"), {
            status: 500,
        });
    }
}
