import { fetchAllTags } from "@/lib/repositories/velogRepository";
import { fetchBlogPosts, fetchBlogCategories } from "@/lib/repositories/blogRepository";
import type { BlogSearchParams, VelogPostDto } from "@/types/blog";

// 더 이상 가공하지 않고 velog 테이블 스키마 그대로 반환

export async function getBlogPosts(params: BlogSearchParams) {
    const {
        page = 1,
        limit = 12,
        category,
        tag,
        search,
        sortBy = "publishedAt",
        sortOrder = "desc",
    } = params;

    try {
        // 페이지네이션 계산
        const offset = (page - 1) * limit;

        // 데이터 가져오기
        const { posts: velogPosts, totalCount } = await fetchBlogPosts({
            limit,
            offset,
            category,
            tag,
            search,
            sortBy,
            sortOrder,
        });

        // 페이지네이션 정보 계산
        const totalPages = Math.ceil(totalCount / limit);

        return {
            posts: velogPosts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts: totalCount,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    } catch (error) {
        console.error("getBlogPosts 오류:", error);
        throw error;
    }
}

export async function getBlogCategories() {
    try {
        return await fetchBlogCategories();
    } catch (error) {
        console.error("getBlogCategories 오류:", error);
        throw error;
    }
}

export async function getBlogTags() {
    try {
        return await fetchAllTags();
    } catch (error) {
        console.error("getBlogTags 오류:", error);
        throw error;
    }
}
