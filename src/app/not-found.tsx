"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <section className="w-full max-w-[1800px] m-auto flex justify-center items-center min-h-[80vh] p-6 to-blue-50">
            <div className="w-full max-w-lg text-center">
                {/* 404 숫자 애니메이션 */}
                <div className="relative mb-8">
                    <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-blue-100 -z-10 blur-sm">
                        404
                    </div>
                </div>

                {/* 메인 메시지 */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        페이지를 찾을 수 없습니다
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        요청하신 페이지가 존재하지 않거나
                        <br />
                        이동되었을 수 있습니다.
                    </p>
                </div>

                {/* 일러스트레이션 */}
                <div className="mb-8 flex justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center animate-bounce">
                        <svg
                            className="w-16 h-16 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.806-6.166-2.154M6.5 9.5L3 13l3.5 3.5M17.5 9.5L21 13l-3.5 3.5"
                            />
                        </svg>
                    </div>
                </div>

                {/* 버튼 그룹 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                        <span className="relative flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            홈으로 가기
                        </span>
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="group inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <span className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            이전 페이지로
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
