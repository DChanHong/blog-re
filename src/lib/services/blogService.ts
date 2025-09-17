import { 
    fetchAllTags, 
} from "@/lib/repositories/velogRepository";
import { 
    fetchBlogPosts, 
    fetchBlogCategories 
} from "@/lib/repositories/blogRepository";
import type { BlogPost, BlogSearchParams } from "@/types/blog";
import type { VelogPostDto } from "@/types/blog";

// VelogPostDto를 BlogPost로 변환하는 함수
function velogToBlogPost(velog: VelogPostDto): BlogPost {
    // 태그에서 카테고리 추출 (첫 번째 태그를 카테고리로 사용)
    const category = velog.tags && velog.tags.length > 0 ? velog.tags[0] : "기타";
    
    // 읽기 시간 계산 (대략적으로 한국어 기준 분당 200자)
    const readingTime = Math.max(1, Math.ceil((velog.intro?.length || 300) / 200));
    
    return {
        id: velog.id || "",
        title: velog.title,
        content: velog.intro || "",
        summary: velog.intro?.substring(0, 150) + "..." || "",
        slug: velog.detail_link || "",
        category: category,
        tags: velog.tags || [],
        author: "찬홍",
        publishedAt: velog.created_at,
        updatedAt: velog.inserted_at || velog.created_at,
        thumbnail: velog.img_src || undefined,
        views: Math.floor(Math.random() * 1000) + 100, // 임시 조회수
        likes: Math.floor(Math.random() * 50) + 10, // 임시 좋아요
        readingTime: readingTime,
        status: "published" as const,
    };
}

export async function getBlogPosts(params: BlogSearchParams) {
    const {
        page = 1,
        limit = 12,
        category,
        tag,
        search,
        sortBy = "publishedAt",
        sortOrder = "desc"
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
            sortOrder
        });

        // VelogPostDto를 BlogPost로 변환
        const blogPosts = velogPosts.map(velogToBlogPost);

        // 페이지네이션 정보 계산
        const totalPages = Math.ceil(totalCount / limit);

        return {
            posts: blogPosts,
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
