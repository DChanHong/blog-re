import { Metadata } from "next";
import { Suspense } from "react";
import BlogListPage from "./BlogListPage";
import PostCardSkeleton from "@/components/domain/blog/PostCardSkeleton";
import PageContainer from "@/components/layout/PageContainer";
import { SparklesClient } from "@/components/ui/sparkles-client";
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

const title = "블로그 | 찬홍의 개발 이야기";
const description =
    "개발 경험과 인사이트를 공유하는 블로그입니다. 최신 기술 트렌드와 실무 경험을 다룹니다.";
const canonicalUrl = getCanonicalUrl("/blog");
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
                        url: "/blog",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createImageObjectJsonLd({
                        url: "/blog",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createOrganizationJsonLd(),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: "블로그", path: "/blog" },
                    ]),
                ]}
            />
            {/* SparklesCore 배경 */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-black">
                <SparklesClient
                    id="tsparticlesblog"
                    background="black"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <PageContainer outerClassName="min-h-[calc(100vh)] relative z-10">
                <Suspense
                    fallback={
                        <div className="grid md:grid-cols-4 gap-8">
                            {/* 사이드바 스켈레톤 */}
                            <aside className="md:col-span-1">
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 animate-pulse space-y-4">
                                    <div className="h-4 w-16 bg-gray-700/60 rounded" />
                                    <div className="h-10 bg-gray-700/40 rounded-lg" />
                                    <div className="h-4 w-20 bg-gray-700/60 rounded mt-6" />
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-8 bg-gray-700/30 rounded-lg" />
                                    ))}
                                    <div className="h-4 w-10 bg-gray-700/60 rounded mt-6" />
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <div key={i} className="h-6 w-14 bg-gray-700/30 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </aside>
                            {/* 카드 스켈레톤 */}
                            <main className="md:col-span-3">
                                <div className="h-5 w-32 bg-gray-700/40 rounded mb-8 animate-pulse" />
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <PostCardSkeleton key={i} />
                                    ))}
                                </div>
                            </main>
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
        </>
    );
}
