import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import ProjectDetails from "@/components/domain/project/ProjectDetails";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { getProjectBySlug, projectsData } from "@/data/projects";
import { getProjectCaseStudy } from "@/data/projectCaseStudies";
import { workCards } from "@/data/work";
import {
    absoluteUrl,
    createBreadcrumbJsonLd,
    createWebPageJsonLd,
    createImageObjectJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
    return projectsData.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const project = getProjectBySlug((await params).slug);
    if (!project)
        return { title: "프로젝트를 찾을 수 없습니다", robots: SEO_CONFIG.robots.noIndex };
    const canonical = getCanonicalUrl(`/project/${project.id}`);
    const image = absoluteUrl(SEO_CONFIG.defaultOgImage.path);
    return {
        title: project.title,
        description: project.summary,
        alternates: { canonical },
        openGraph: {
            title: project.title,
            description: project.summary,
            url: canonical,
            type: "website",
            siteName: SEO_CONFIG.siteName,
            locale: SEO_CONFIG.locale,
            images: [image],
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project.summary,
            images: [image],
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const project = getProjectBySlug((await params).slug);
    if (!project) notFound();
    const study = getProjectCaseStudy(project.id);
    if (!study) notFound();
    const index = workCards.findIndex((card) => card.slug === project.id);
    const previous = workCards[(index - 1 + workCards.length) % workCards.length];
    const next = workCards[(index + 1) % workCards.length];
    const path = `/project/${project.id}`;

    return (
        <PageContainer>
            <JsonLdScript
                schemas={[
                    createWebPageJsonLd({
                        url: path,
                        name: project.title,
                        description: project.summary,
                    }),
                    createImageObjectJsonLd({
                        url: path,
                        name: project.title,
                        description: project.summary,
                    }),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: "프로젝트", path: "/work" },
                        { name: project.title, path },
                    ]),
                ]}
            />
            <ProjectDetails study={study} previous={previous} next={next} />
        </PageContainer>
    );
}
