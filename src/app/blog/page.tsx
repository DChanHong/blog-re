import { Metadata } from "next";
import { Suspense } from "react";
import BlogListPage from "./BlogListPage";
import PageContainer from "@/components/layout/PageContainer";

export const metadata: Metadata = {
    title: "블로그 | 찬홍의 개발 이야기",
    description:
        "개발 경험과 인사이트를 공유하는 블로그입니다. 최신 기술 트렌드와 실무 경험을 다룹니다.",
    keywords: ["블로그", "개발", "프로그래밍", "기술", "웹개발", "프론트엔드", "백엔드"],
    openGraph: {
        title: "블로그 | 찬홍의 개발 이야기",
        description: "개발 경험과 인사이트를 공유하는 블로그입니다.",
        type: "website",
        url: "/blog",
    },
    twitter: {
        card: "summary_large_image",
        title: "블로그 | 찬홍의 개발 이야기",
        description: "개발 경험과 인사이트를 공유하는 블로그입니다.",
    },
};

interface BlogPageProps {
    searchParams: {
        page?: string;
        category?: string;
        tag?: string;
        search?: string;
    };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
    const currentPage = Number(searchParams.page) || 1;
    const category = searchParams.category || "";
    const tag = searchParams.tag || "";
    const search = searchParams.search || "";

    return (
        <PageContainer>
            <Suspense
                fallback={
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                }
            >
                <BlogListPage
                    currentPage={currentPage}
                    category={category}
                    tag={tag}
                    search={search}
                />
            </Suspense>
        </PageContainer>
    );
}
