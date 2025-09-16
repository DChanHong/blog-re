"use server";

// 최근 포스트 조회 서버 액션
import { fetchRecentPosts } from "@/fetchers/velog";
import type { VelogPostDto } from "@/types/blog";

export async function getRecentPostsAction(
    limit = 6,
): Promise<{ success: boolean; data: VelogPostDto[] }> {
    const res = await fetchRecentPosts(limit);
    if (!res.result.success || !res.data) {
        return { success: false, data: [] };
    }
    return { success: true, data: res.data };
}
