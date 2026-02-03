"use client";
import React, { useRef } from "react";
import useElementObserve from "@/hooks/useElementObserve";
import Section4CtaButton from "@/components/ui/Buttons/section-4-cta-button";
import PostCard from "@/components/domain/blog/PostCard";
import type { VelogPostDto } from "@/types/blog";

interface Props {
    blogList: VelogPostDto[];
}

const Section3 = ({ blogList }: Props) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { isVisible } = useElementObserve(targetRef);

    // 카드 클릭은 PostCard 내부에서 처리

    return (
        <div
            className={`w-full m-auto max-w-[1800px] flex justify-center mt-[20px] mb-20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            ref={targetRef}
        >
            <div className={`w-[95%]`}>
                {/* 헤더 영역 - Section4 스타일 적용 */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                            Latest <span className="text-blue-400">Blog</span> Posts
                        </h2>
                        <p className="text-gray-400 text-sm md:text-lg max-w-lg">
                            기술적인 고민과 해결 과정을 기록합니다.
                        </p>
                    </div>
                    <Section4CtaButton href="/blog" text="블로그 전체 보기" />
                </div>

                <div
                    className={`grid gap-6 
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                    `}
                >
                    {blogList.map((item, index) => (
                        <PostCard key={`${item.detail_link}-${index}`} post={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Section3;
