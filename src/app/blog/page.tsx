import { Metadata } from "next";
import { Suspense } from "react";
import BlogListPage from "./BlogListPage";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-12">
                {/* 페이지 헤더 */}
                {/* <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        개발 블로그
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        개발 경험과 기술적 인사이트를 공유합니다
                    </p>
                </div> */}

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
            </div>
        </div>
    );
}
