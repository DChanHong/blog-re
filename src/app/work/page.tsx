import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";
import ProjectShowcase from "@/components/domain/home/ProjectShowcase";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
    absoluteUrl,
    createBreadcrumbJsonLd,
    createCollectionPageJsonLd,
    createImageObjectJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

const title = "프로젝트";
const description =
    "실시간 상담 플랫폼, 뉴스 CMS, ERP와 법률 플랫폼에서의 담당 역할과 문제 해결 경험을 소개합니다.";
const canonical = getCanonicalUrl("/work");
const image = absoluteUrl(SEO_CONFIG.defaultOgImage.path);

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical },
    openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        locale: SEO_CONFIG.locale,
        siteName: SEO_CONFIG.siteName,
        images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function WorkPage() {
    return (
        <PageContainer>
            <JsonLdScript
                schemas={[
                    createCollectionPageJsonLd({ url: "/work", name: title, description }),
                    createImageObjectJsonLd({ url: "/work", name: title, description }),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: title, path: "/work" },
                    ]),
                ]}
            />
            <main>
                <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl">프로젝트</h1>
                <p className="mb-10 mt-4 max-w-2xl leading-7 text-slate-600">{description}</p>
                <ProjectShowcase />
            </main>
        </PageContainer>
    );
}
