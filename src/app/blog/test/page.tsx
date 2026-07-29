"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import type { CrawledVelogDetail } from "@/types/blog";
import type { ApiResponse } from "@/types/api";

export default function BlogCrawlTestPage() {
    const [post, setPost] = useState<CrawledVelogDetail | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function fetchPost() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await fetch("/api/velog/test-detail", { cache: "no-store" });
                const json = (await response.json()) as ApiResponse<CrawledVelogDetail>;

                if (!response.ok || !json.result.success || !json.data) {
                    throw new Error(json.result.message || "Velog 상세 페이지 파싱에 실패했습니다.");
                }

                if (!ignore) {
                    setPost(json.data);
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchPost();

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <PageContainer outerClassName="min-h-screen bg-black text-white">
            <article className="mx-auto max-w-3xl py-12">
                {isLoading && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-300">
                        Velog 상세 페이지를 크롤링하는 중입니다...
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-8 text-red-200">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && post && (
                    <>
                        <div className="mb-8 border-b border-white/10 pb-8">
                            <p className="mb-4 text-sm text-purple-300">Velog 상세 크롤링 테스트</p>
                            <h1 className="mb-5 text-3xl font-bold leading-tight md:text-5xl">
                                {post.title}
                            </h1>
                            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                <span>{post.author}</span>
                                {post.publishedAt && <span>{post.publishedAt}</span>}
                                <a
                                    href={post.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-300 underline-offset-4 hover:underline"
                                >
                                    원문 보기
                                </a>
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
                            {post.description && (
                                <p className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-gray-300">
                                    {post.description}
                                </p>
                            )}
                        </div>

                        <div
                            className="velog-crawled-content"
                            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                        />

                        <details className="mt-12 rounded-lg border border-white/10 bg-white/5 p-4">
                            <summary className="cursor-pointer text-sm font-semibold text-gray-200">
                                파싱된 순수 텍스트 확인
                            </summary>
                            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-gray-400">
                                {post.contentText}
                            </pre>
                        </details>
                    </>
                )}
            </article>
        </PageContainer>
    );
}
