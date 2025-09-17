"use server";

// 블로그 관련 서버 액션 (React Query용)
import { fetchBlogPosts, fetchBlogCategories, fetchBlogTags } from "@/fetchers/blog";

interface BlogPostsParams {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: "publishedAt" | "views" | "likes" | "title";
    sortOrder?: "asc" | "desc";
}

export async function getBlogPostsAction(params: BlogPostsParams = {}) {
    const res = await fetchBlogPosts(params);
    if (!res.result.success || !res.data) {
        return { success: false, data: { posts: [], pagination: null } };
    }
    return { success: true, data: res.data };
}

export async function getBlogCategoriesAction() {
    const res = await fetchBlogCategories();
    if (!res.result.success || !res.data) {
        return { success: false, data: [] };
    }
    return { success: true, data: res.data };
}

export async function getBlogTagsAction() {
    const res = await fetchBlogTags();
    if (!res.result.success || !res.data) {
        return { success: false, data: [] };
    }
    return { success: true, data: res.data };
}
