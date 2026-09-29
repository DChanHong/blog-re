"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBlogPostsQuery, useBlogCategoriesQuery, useBlogTagsQuery } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";
import PostCard from "@/components/domain/blog/PostCard";
import PostCardSkeleton from "@/components/domain/blog/PostCardSkeleton";

interface WritingListPageProps {
    currentPage: number;
    category: string;
    tag: string;
    search: string;
}

export default function WritingListPage({
    currentPage,
    category,
    tag,
    search,
}: WritingListPageProps) {
    const router = useRouter();
    // md 이하에서 카테고리 접기/펼치기 상태
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // React Query: 블로그 포스트 데이터
    const postsQuery = useBlogPostsQuery({
        page: currentPage,
        limit: 9,
        ...(category ? { category } : {}),
        ...(tag ? { tag } : {}),
        ...(search ? { search } : {}),
    });

    const result = postsQuery.data;
    const data = result?.result.success ? result.data : null;
    const posts = data?.posts ?? [];
    const totalPages = data?.pagination.totalPages ?? 0;
    const totalPosts = data?.pagination.totalPosts ?? 0;
    const hasError = postsQuery.isError || result?.result.success === false;

    // React Query: 카테고리/태그 메타데이터
    const categoriesQuery = useBlogCategoriesQuery();
    const tagsQuery = useBlogTagsQuery();

    const categories = categoriesQuery.data?.result.success
        ? (categoriesQuery.data.data ?? [])
        : [];
    const tags = tagsQuery.data?.result.success ? (tagsQuery.data.data ?? []) : [];

    function filterUrl(changes: Partial<Record<"category" | "tag" | "search", string>>) {
        const values = { category, tag, search, ...changes };
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(values)) {
            if (value) query.set(key, value);
        }
        const suffix = query.toString();
        return suffix ? `/writing?${suffix}` : "/writing";
    }

    return (
        <div className="grid md:grid-cols-4 gap-8">
            {/* 사이드바 - 필터 */}
            <aside className="min-w-0 md:col-span-1">
                <div className="bg-raised rounded-2xl border border-border p-6 sticky top-[calc(var(--header-height)+24px)] shadow-sm">
                    {/* 검색 */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-ink mb-3">검색</h3>
                        <form
                            className="relative"
                            onSubmit={(event) => {
                                event.preventDefault();
                                const value = String(
                                    new FormData(event.currentTarget).get("search") ?? "",
                                ).trim();
                                router.push(filterUrl({ search: value }));
                            }}
                        >
                            <input
                                key={search}
                                name="search"
                                aria-label="글 검색"
                                type="text"
                                placeholder="포스트 검색..."
                                defaultValue={search}
                                className="w-full pl-3 pr-9 py-2 bg-raised border border-control-border text-ink placeholder-muted-ink rounded-lg focus:ring-2 focus:ring-focus focus:border-transparent"
                            />
                            <button
                                type="submit"
                                aria-label="검색 실행"
                                className="absolute right-2 top-2 h-6 w-6 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 text-muted-ink"
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
                            </button>
                        </form>
                    </div>

                    {/* 카테고리 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-ink">카테고리</h3>
                            <button
                                type="button"
                                className="md:hidden text-sm text-muted-ink px-2 py-1 rounded hover:bg-muted cursor-pointer"
                                onClick={() => setIsCategoryOpen((prev) => !prev)}
                                aria-controls="category-panel"
                                aria-expanded={isCategoryOpen}
                            >
                                {isCategoryOpen ? "접기" : "펼치기"}
                            </button>
                        </div>
                        <div
                            id="category-panel"
                            className={`${isCategoryOpen ? "block max-h-56" : "hidden"} md:block space-y-2 overflow-y-auto pr-1 md:max-h-none md:overflow-visible`}
                        >
                            <Link
                                href={filterUrl({ category: "" })}
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                    !category
                                        ? "bg-sunken text-accent"
                                        : "text-secondary hover:bg-muted"
                                }`}
                            >
                                전체
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={filterUrl({ category: cat })}
                                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        category === cat
                                            ? "bg-sunken text-accent"
                                            : "text-secondary hover:bg-muted"
                                    }`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 태그 */}
                    <div className={``}>
                        <h3 className="font-semibold text-ink mb-3">태그</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 20).map((tagItem) => (
                                <Link
                                    key={tagItem}
                                    href={filterUrl({ tag: tag === tagItem ? "" : tagItem })}
                                    className={`px-3 py-1 text-[0.8125rem] rounded-full transition-colors ${
                                        tag === tagItem
                                            ? "bg-sunken text-accent"
                                            : "bg-muted text-secondary hover:bg-muted"
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
            <div className="min-w-0 break-words md:col-span-3">
                {/* 결과 정보 */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-secondary">
                            총 <span className="font-semibold text-accent">{totalPosts}</span>개의
                            포스트
                            {search && (
                                <span>
                                    {" "}
                                    - &quot;
                                    <span className="font-semibold text-ink">{search}</span>&quot;
                                    검색 결과
                                </span>
                            )}
                            {category && (
                                <span>
                                    {" "}
                                    - <span className="font-semibold text-ink">
                                        {category}
                                    </span>{" "}
                                    카테고리
                                </span>
                            )}
                            {tag && (
                                <span>
                                    {" "}
                                    - <span className="font-semibold text-ink">#{tag}</span> 태그
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* 포스트 그리드 */}
                {hasError ? (
                    <div
                        role="alert"
                        className="rounded-xl border border-border bg-warning-surface p-6 text-warning"
                    >
                        <p>글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
                        <button
                            type="button"
                            onClick={() => void postsQuery.refetch()}
                            className="mt-4 rounded px-3 py-2 font-semibold underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : postsQuery.isFetching && posts.length === 0 ? (
                    <div
                        role="status"
                        aria-label="글을 불러오는 중"
                        className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
                    >
                        {Array.from({ length: 9 }).map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                            {postsQuery.isFetching
                                ? Array.from({ length: 9 }).map((_, i) => (
                                      <PostCardSkeleton key={i} />
                                  ))
                                : posts.map((post) => <PostCard key={post.id} post={post} />)}
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                baseUrl="/writing"
                                searchParams={{ category, tag, search }}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <svg
                            className="mx-auto h-12 w-12 text-muted-ink mb-4"
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
                        <h3 className="text-lg font-medium text-ink mb-2">포스트가 없습니다</h3>
                        <p className="text-secondary">
                            {search || category || tag
                                ? "검색 조건에 맞는 포스트가 없습니다."
                                : "아직 작성된 포스트가 없습니다."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
