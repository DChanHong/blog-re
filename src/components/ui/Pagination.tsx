"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams?: Record<string, string>;
}

export default function Pagination({
    currentPage,
    totalPages,
    baseUrl,
    searchParams = {},
}: PaginationProps) {
    const router = useRouter();

    // URL 파라미터 생성
    const createUrl = (page: number) => {
        const params = new URLSearchParams();

        // 검색 파라미터 추가
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        // 페이지 파라미터 추가
        if (page > 1) {
            params.set("page", page.toString());
        }

        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    // 480px 이하에서는 더 적은 버튼 수로 표시
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia("(max-width: 480px)");
        const handleChange = () => setIsCompact(mql.matches);
        handleChange();
        mql.addEventListener("change", handleChange);
        return () => mql.removeEventListener("change", handleChange);
    }, []);

    // 페이지 번호 배열 생성 (기본 최대 7개, compact에서는 5개 수준으로 표시)
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = isCompact ? 5 : 7;

        if (totalPages <= maxVisible) {
            // 전체 페이지가 7개 이하면 모두 표시
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 복잡한 페이지네이션 로직
            if (isCompact) {
                // compact 모드: 버튼 수 최소화
                if (currentPage <= 3) {
                    // 앞쪽에 있을 때: 1,2,3 ... last
                    for (let i = 1; i <= 3; i++) {
                        pages.push(i);
                    }
                    pages.push("...");
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                    // 뒤쪽에 있을 때: 1 ... last-2,last-1,last
                    pages.push(1);
                    pages.push("...");
                    for (let i = Math.max(1, totalPages - 2); i <= totalPages; i++) {
                        pages.push(i);
                    }
                } else {
                    // 가운데: 1 ... current ... last
                    pages.push(1);
                    pages.push("...");
                    pages.push(currentPage);
                    pages.push("...");
                    pages.push(totalPages);
                }
            } else {
                // 기본 모드: 최대 7개
                if (currentPage <= 4) {
                    for (let i = 1; i <= 5; i++) {
                        pages.push(i);
                    }
                    pages.push("...");
                    pages.push(totalPages);
                } else if (currentPage >= totalPages - 3) {
                    pages.push(1);
                    pages.push("...");
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);
                    pages.push("...");
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                    }
                    pages.push("...");
                    pages.push(totalPages);
                }
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    const pages = getPageNumbers();

    return (
        <nav
            className="flex flex-wrap justify-center items-center gap-2 w-full"
            aria-label="페이지네이션"
        >
            {/* 이전 페이지 버튼 */}
            <Link
                href={createUrl(Math.max(1, currentPage - 1))}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${currentPage === 1
                        ? "border-white/10 text-gray-600 cursor-not-allowed"
                        : "border-white/20 text-gray-400 hover:bg-white/10 hover:border-white/30"
                    }`}
                aria-disabled={currentPage === 1}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                <span className="sr-only">이전 페이지</span>
            </Link>

            {/* 페이지 번호들 */}
            {pages.map((page, index) => {
                if (page === "...") {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex items-center justify-center w-10 h-10 text-gray-400"
                        >
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <Link
                        key={pageNum}
                        href={createUrl(pageNum)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium transition-colors ${isActive
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-white/20 text-gray-400 hover:bg-white/10 hover:border-white/30"
                            }`}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {pageNum}
                    </Link>
                );
            })}

            {/* 다음 페이지 버튼 */}
            <Link
                href={createUrl(Math.min(totalPages, currentPage + 1))}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${currentPage === totalPages
                        ? "border-white/10 text-gray-600 cursor-not-allowed"
                        : "border-white/20 text-gray-400 hover:bg-white/10 hover:border-white/30"
                    }`}
                aria-disabled={currentPage === totalPages}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <span className="sr-only">다음 페이지</span>
            </Link>

            {/* 페이지 정보 */}
            <div className="hidden sm:flex items-center ml-4 text-sm text-gray-400">
                <span>
                    {currentPage} / {totalPages}
                </span>
            </div>
        </nav>
    );
}
