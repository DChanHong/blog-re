import { Metadata } from "next";
import ResumePage from "./ResumePage";
import PageContainer from "@/components/layout/PageContainer";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
    absoluteUrl,
    createBreadcrumbJsonLd,
    createImageObjectJsonLd,
    createOrganizationJsonLd,
    createWebPageJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

// 정적 페이지로 생성
export const dynamic = "force-static";

const title = "이력서";
const description =
    "실시간 상담 플랫폼과 사내 업무 시스템을 개발한 웹 개발자 성찬홍의 이력서입니다. 화면과 API 개발, 데이터 설계와 운영 개선 경험을 소개합니다.";
const canonicalUrl = getCanonicalUrl("/resume");
const ogImageUrl = absoluteUrl(SEO_CONFIG.defaultOgImage.path);

export const metadata: Metadata = {
    title,
    description,
    keywords: ["성찬홍", "웹 개발자", "Next.js", "WebSocket", "PostgreSQL", "이력서"],
    alternates: {
        canonical: canonicalUrl,
    },
    robots: SEO_CONFIG.robots.index,
    openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "website",
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

/**
 * Career 페이지 - 서버 컴포넌트
 *
 * 성찬홍의 경력 정보를 보여주는 페이지입니다.
 * 메타데이터와 SEO 최적화를 위한 서버 컴포넌트로 구성되어 있습니다.
 */
export default function Career() {
    return (
        <>
            <JsonLdScript
                schemas={[
                    createWebPageJsonLd({
                        url: "/resume",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createImageObjectJsonLd({
                        url: "/resume",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createOrganizationJsonLd(),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: "이력서", path: "/resume" },
                    ]),
                ]}
            />
            <PageContainer>
                <ResumePage />
            </PageContainer>
        </>
    );
}
