import type { ApiResponse } from "@/types/api";
import type { BlogPost, BlogListResponse, BlogCategoriesResponse, BlogTagsResponse } from "@/types/blog";
import { apiRequest } from "@/lib/utils/apiClient";

// 블로그 포스트 목록 조회 fetcher
type FetchOptions = {
    next?: { revalidate?: number | false; tags?: string[] };
    cache?: RequestCache;
};

interface BlogPostsParams {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: "publishedAt" | "views" | "likes" | "title";
    sortOrder?: "asc" | "desc";
}

export async function fetchBlogPosts(
    params: BlogPostsParams = {},
    options?: FetchOptions,
): Promise<ApiResponse<BlogListResponse["data"]>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.category) searchParams.set("category", params.category);
    if (params.tag) searchParams.set("tag", params.tag);
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const url = `/api/blog/posts?${searchParams.toString()}`;
    const devDefaultCache: RequestCache | undefined =
        process.env.NODE_ENV === "development" ? "no-store" : undefined;
    const finalCache = options?.cache ?? devDefaultCache;
    
    return apiRequest<BlogListResponse["data"]>(url, {
        method: "GET",
        ...(options?.next ? { next: options.next } : {}),
        ...(finalCache ? { cache: finalCache } : {}),
    });
}

export async function fetchBlogCategories(
    options?: FetchOptions,
): Promise<ApiResponse<string[]>> {
    const url = `/api/blog/categories`;
    const devDefaultCache: RequestCache | undefined =
        process.env.NODE_ENV === "development" ? "no-store" : undefined;
    const finalCache = options?.cache ?? devDefaultCache;
    
    return apiRequest<string[]>(url, {
        method: "GET",
        ...(options?.next ? { next: options.next } : {}),
        ...(finalCache ? { cache: finalCache } : {}),
    });
}

export async function fetchBlogTags(
    options?: FetchOptions,
): Promise<ApiResponse<string[]>> {
    const url = `/api/blog/tags`;
    const devDefaultCache: RequestCache | undefined =
        process.env.NODE_ENV === "development" ? "no-store" : undefined;
    const finalCache = options?.cache ?? devDefaultCache;
    
    return apiRequest<string[]>(url, {
        method: "GET",
        ...(options?.next ? { next: options.next } : {}),
        ...(finalCache ? { cache: finalCache } : {}),
    });
}
