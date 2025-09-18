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
export default function Section1({ title = "Hong Developer", className = "" }: Section1Props) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const { isVisible } = useElementObserve(headingRef as RefObject<Element>, {
        threshold: [0.1],
    });

    return (
        <section
            className={`w-full flex max-h-[750px] items-center justify-center font-bold text-center text-[36px] xs:text-[46px] md:text-[70px] bg-[#010118] mt-[100px] text-white h-[25vh] md:h-[40vh] lg:h-[50vh] 2xl:h-[70vh] ${className}`}
        >
            <h2
                ref={headingRef}
                className={`${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} transition-opacity transition-transform duration-700 ease-out`}
            >
                {title}
            </h2>
        </section>
    );
}
