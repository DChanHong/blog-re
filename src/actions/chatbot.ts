"use client";

// 챗봇 관련 React Query 훅
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchChatbotCategories,
    fetchChatbotFaqs,
    incrementChatbotFaqHit,
} from "@/fetchers/chatbot";
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

// FAQ 히트 증가 액션 (낙관적 업데이트 포함)
export function useIncrementFaqHitMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (faqId: string) => {
            const res = await incrementChatbotFaqHit(faqId);
            if (!res.result.success) throw new Error(res.result.message || "update failed");
            return true;
        },
        onMutate: async (faqId: string) => {
            // 낙관적 업데이트: 캐시된 FAQ 리스트에서 해당 항목의 hit +1
            const keys = qc
                .getQueryCache()
                .findAll({ queryKey: ["chatbot", "faqs"] })
                .map((q) => q.queryKey);
            const prev: Array<{ key: any[]; data: ApiResponse<ChatbotFaqDto[]> | undefined }> = [];
            for (const key of keys) {
                const data = qc.getQueryData<ApiResponse<ChatbotFaqDto[]>>(key as any);
                prev.push({ key: key as any[], data });
                if (data?.result.success && Array.isArray(data.data)) {
                    const cloned = data.data.map((f) =>
                        f.id === faqId ? { ...f, hit: (f.hit ?? 0) + 1 } : f,
                    );
                    qc.setQueryData(key as any, { ...data, data: cloned });
                }
            }
            return { prev };
        },
        onError: (_err, _variables, ctx) => {
            // 롤백
            if (ctx?.prev) {
                for (const { key, data } of ctx.prev) {
                    qc.setQueryData(key as any, data);
                }
            }
        },
    });
}
