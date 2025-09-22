import type { ChatbotAskRequest, ChatbotAnswerDto } from "@/types/chatbot";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/utils/env";

export async function askChatbotApi(payload: ChatbotAskRequest): Promise<ChatbotAnswerDto> {
    const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL || ""}/api/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.result?.success) {
        const message: string = json?.result?.message || "요청에 실패했습니다.";
        throw new Error(message);
    }
    return json.data as ChatbotAnswerDto;
}
