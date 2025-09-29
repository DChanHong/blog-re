"use client";

import React, { RefObject, useRef } from "react";
import useElementObserve from "@/hooks/useElementObserve";

export interface Section1Props {
    /** 메인 타이틀 텍스트 */
    title?: string;
    /** 외부 래퍼에 추가할 클래스 */
    className?: string;
}

/**
 * Section1
 * 홈 상단 히어로 섹션. CSS Module 없이 Tailwind만 사용.
 */
export default function Section1({ title = "Chanhong Studio", className = "" }: Section1Props) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const { isVisible } = useElementObserve(headingRef as RefObject<Element>, {
        threshold: [0.1],
    });

    return (
        <section
            className={`w-full flex flex-col max-h-[750px] items-center justify-center text-center bg-[#010118] mt-[100px] text-white h-[25vh] md:h-[40vh] lg:h-[50vh] 2xl:h-[70vh] ${className}`}
        >
            {/* 메인 타이틀 */}
            <h2
                ref={headingRef}
                className={`font-bold text-[36px] xs:text-[46px] md:text-[70px] ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } transition-opacity transition-transform duration-700 ease-out`}
            >
                {title}
            </h2>

            {/* 서브 설명 */}
            <p
                className={`mt-4 text-[16px] xs:text-[20px] md:text-[24px] text-gray-300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                } transition-opacity transition-transform duration-700 ease-out delay-200`}
            >
                사용자 경험을 만드는 프론트엔드 엔지니어
            </p>
        </section>
    );
}
