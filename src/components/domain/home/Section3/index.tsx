"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import useElementObserve from "@/hooks/useElementObserve";
import type { VelogPostDto } from "@/types/blog";

interface Props {
    blogList: VelogPostDto[];
}

const Section3 = ({ blogList }: Props) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { isVisible } = useElementObserve(targetRef);

    const openBlog = (link: string) => {
        if (!link) return;
        window.open(link, "_blank", "noreferrer");
    };

    return (
        <div
            className={`w-full m-auto max-w-[1800px] flex justify-center mt-[80px] mb-20 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            ref={targetRef}
        >
            <div className={` w-11/12 md:w-11/12 lg2:w-11/12 3xl:w-10/12 6xl:w-11/12`}>
                <Link href={"/blog"}>
                    <h2
                        className={`font-bold mb-4 text-[20px] md:text-[30px] 3xl:text-[40px] 6xl:text-[50px] pb-4 border-b-2`}
                    >
                        <span className="text-container">Recent Blog Posts</span>
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
                        <button
                            key={`${item.detail_link}-${index}`}
                            onClick={() => openBlog(item.detail_link ?? "")}
                            className={"w-full border-2 border-solid"}
                        >
                            <div className={"flex flex-col justify-between h-full"}>
                                <div>
                                    <Image
                                        src={
                                            item.img_src && item.img_src.length > 0
                                                ? item.img_src
                                                : "/default.webp"
                                        }
                                        alt="썸네일 이미지"
                                        className={`w-full h-[300px] object-cover`}
                                        width={1000}
                                        height={500}
                                        unoptimized
                                    />
                                </div>
                                <div className={"flex flex-col space-y-2 my-4 mx-4"}>
                                    <h3 className={`text-xl font-semibold line-clamp-1`}>
                                        {item.title ?? ""}
                                    </h3>
                                    <p className={`flex space-x-2 justify-center`}>
                                        <span className={`font-medium`}>chanhong</span>
                                        <span>
                                            {new Date(item.created_at).toISOString().slice(0, 10)}
                                        </span>
                                    </p>
                                    <p className={`flex justify-center gap-2 flex-wrap`}>
                                        {Array.isArray(item.tags) &&
                                            item.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={`${tag}-${index}`}
                                                    className="px-4 py-2 rounded-[20px] font-semibold bg-gray-100"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </p>
                                </div>
                            </div>
                        </button>
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
