import { Metadata } from "next";
import CareerPage from "./CareerPage";
import PageContainer from "@/components/layout/PageContainer";
import { SparklesCore } from "@/components/ui/sparkles";
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

const title = "성찬홍 | Frontend Engineer Career";
const description =
    "Next.js, WebSocket, React Query, Zustand를 기반으로 실시간 상담 플랫폼, 뉴스 CMS, ERP를 개발한 성찬홍의 경력 포트폴리오입니다.";
const canonicalUrl = getCanonicalUrl("/career");
const ogImageUrl = absoluteUrl(SEO_CONFIG.defaultOgImage.path);

export const metadata: Metadata = {
    title,
    description,
    keywords: ["성찬홍", "프론트엔드 개발자", "Next.js", "WebSocket", "React Query", "포트폴리오"],
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
        <div className="relative min-h-screen overflow-hidden bg-black">
            <JsonLdScript
                schemas={[
                    createWebPageJsonLd({
                        url: "/career",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createImageObjectJsonLd({
                        url: "/career",
                        name: title,
                        description,
                        imageUrl: SEO_CONFIG.defaultOgImage.path,
                    }),
                    createOrganizationJsonLd(),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: "커리어", path: "/career" },
                    ]),
                ]}
            />
            <div className="pointer-events-none fixed inset-0 z-0 bg-black" aria-hidden="true">
                <SparklesCore
                    id="tsparticlescareer"
                    background="black"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="h-full w-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <PageContainer
                outerClassName="relative z-10 min-h-screen"
                innerClassName="mx-auto max-w-[1540px] px-4 pb-20 pt-[108px] sm:px-6 lg:px-8 lg:pb-28 lg:pt-[132px]"
            >
                <CareerPage />
            </PageContainer>
        </div>
    );
}
