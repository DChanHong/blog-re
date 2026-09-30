"use client";

// 챗봇 관련 React Query 훅
import { useQuery } from "@tanstack/react-query";
import { fetchChatbotCategories, fetchChatbotFaqs } from "@/fetchers/chatbot";
import type { ApiResponse } from "@/types/api";
import type { ChatbotFaqDto } from "@/types/chatbot";

export function useChatbotCategoriesQuery(options?: any) {
    return useQuery<ApiResponse<string[]>>({
        queryKey: ["chatbot", "categories"],
        queryFn: () => fetchChatbotCategories(),
        staleTime: 5 * 60_000,
        ...(options || {}),
    });
}

export function useChatbotFaqsQuery(category?: string, options?: any) {
    return useQuery<ApiResponse<ChatbotFaqDto[]>>({
        queryKey: ["chatbot", "faqs", category || "all"],
        queryFn: () => fetchChatbotFaqs(category),
        staleTime: 60_000,
        ...(options || {}),
    });
}
