"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { getBlogPostsAction, getBlogCategoriesAction, getBlogTagsAction } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";

interface BlogListPageProps {
    currentPage: number;
    category: string;
    tag: string;
    search: string;
}

export default function BlogListPage({ currentPage, category, tag, search }: BlogListPageProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    // 블로그 포스트 데이터 가져오기
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const result = await getBlogPostsAction({
                    page: currentPage,
                    limit: 12, // 한 페이지당 12개 포스트
                    ...(category && { category }),
                    ...(tag && { tag }),
                    ...(search && { search }),
                });

                if (result.success && result.data && result.data.pagination) {
                    setPosts(result.data.posts);
                    setTotalPages(result.data.pagination.totalPages);
                    setTotalPosts(result.data.pagination.totalPosts);
                } else {
                    console.error(
                        "블로그 포스트 가져오기 실패:",
                        result.success ? "데이터 없음" : "요청 실패",
                    );
                    setPosts([]);
                    setTotalPages(0);
                    setTotalPosts(0);
                }
            } catch (error) {
                console.error("블로그 포스트 가져오기 실패:", error);
                setPosts([]);
                setTotalPages(0);
                setTotalPosts(0);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, category, tag, search]);

    // 카테고리와 태그 목록 가져오기
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [categoriesResult, tagsResult] = await Promise.all([
                    getBlogCategoriesAction(),
                    getBlogTagsAction(),
                ]);

                if (categoriesResult.success) {
                    setCategories(categoriesResult.data || []);
                }

                if (tagsResult.success) {
                    setTags(tagsResult.data || []);
                }
            } catch (error) {
                console.error("메타데이터 가져오기 실패:", error);
            }
        };

        fetchMetadata();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            {/* 사이드바 - 필터 */}
            <aside className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-[120px]">
                    {/* 검색 */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">검색</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="포스트 검색..."
                                defaultValue={search}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        const searchValue = (e.target as HTMLInputElement).value;
                                        const params = new URLSearchParams();
                                        if (searchValue) params.set("search", searchValue);
                                        if (category) params.set("category", category);
                                        if (tag) params.set("tag", tag);
                                        params.set("page", "1");
                                        window.location.href = `/blog?${params.toString()}`;
                                    }
                                }}
                            />
                            <svg
                                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* 카테고리 */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">카테고리</h3>
                        <div className="space-y-2">
                            <Link
                                href="/blog"
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                    !category
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                전체
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/blog?category=${encodeURIComponent(cat)}`}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        category === cat
                                            ? "bg-blue-100 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 태그 */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">태그</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 20).map((tagItem) => (
                                <Link
                                    key={tagItem}
                                    href={`/blog?tag=${encodeURIComponent(tagItem)}`}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                        tag === tagItem
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    #{tagItem}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="lg:col-span-3">
                {/* 결과 정보 */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-gray-600">
                            총 <span className="font-semibold text-blue-600">{totalPosts}</span>개의
                            포스트
                            {search && (
                                <span>
                                    {" "}
                                    - "<span className="font-semibold">{search}</span>" 검색 결과
                                </span>
                            )}
                            {category && (
                                <span>
                                    {" "}
                                    - <span className="font-semibold">{category}</span> 카테고리
                                </span>
                            )}
                            {tag && (
                                <span>
                                    {" "}
                                    - <span className="font-semibold">#{tag}</span> 태그
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* 포스트 그리드 */}
                {posts.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group"
                                >
                                    {/* 썸네일 */}
                                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                                        {post.thumbnail ? (
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg
                                                    className="w-12 h-12 text-blue-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* 콘텐츠 */}
                                    <div className="p-6">
                                        {/* 카테고리 & 날짜 */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                                {post.category}
                                            </span>
                                            <time className="text-xs text-gray-500">
                                                {new Date(post.publishedAt).toLocaleDateString(
                                                    "ko-KR",
                                                )}
                                            </time>
                                        </div>

                                        {/* 제목 */}
                                        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            <a
                                                href={post.slug}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {post.title}
                                            </a>
                                        </h2>

                                        {/* 요약 */}
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                            {post.summary}
                                        </p>

                                        {/* 태그 */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {post.tags.slice(0, 3).map((tagItem) => (
                                                <span
                                                    key={tagItem}
                                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                                                >
                                                    #{tagItem}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="px-2 py-1 text-xs text-gray-400">
                                                    +{post.tags.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* 읽기 시간 & 조회수 */}
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{post.readingTime}분 읽기</span>
                                            <span>조회 {post.views.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                baseUrl="/blog"
                                searchParams={{ category, tag, search }}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            포스트가 없습니다
                        </h3>
                        <p className="text-gray-500">
                            {search || category || tag
                                ? "검색 조건에 맞는 포스트가 없습니다."
                                : "아직 작성된 포스트가 없습니다."}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
