import { Metadata } from "next";
import { Suspense } from "react";
import WritingListPage from "./WritingListPage";
import PostCardSkeleton from "@/components/domain/blog/PostCardSkeleton";
import PageContainer from "@/components/layout/PageContainer";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
    absoluteUrl,
    createBreadcrumbJsonLd,
    createCollectionPageJsonLd,
    createImageObjectJsonLd,
    createOrganizationJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

const title = "글";
const description =
    "개발 경험과 인사이트를 공유하는 블로그입니다. 최신 기술 트렌드와 실무 경험을 다룹니다.";
const canonicalUrl = getCanonicalUrl("/writing");
const ogImageUrl = absoluteUrl(SEO_CONFIG.defaultOgImage.path);

export const metadata: Metadata = {
    title,
    description,
    keywords: ["블로그", "개발", "프로그래밍", "기술", "웹개발", "프론트엔드", "백엔드"],
    alternates: {
        canonical: canonicalUrl,
    },
    robots: SEO_CONFIG.robots.index,
    openGraph: {
        title,
        description,
        type: "website",
        url: canonicalUrl,
        siteName: SEO_CONFIG.siteName,
        images: [
            {
                url: ogImageUrl,
                width: SEO_CONFIG.defaultOgImage.width,
                height: SEO_CONFIG.defaultOgImage.height,
                alt: SEO_CONFIG.defaultOgImage.alt,
            },
        ],
        locale: SEO_CONFIG.locale,
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
    },
};

interface BlogPageProps {
    searchParams: Promise<{
        page?: string;
        category?: string;
        tag?: string;
        search?: string;
    }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams.page) || 1;
    const category = resolvedSearchParams.category || "";
    const tag = resolvedSearchParams.tag || "";
    const search = resolvedSearchParams.search || "";

    return (
        <>
            <JsonLdScript
                schemas={[
                    createCollectionPageJsonLd({
                        url: "/writing",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createImageObjectJsonLd({
                        url: "/writing",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createOrganizationJsonLd(),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: "글", path: "/writing" },
                    ]),
                ]}
            />
            <PageContainer>
                <h1 className="mb-8 text-3xl font-bold text-ink">글</h1>
                <Suspense
                    fallback={
                        <div className="grid md:grid-cols-4 gap-8">
                            {/* 사이드바 스켈레톤 */}
                            <aside className="md:col-span-1">
                                <div className="bg-raised backdrop-blur-md rounded-2xl border border-border p-6 animate-pulse space-y-4">
                                    <div className="h-4 w-16 bg-muted rounded" />
                                    <div className="h-10 bg-muted rounded-lg" />
                                    <div className="h-4 w-20 bg-muted rounded mt-6" />
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-8 bg-muted rounded-lg" />
                                    ))}
                                    <div className="h-4 w-10 bg-muted rounded mt-6" />
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-6 w-14 bg-muted rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </aside>
                            {/* 카드 스켈레톤 */}
                            <div className="md:col-span-3">
                                <div className="h-5 w-32 bg-muted rounded mb-8 animate-pulse" />
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <PostCardSkeleton key={i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                >
                    <WritingListPage
                        currentPage={currentPage}
                        category={category}
                        tag={tag}
                        search={search}
                    />
                </Suspense>
            </PageContainer>
        </>
    );
}
