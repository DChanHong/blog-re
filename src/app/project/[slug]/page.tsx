import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import ProjectDetails from "@/components/domain/project/ProjectDetails";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { getProjectBySlug, projectsData } from "@/data/projects";
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

const linkStyle =
    "rounded text-sm font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export default async function ProjectPage({ params }: ProjectPageProps) {
    const project = getProjectBySlug((await params).slug);
    if (!project) notFound();
    const index = projectsData.indexOf(project);
    const previous = projectsData[index - 1];
    const next = projectsData[index + 1];
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
            <div className="min-w-0 break-words">
                <Link href="/work" className={linkStyle}>
                    ← 전체 프로젝트
                </Link>
                <article className="mt-6 overflow-hidden rounded-3xl border border-border bg-raised">
                    <header className="p-5 sm:p-8">
                        <p className="text-sm text-secondary">
                            {project.status} · {project.period}
                        </p>
                        {project.featured && (
                            <p className="mt-2 text-sm text-accent">대표 프로젝트</p>
                        )}
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-5xl">
                            {project.title}
                        </h1>
                        <p className="mt-4 text-lg text-accent">{project.subtitle}</p>
                        <p className="mt-5 leading-7 text-secondary">{project.summary}</p>
                        <dl className="mt-6">
                            <dt className="text-sm font-semibold text-secondary">역할</dt>
                            <dd className="mt-1 text-secondary">{project.role}</dd>
                        </dl>
                        {project.metrics.length > 0 && (
                            <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {project.metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="min-w-0 rounded-xl border border-border p-4"
                                    >
                                        <dt className="text-sm text-secondary">{metric.label}</dt>
                                        <dd className="mt-2 text-xl font-bold text-ink">
                                            {metric.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                        <ul className="mt-6 flex flex-wrap gap-2" aria-label="사용 기술">
                            {project.techStack.map((tech) => (
                                <li
                                    key={tech}
                                    className="rounded-lg bg-muted px-3 py-2 text-sm text-secondary"
                                >
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    </header>
                    <ProjectDetails project={project} />
                </article>
                <nav
                    aria-label="프로젝트 이전 다음 탐색"
                    className="mt-8 grid gap-6 sm:grid-cols-2"
                >
                    <div>
                        {previous && (
                            <Link href={`/project/${previous.id}`} className={linkStyle}>
                                ← 이전 프로젝트: {previous.title}
                            </Link>
                        )}
                    </div>
                    <div className="sm:text-right">
                        {next && (
                            <Link href={`/project/${next.id}`} className={linkStyle}>
                                다음 프로젝트: {next.title} →
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </PageContainer>
    );
}
