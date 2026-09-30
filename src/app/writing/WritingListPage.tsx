"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBlogPostsQuery, useBlogCategoriesQuery, useBlogTagsQuery } from "@/actions/blog";
import Pagination from "@/components/ui/Pagination";
import WritingEntrance from "./WritingEntrance";
import WritingSkeleton from "./WritingSkeleton";
import styles from "./writing.module.css";

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
    const [filtersOpen, setFiltersOpen] = useState(false);
    const postsQuery = useBlogPostsQuery({
        page: currentPage,
        limit: 9,
        ...(category ? { category } : {}),
        ...(tag ? { tag } : {}),
        ...(search ? { search } : {}),
    });
    const categoriesQuery = useBlogCategoriesQuery();
    const tagsQuery = useBlogTagsQuery();
    const result = postsQuery.data;
    const data = result?.result.success ? result.data : null;
    const posts = data?.posts ?? [];
    const hasError = postsQuery.isError || result?.result.success === false;
    // Do not label cached rows as results for a newly selected query.
    const loading = postsQuery.isPending || postsQuery.isPlaceholderData;
    const categories = categoriesQuery.data?.result.success
        ? (categoriesQuery.data.data ?? [])
        : [];
    const tags = tagsQuery.data?.result.success ? (tagsQuery.data.data ?? []) : [];
    const activeFilters = Object.entries({ search, category, tag }).filter(([, value]) => value);
    const queryKey = JSON.stringify([currentPage, category, tag, search]);

    function filterUrl(changes: Partial<Record<"category" | "tag" | "search", string>>) {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries({ category, tag, search, ...changes })) {
            if (value) query.set(key, value);
        }
        return query.size ? `/writing?${query}` : "/writing";
    }

    return (
        <section aria-label="글 목록과 검색">
            <div className={styles.toolbar}>
                <form
                    className={styles.search}
                    role="search"
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.push(
                            filterUrl({
                                search: String(
                                    new FormData(event.currentTarget).get("search") ?? "",
                                ).trim(),
                            }),
                            { scroll: false },
                        );
                    }}
                >
                    <input
                        key={search}
                        name="search"
                        aria-label="글 검색"
                        placeholder="궁금한 주제나 기술을 검색해 보세요"
                        defaultValue={search}
                        type="search"
                    />
                    <button type="submit">검색</button>
                </form>
                <button
                    className={styles.filterToggle}
                    type="button"
                    aria-expanded={filtersOpen}
                    aria-controls="writing-filters"
                    onClick={() => setFiltersOpen((open) => !open)}
                >
                    필터
                    {category || tag
                        ? ` · ${Number(Boolean(category)) + Number(Boolean(tag))}`
                        : ""}
                    <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
                </button>
            </div>
            <div id="writing-filters" hidden={!filtersOpen} className={styles.filters}>
                {(
                    [
                        {
                            name: "카테고리",
                            field: "category",
                            values: categories,
                            query: categoriesQuery,
                            active: category,
                        },
                        { name: "태그", field: "tag", values: tags, query: tagsQuery, active: tag },
                    ] as const
                ).map((group) => (
                    <div key={group.field} className={styles.filterGroup}>
                        <h2>{group.name}</h2>
                        {group.query.isPending ? (
                            <p role="status">{group.name}를 불러오는 중입니다.</p>
                        ) : group.query.isError || group.query.data?.result.success === false ? (
                            <p role="alert">
                                {group.name}를 불러오지 못했습니다.{" "}
                                <button type="button" onClick={() => void group.query.refetch()}>
                                    다시 시도
                                </button>
                            </p>
                        ) : (
                            <div className={styles.pills}>
                                <Link
                                    scroll={false}
                                    href={filterUrl({ [group.field]: "" })}
                                    aria-current={!group.active ? "true" : undefined}
                                >
                                    전체
                                </Link>
                                {group.values.map((value) => (
                                    <Link
                                        key={value}
                                        scroll={false}
                                        href={filterUrl({
                                            [group.field]: group.active === value ? "" : value,
                                        })}
                                        aria-current={group.active === value ? "true" : undefined}
                                    >
                                        {group.field === "tag" ? "#" : ""}
                                        {value}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.resultBar}>
                <p role="status" aria-live="polite">
                    {hasError
                        ? "글 조회 실패"
                        : loading
                          ? "글을 불러오는 중…"
                          : `총 ${data?.pagination.totalPosts ?? 0}개의 글`}
                </p>
                {activeFilters.length > 0 && (
                    <div className={styles.activeFilters}>
                        {activeFilters.map(([key, value]) => (
                            <span key={key}>
                                {key === "search"
                                    ? "검색"
                                    : key === "category"
                                      ? "카테고리"
                                      : "태그"}
                                : {value}
                            </span>
                        ))}
                        <Link href="/writing" scroll={false}>
                            전체 초기화
                        </Link>
                    </div>
                )}
            </div>
            <WritingEntrance ready={!loading && !hasError && posts.length > 0} queryKey={queryKey}>
                {hasError ? (
                    <div className={styles.state} role="alert">
                        <h2>글을 불러오지 못했습니다.</h2>
                        <p>잠시 후 다시 시도해 주세요.</p>
                        <button type="button" onClick={() => void postsQuery.refetch()}>
                            다시 시도
                        </button>
                    </div>
                ) : loading ? (
                    <WritingSkeleton />
                ) : posts.length ? (
                    <ul className={styles.list}>
                        {posts.map((post) => {
                            const sourceHref =
                                post.source_url ||
                                (post.detail_link?.startsWith("http")
                                    ? post.detail_link
                                    : `https://velog.io${post.detail_link?.startsWith("/") ? "" : "/"}${post.detail_link}`);
                            const href = post.slug
                                ? `/blog/${encodeURIComponent(post.slug)}`
                                : sourceHref;
                            const internal = href.startsWith("/blog/");
                            return (
                                <li key={post.id ?? post.slug ?? post.detail_link} data-writing-row>
                                    <Link
                                        className={styles.row}
                                        href={href}
                                        target={internal ? undefined : "_blank"}
                                        rel={internal ? undefined : "noopener noreferrer"}
                                    >
                                        <div className={styles.rowContent}>
                                            <h2>{post.title}</h2>
                                            {post.intro && <p>{post.intro}</p>}
                                        </div>
                                        <div className={styles.rowMeta}>
                                            <span>{post.tags?.[0] || "글"}</span>
                                            <span className={styles.arrow} aria-hidden="true">
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className={styles.state}>
                        <h2>
                            {activeFilters.length
                                ? "검색 조건에 맞는 글이 없습니다."
                                : "아직 작성된 글이 없습니다."}
                        </h2>
                        <p>
                            {activeFilters.length
                                ? "다른 검색어나 필터로 찾아보세요."
                                : "새로운 배움의 기록을 준비하고 있습니다."}
                        </p>
                        {activeFilters.length > 0 && (
                            <Link href="/writing" scroll={false}>
                                전체 글 보기
                            </Link>
                        )}
                    </div>
                )}
            </WritingEntrance>
            {!loading && !hasError && (data?.pagination.totalPages ?? 0) > 1 && (
                <div className={styles.pagination}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={data!.pagination.totalPages}
                        baseUrl="/writing"
                        searchParams={{ category, tag, search }}
                    />
                </div>
            )}
        </section>
    );
}
