import { Metadata } from "next";
import { Suspense } from "react";
import BlogListPage from "./BlogListPage";
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
            <PageContainer outerClassName="min-h-[calc(100vh)]">
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
        </>
    );
}
