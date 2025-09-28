export type ChatRole = "user" | "assistant";

export interface ChatHistoryMessage {
    role: ChatRole;
    content: string;
}

export interface ChatbotAskRequest {
    question: string;
    threadId?: string;
    history?: ChatHistoryMessage[];
}

export interface ChatbotAnswerDto {
    answer: string;
    threadId: string;
    limited?: boolean;
    retryAfterMinutes?: number;
}

export type AskResult =
    | { type: "ok"; data: ChatbotAnswerDto }
    | { type: "rate_limited"; message: string; retryAfterMinutes: number }
    | { type: "config_missing"; message: string }
    | { type: "error"; message: string };

// FAQ DTO (프론트엔드 전송용)
export interface ChatbotFaqDto {
    id: string;
    question: string;
    answer: string;
    category?: string | null;
    sorting?: number | null;
    created_at?: string;
}
