import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
import type { VelogPostDto, BlogSearchParams } from "@/types/blog";

interface FetchBlogPostsParams {
    limit: number;
    offset: number;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: BlogSearchParams["sortBy"];
    sortOrder?: BlogSearchParams["sortOrder"];
}

export async function fetchBlogPosts(params: FetchBlogPostsParams) {
    console.log(`[blogRepo] fetchBlogPosts`, params);
    const supabase = createSupabaseServerClient();
    
    let query = supabase.from("velog").select("*", { count: "exact" });
    
    // 검색 필터
    if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,intro.ilike.%${params.search}%`);
    }
    
    // 카테고리 필터 (태그의 첫 번째 요소로 카테고리 판단)
    if (params.category) {
        query = query.contains("tags", [params.category]);
    }
    
    // 태그 필터
    if (params.tag) {
        query = query.overlaps("tags", [params.tag]);
    }
    
    // 정렬
    const sortColumn = params.sortBy === "publishedAt" ? "created_at" : "created_at";
    const ascending = params.sortOrder === "asc";
    query = query.order(sortColumn, { ascending });
    
    // 페이지네이션
    query = query.range(params.offset, params.offset + params.limit - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
        console.error(`[blogRepo] fetchBlogPosts error`, error);
        throw error;
    }
    
    const posts: VelogPostDto[] = (data || []).map((row: any) => ({
        id: row.id?.toString(),
        title: row.title,
        img_src: row.img_src,
        created_at: row.created_at,
        tags: row.tags || [],
        detail_link: row.detail_link,
        intro: row.intro,
        inserted_at: row.inserted_at,
    }));
    
    console.log(`[blogRepo] fetchBlogPosts found=${posts.length}, total=${count}`);
    
    return {
        posts,
        totalCount: count || 0,
    };
}

export async function fetchBlogCategories() {
    console.log(`[blogRepo] fetchBlogCategories`);
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase.from("velog").select("tags");
    
    if (error) {
        console.error(`[blogRepo] fetchBlogCategories error`, error);
        throw error;
    }
    
    // 모든 태그에서 첫 번째 태그들을 카테고리로 추출
    const categorySet = new Set<string>();
    
    for (const row of data || []) {
        const tags = (row as any).tags as string[];
        if (tags && tags.length > 0) {
            categorySet.add(tags[0]);
        }
    }
    
    const categories = Array.from(categorySet).sort();
    console.log(`[blogRepo] fetchBlogCategories found=${categories.length}`);
    
    return categories;
}
