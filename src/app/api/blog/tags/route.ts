import { NextResponse } from "next/server";
import { BlogTagsResponse } from "@/types/blog";
import { getBlogTags } from "@/lib/services/blogService";

export async function GET() {
    try {
        const tags = await getBlogTags();

        const response: BlogTagsResponse = {
            result: {
                success: true,
                message: "태그 목록을 성공적으로 가져왔습니다.",
            },
            data: tags,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("태그 조회 오류:", error);

        const errorResponse: BlogTagsResponse = {
            result: {
                success: false,
                message: "태그를 가져오는 중 오류가 발생했습니다.",
                code: "FETCH_TAGS_ERROR",
            },
            data: null,
        };

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
