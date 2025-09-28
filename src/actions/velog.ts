"use client";

// 최근 포스트 조회 서버 액션
import { fetchRecentPosts } from "@/fetchers/velog";
import type { VelogPostDto } from "@/types/blog";
import { useQuery } from "@tanstack/react-query";

// 서버 액션이 아니라 클라이언트 훅으로 전환 (React Query 사용)
export async function getRecentPostsAction(
    limit = 6,
): Promise<{ success: boolean; data: VelogPostDto[] }> {
    const res = await fetchRecentPosts(limit);
    if (!res.result.success || !res.data) return { success: false, data: [] };
    return { success: true, data: res.data };
}

// 클라이언트 훅: React Query로 최근 포스트 조회
export function useRecentPostsQuery(limit = 6, options?: any) {
    return useQuery({
        queryKey: ["velog", "recent", limit],
        queryFn: () => fetchRecentPosts(limit),
        staleTime: 60_000,
        ...(options || {}),
    });
}
