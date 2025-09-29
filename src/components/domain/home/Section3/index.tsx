"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
            <div className={` w-11/12 md:w-11/12 lg2:w-11/12 3xl:w-10/12 6xl:w-11/12`}>
                <Link href={"/blog"}>
                    <h2
                        className={`font-bold mb-4 text-[20px] md:text-[30px] 3xl:text-[40px] 6xl:text-[50px] pb-4 border-b-2`}
                    >
                        <span className="text-container">최신 글 보기</span>
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
                    className={`flex flex-col justify-center my-4 text-center text-[24px] font-bold py-4 bg-gray-100 hover:opacity-65`}
                >
                    더보기 +
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
