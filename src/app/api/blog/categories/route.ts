import { NextResponse } from "next/server";
import { BlogCategoriesResponse } from "@/types/blog";
import { getBlogCategories } from "@/lib/services/blogService";

export async function GET() {
    try {
        const categories = await getBlogCategories();

        const response: BlogCategoriesResponse = {
            result: {
                success: true,
                message: "카테고리 목록을 성공적으로 가져왔습니다.",
            },
            data: categories,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("카테고리 조회 오류:", error);

        const errorResponse: BlogCategoriesResponse = {
            result: {
                success: false,
                message: "카테고리를 가져오는 중 오류가 발생했습니다.",
                code: "FETCH_CATEGORIES_ERROR",
            },
            data: null,
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
