import { NextRequest, NextResponse } from "next/server";
import { BlogListResponse, BlogSearchParams } from "@/types/blog";
import { getBlogPosts } from "@/lib/services/blogService";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // 쿼리 파라미터 파싱
        const params: BlogSearchParams = {
            page: parseInt(searchParams.get("page") || "1"),
            limit: parseInt(searchParams.get("limit") || "8"),
            category: searchParams.get("category") || undefined,
            tag: searchParams.get("tag") || undefined,
            search: searchParams.get("search") || undefined,
            sortBy: (searchParams.get("sortBy") || "publishedAt") as BlogSearchParams["sortBy"],
            sortOrder: (searchParams.get("sortOrder") || "desc") as BlogSearchParams["sortOrder"],
        };

        // Supabase에서 데이터 가져오기
        const result = await getBlogPosts(params);

        const response: BlogListResponse = {
            result: {
                success: true,
                message: "블로그 포스트 목록을 성공적으로 가져왔습니다.",
            },
            data: result,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("블로그 포스트 조회 오류:", error);

        const errorResponse: BlogListResponse = {
            result: {
                success: false,
                message: "블로그 포스트를 가져오는 중 오류가 발생했습니다.",
                code: "FETCH_POSTS_ERROR",
            },
            data: null,
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
