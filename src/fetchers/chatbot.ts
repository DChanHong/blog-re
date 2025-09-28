import type { ChatbotAskRequest, ChatbotAnswerDto, ChatbotFaqDto } from "@/types/chatbot";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/utils/env";
import { apiRequest, toJsonBody } from "@/lib/utils/apiClient";

export async function askChatbotApi(payload: ChatbotAskRequest): Promise<ChatbotAnswerDto> {
    const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL || ""}/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: payload.question }),
    });
    const json = await res.json();
    if (!res.ok || !json?.result?.success) {
        const message: string = json?.result?.message || "요청에 실패했습니다.";
        throw new Error(message);
    }
    return json.data as ChatbotAnswerDto;
}

// FAQ 목록 조회 (옵셔널 category 필터)
export async function fetchChatbotFaqs(category?: string) {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    return apiRequest<ChatbotFaqDto[]>(`/api/chatbot/faqs${qs}`, {
        method: "GET",
        cache: process.env.NODE_ENV === "development" ? "no-store" : undefined,
    });
}

// 카테고리 목록 조회
export async function fetchChatbotCategories() {
    return apiRequest<string[]>(`/api/chatbot/categories`, {
        method: "GET",
        cache: process.env.NODE_ENV === "development" ? "no-store" : undefined,
    });
}

// FAQ 클릭 히트 증가
export async function incrementChatbotFaqHit(faqId: string) {
    return apiRequest<null>(`/api/chatbot/faqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: toJsonBody({ faqId }),
        cache: "no-store",
    });
}
