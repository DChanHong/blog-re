export interface BlogCrawl {
    title: string;
    img_src: string;
    created_at: string;
    tags: string[];
    detail_link: string;
    intro: string;
}

// Supabase velog 테이블에 insert 할 때 사용하는 타입
export interface VelogInsertRow {
    title: string;
    img_src: string;
    created_at: string | Date;
    tags: string[];
    detail_link: string;
    intro: string;
}

// API 응답에 사용하는 DTO 타입
export interface VelogPostDto {
    id?: string;
    title: string;
    img_src: string;
    created_at: string; // ISO 문자열
    tags: string[];
    detail_link: string;
    intro: string;
    inserted_at?: string;
}

// 블로그 포스트 관련 타입 정의
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    summary: string;
    slug: string;
    category: string;
    tags: string[];
    author: string;
    publishedAt: string;
    updatedAt: string;
    thumbnail?: string;
    views: number;
    likes: number;
    readingTime: number; // 분 단위
    status: "draft" | "published" | "archived";
}

export interface BlogCategory {
    name: string;
    slug: string;
    description?: string;
    postCount: number;
}

export interface BlogTag {
    name: string;
    slug: string;
    postCount: number;
}

// API 응답 타입
export interface BlogListResponse {
    result: {
        success: boolean;
        message?: string;
        code?: string;
    };
    data: {
        posts: VelogPostDto[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalPosts: number;
            limit: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    } | null;
}

export interface BlogPostResponse {
    result: {
        success: boolean;
        message?: string;
        code?: string;
    };
    data: BlogPost | null;
}

export interface BlogCategoriesResponse {
    result: {
        success: boolean;
        message?: string;
        code?: string;
    };
    data: string[] | null;
}

export interface BlogTagsResponse {
    result: {
        success: boolean;
        message?: string;
        code?: string;
    };
    data: string[] | null;
}

// 검색/필터 파라미터
export interface BlogSearchParams {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: "publishedAt" | "views" | "likes" | "title";
    sortOrder?: "asc" | "desc";
}
