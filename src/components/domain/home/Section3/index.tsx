"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import useElementObserve from "@/hooks/useElementObserve";
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
                <Link href={"/blog"}>
                    <h2
                        className={`font-bold mb-4 text-[20px] md:text-[30px] 3xl:text-[40px] 6xl:text-[50px] pb-4 border-b-2`}
                    >
                        <span className="text-container">📰 최신 글 보기</span>
                    </h2>
                </Link>

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

                <Link
                    href={"/blog"}
                    className="w-full inline-flex items-center justify-center my-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    <span className="mr-3 text-xl">더보기</span>
                    <FaArrowRight className="w-5 h-5" />
                </Link>
            </div>
            <style jsx>
                {`
                    .text-container {
                        position: relative;
                    }

                    .text-container::before {
                        content: "";
                        position: absolute;
                        bottom: -20%;
                        left: 0;
                        width: 0;
                        height: 4px;
                        background-color: black;
                        transition: width 0.3s ease;
                    }

                    .text-container:hover::before {
                        width: 100%;
                    }
                `}
            </style>
        </div>
    );
};

export default Section3;
