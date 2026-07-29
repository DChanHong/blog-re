import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import { getPostBySlug } from "@/lib/services/velogService";
import { absoluteUrl, cleanDescription, getCanonicalUrl, SEO_CONFIG } from "@/lib/seo";

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
    const post = await getPostBySlug(decodeURIComponent(slug));

    if (!post) {
        notFound();
    }

    return (
        <PageContainer outerClassName="min-h-screen bg-black text-white">
            <article className="mx-auto max-w-3xl py-12">
                <div className="mb-8 border-b border-white/10 pb-8">
                    <Link
                        href="/blog"
                        className="mb-6 inline-flex text-sm text-purple-300 underline-offset-4 hover:underline"
                    >
                        블로그 목록으로
                    </Link>

                    <h1 className="mb-5 text-3xl font-bold leading-tight md:text-5xl">
                        {post.title}
                    </h1>

                    <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        <time>{new Date(post.created_at).toLocaleDateString("ko-KR")}</time>
                        {post.source_url && (
                            <a
                                href={post.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-300 underline-offset-4 hover:underline"
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
                                    className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-200"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {post.intro && (
                        <p className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-gray-300">
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
                    <div className="rounded-lg border border-yellow-400/30 bg-yellow-500/10 p-6 text-yellow-100">
                        아직 상세 본문이 크롤링되지 않았습니다.
                    </div>
                )}
            </article>
        </PageContainer>
    );
}
