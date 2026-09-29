"use client";

import { useState } from "react";
import Link from "next/link";
import type { VelogPostDto } from "@/types/blog";

interface PostCardProps {
    post: VelogPostDto;
}

export default function PostCard({ post }: PostCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const sourceHref =
        post.source_url ||
        (post.detail_link?.startsWith("http")
            ? post.detail_link
            : `https://velog.io${post.detail_link?.startsWith("/") ? "" : "/"}${post.detail_link}`);
    const href = post.slug ? `/blog/${encodeURIComponent(post.slug)}` : sourceHref;
    const isInternal = href.startsWith("/blog/");

    return (
        <Link
            href={href}
            target={isInternal ? undefined : "_blank"}
            rel={isInternal ? undefined : "noopener noreferrer"}
            className="block bg-raised rounded-2xl border border-border hover:border-border hover:shadow-md transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-focus outline-none"
            aria-label={post.title}
        >
            {/* 썸네일 */}
            <div className="aspect-video bg-muted relative overflow-hidden">
                {post.img_src ? (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 bg-muted animate-pulse" />
                        )}
                        <img
                            src={post.img_src}
                            alt={post.title}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(true)}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sunken">
                        <svg
                            className="w-12 h-12 text-muted-ink group-hover:text-accent transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* 콘텐츠 */}
            <div className="p-6">
                {/* 카테고리(첫 태그) & 날짜 */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 text-[0.8125rem] font-medium bg-sunken text-accent border border-border rounded-full">
                        {(post.tags && post.tags[0]) || "글"}
                    </span>
                    <time className="text-[0.8125rem] text-muted-ink">
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </time>
                </div>

                {/* 제목 */}
                <h2 className="text-lg font-bold text-ink mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                    {post.title}
                </h2>

                {/* 요약 */}
                {post.intro && (
                    <p className="text-secondary text-sm line-clamp-3 mb-5 leading-relaxed">
                        {post.intro}
                    </p>
                )}

                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                    {post.tags?.slice(0, 3).map((tagItem) => (
                        <span
                            key={tagItem}
                            className="px-2 py-1 text-[0.8125rem] bg-muted text-muted-ink rounded hover:bg-muted transition-colors border border-border"
                        >
                            #{tagItem}
                        </span>
                    ))}
                    {post.tags && post.tags.length > 3 && (
                        <span className="px-2 py-1 text-[0.8125rem] text-muted-ink">
                            +{post.tags.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
