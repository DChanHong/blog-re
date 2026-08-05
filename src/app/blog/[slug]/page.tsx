import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { getPostBySlug, getPostsForSitemap } from "@/lib/services/velogService";

export const revalidate = 86400; // 24시간 ISR

export async function generateStaticParams() {
    const posts = await getPostsForSitemap();
    return posts
        .filter((p) => p.slug)
        .filter((p) => encodeURIComponent(p.slug!).length <= 220)
        .map((p) => ({ slug: encodeURIComponent(p.slug!) }));
}
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
    absoluteUrl,
    cleanDescription,
    createArticleJsonLd,
    createBreadcrumbJsonLd,
    createImageObjectJsonLd,
    createOrganizationJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

interface BlogDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getPostBySlug(decodedSlug);

    if (!post) {
        return {
            title: "블로그 글을 찾을 수 없습니다",
            robots: SEO_CONFIG.robots.noIndex,
        };
    }

    const canonicalUrl = getCanonicalUrl(`/blog/${post.slug || decodedSlug}`);
    const description = cleanDescription(
        post.intro || post.content_text || SEO_CONFIG.description,
    );
    const imageUrl = absoluteUrl(post.img_src || SEO_CONFIG.defaultOgImage.path);
    const modifiedTime = post.detail_crawled_at || post.inserted_at || post.created_at;

    return {
        title: post.title,
        description,
        keywords: post.tags,
        alternates: {
            canonical: canonicalUrl,
        },
        robots: SEO_CONFIG.robots.index,
        openGraph: {
            title: post.title,
            description,
            url: canonicalUrl,
            siteName: SEO_CONFIG.siteName,
            images: [
                {
                    url: imageUrl,
                    width: SEO_CONFIG.defaultOgImage.width,
                    height: SEO_CONFIG.defaultOgImage.height,
                    alt: post.title,
                },
            ],
            locale: SEO_CONFIG.locale,
            type: "article",
            publishedTime: post.created_at,
            modifiedTime,
            authors: [SEO_CONFIG.authorName],
            tags: post.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getPostBySlug(decodedSlug);

    if (!post) {
        notFound();
    }

    const postPath = `/blog/${post.slug || decodedSlug}`;
    const description = cleanDescription(
        post.intro || post.content_text || SEO_CONFIG.description,
    );
    const imageUrl = post.img_src || SEO_CONFIG.defaultOgImage.path;
    const modifiedTime = post.detail_crawled_at || post.inserted_at || post.created_at;
    const wordCount = post.content_text?.trim().split(/\s+/).filter(Boolean).length;

    return (
        <PageContainer outerClassName="min-h-screen">
            <JsonLdScript
                schemas={[
                    createArticleJsonLd({
                        url: postPath,
                        name: post.title,
                        description,
                        imageUrl,
                        publishedTime: post.created_at,
                        modifiedTime,
                        tags: post.tags,
                        wordCount,
                    }),
                    createImageObjectJsonLd({
                        url: postPath,
                        name: post.title,
                        description,
                        imageUrl,
                    }),
                    createOrganizationJsonLd(),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: "블로그", path: "/blog" },
                        { name: post.title, path: postPath },
                    ]),
                ]}
            />
            <article className="mx-auto max-w-3xl py-12">
                <div className="mb-8 border-b border-slate-200 pb-8">
                    <Link
                        href="/blog"
                        className="mb-6 inline-flex text-sm text-blue-600 underline-offset-4 hover:underline"
                    >
                        블로그 목록으로
                    </Link>

                    <h1 className="mb-5 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                        {post.title}
                    </h1>

                    <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                        <time>{new Date(post.created_at).toLocaleDateString("ko-KR")}</time>
                        {post.source_url && (
                            <a
                                href={post.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline-offset-4 hover:underline"
                            >
                                원문 보기
                            </a>
                        )}
                    </div>

                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {post.intro && (
                        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600">
                            {post.intro}
                        </p>
                    )}
                </div>

                {post.content_html ? (
                    <div
                        className="velog-crawled-content"
                        dangerouslySetInnerHTML={{ __html: post.content_html }}
                    />
                ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-700">
                        아직 상세 본문이 크롤링되지 않았습니다.
                    </div>
                )}
            </article>
        </PageContainer>
    );
}
