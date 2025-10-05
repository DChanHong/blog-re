"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { VelogPostDto } from "@/types/blog";
import { useBlogPostsQuery, useBlogCategoriesQuery, useBlogTagsQuery } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";
import PostCard from "@/components/domain/blog/PostCard";

interface BlogListPageProps {
    currentPage: number;
    category: string;
    tag: string;
    search: string;
}

export default function BlogListPage({ currentPage, category, tag, search }: BlogListPageProps) {
    const [posts, setPosts] = useState<VelogPostDto[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [categories, setCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    // md 이하에서 카테고리 접기/펼치기 상태
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // React Query: 블로그 포스트 데이터
    const postsQuery = useBlogPostsQuery({
        page: currentPage,
        limit: 8,
        ...(category ? { category } : {}),
        ...(tag ? { tag } : {}),
        ...(search ? { search } : {}),
    });

    useEffect(() => {
        const res = postsQuery.data;
        if (!res) return;
        if (res.result.success && res.data && res.data.pagination) {
            setPosts(res.data.posts);
            console.log(res.data.posts);
            setTotalPages(res.data.pagination.totalPages);
            setTotalPosts(res.data.pagination.totalPosts);
        } else {
            setPosts([]);
            setTotalPages(0);
            setTotalPosts(0);
        }
    }, [postsQuery.data]);

    // React Query: 카테고리/태그 메타데이터
    const categoriesQuery = useBlogCategoriesQuery();
    const tagsQuery = useBlogTagsQuery();

    useEffect(() => {
        if (categoriesQuery.data?.result.success) {
            setCategories(categoriesQuery.data.data || []);
        }
    }, [categoriesQuery.data]);

    useEffect(() => {
        if (tagsQuery.data?.result.success) {
            setTags(tagsQuery.data.data || []);
        }
    }, [tagsQuery.data]);

    return (
        <div className="grid md:grid-cols-4 gap-8">
            {/* 사이드바 - 필터 */}
            <aside className="md:col-span-1">
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
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">카테고리</h3>
                            <button
                                type="button"
                                className="md:hidden text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => setIsCategoryOpen((prev) => !prev)}
                                aria-controls="category-panel"
                                aria-expanded={isCategoryOpen}
                            >
                                {isCategoryOpen ? "접기" : "펼치기"}
                            </button>
                        </div>
                        <div
                            id="category-panel"
                            className={`${isCategoryOpen ? "min-h-[200px]" : "max-h-56"} md:block space-y-2  overflow-y-auto pr-1  md:min-h-0 md:max-h-none md:overflow-visible`}
                        >
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
                    <div className={``}>
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
            <main className="md:col-span-3">
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
                {postsQuery.isFetching && posts.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
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
