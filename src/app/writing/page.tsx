import { Metadata } from "next";
import { Suspense } from "react";
import WritingListPage from "./WritingListPage";
import WritingSkeleton from "./WritingSkeleton";
import HeroEntrance from "@/components/domain/home/HeroEntrance";
import styles from "./writing.module.css";
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
    "웹 개발과 AI 챗봇을 만들며 배운 내용과 직접 해결한 문제를 기록합니다.";
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
            <div className={styles.page}>
                <HeroEntrance className={styles.hero}>
                    <p className={styles.eyebrow}>Writing</p>
                    <h1>
                        개발하며 배운 것들을
                        <br />
                        <span>기록합니다.</span>
                    </h1>
                    <p className={styles.lead}>
                        웹 개발과 AI 챗봇 개발에서 익힌 개념과 직접 적용한 과정을 담았습니다.
                    </p>
                </HeroEntrance>
                <Suspense fallback={<WritingSkeleton />}>
                    <WritingListPage
                        currentPage={currentPage}
                        category={category}
                        tag={tag}
                        search={search}
                    />
                </Suspense>
            </div>
        </>
    );
}
