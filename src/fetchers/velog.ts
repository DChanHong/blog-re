import type { ApiResponse } from "@/types/api";
import type { VelogPostDto } from "@/types/blog";
import { apiRequest } from "@/lib/utils/apiClient";

// 최근 포스트 조회 fetcher
type FetchOptions = {
    next?: { revalidate?: number | false; tags?: string[] };
    cache?: RequestCache;
};

export async function fetchRecentPosts(
    limit = 6,
    options?: FetchOptions,
): Promise<ApiResponse<VelogPostDto[]>> {
    const url = `/api/velog/posts?recent=true&limit=${encodeURIComponent(String(limit))}`;
    const devDefaultCache: RequestCache | undefined =
        process.env.NODE_ENV === "development" ? "no-store" : undefined;
    const finalCache = options?.cache ?? devDefaultCache;
    return apiRequest<VelogPostDto[]>(url, {
        method: "GET",
        ...(options?.next ? { next: options.next } : {}),
        ...(finalCache ? { cache: finalCache } : {}),
    });
}
