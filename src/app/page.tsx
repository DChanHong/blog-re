import type { Metadata } from "next";
import { Suspense } from "react";
import ClientPage from "./ClientPage";
// import { getFaqCategories, getFaqList } from "@/lib/services/chatbotService";
// import { getRecentPosts } from "@/lib/services/velogService";
import BlogContainer from "@/components/home/BlogContainer";
import BlogSkeleton from "@/components/skeletons/BlogSkeleton";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
    absoluteUrl,
    createBreadcrumbJsonLd,
    createOrganizationJsonLd,
    createWebSiteJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

// ISR 1일 (86400초)
export const revalidate = 86400;

export const metadata: Metadata = {
    title: SEO_CONFIG.title.default,
    description: SEO_CONFIG.description,
    alternates: {
        canonical: getCanonicalUrl("/"),
    },
    robots: SEO_CONFIG.robots.index,
    openGraph: {
        title: SEO_CONFIG.title.default,
        description: SEO_CONFIG.description,
        url: getCanonicalUrl("/"),
        siteName: SEO_CONFIG.siteName,
        images: [
            {
                url: absoluteUrl(SEO_CONFIG.defaultOgImage.path),
                width: SEO_CONFIG.defaultOgImage.width,
                height: SEO_CONFIG.defaultOgImage.height,
                alt: SEO_CONFIG.defaultOgImage.alt,
            },
        ],
        locale: SEO_CONFIG.locale,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SEO_CONFIG.title.default,
        description: SEO_CONFIG.description,
        images: [absoluteUrl(SEO_CONFIG.defaultOgImage.path)],
    },
};

export default function Home() {
    return (
        <>
            <JsonLdScript
                schemas={[
                    createWebSiteJsonLd(),
                    createOrganizationJsonLd(),
                    createBreadcrumbJsonLd([{ name: "홈", path: "/" }]),
                ]}
            />
            <ClientPage
                section3Slot={
                    <Suspense fallback={<BlogSkeleton />}>
                        <BlogContainer />
                    </Suspense>
                }
            />
        </>
    );
}
