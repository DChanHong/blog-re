"use client";

// 블로그 관련 React Query 훅 + 호환 액션 래퍼
// - 클라이언트 훅(useQuery)로 교체
// - 기존 액션 함수는 호환을 위해 유지
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBlogPosts, fetchBlogCategories, fetchBlogTags } from "@/fetchers/blog";
import type { ApiResponse } from "@/types/api";
import type { BlogListResponse } from "@/types/blog";

interface BlogPostsParams {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: "publishedAt" | "views" | "likes" | "title";
    sortOrder?: "asc" | "desc";
}

// React Query 훅: 블로그 포스트 목록
export function useBlogPostsQuery(params: BlogPostsParams, options?: any) {
    return useQuery<ApiResponse<BlogListResponse["data"]>>({
        queryKey: ["blog", "posts", params],
        queryFn: () => fetchBlogPosts(params),
        staleTime: 30_000,
        placeholderData: keepPreviousData,
        ...(options || {}),
    });
}

// React Query 훅: 카테고리 목록
export function useBlogCategoriesQuery(options?: any) {
    return useQuery<ApiResponse<string[]>>({
        queryKey: ["blog", "categories"],
        queryFn: () => fetchBlogCategories(),
        staleTime: 5 * 60_000,
        ...(options || {}),
    });
}

// React Query 훅: 태그 목록
export function useBlogTagsQuery(options?: any) {
    return useQuery<ApiResponse<string[]>>({
        queryKey: ["blog", "tags"],
        queryFn: () => fetchBlogTags(),
        staleTime: 5 * 60_000,
        ...(options || {}),
    });
}
