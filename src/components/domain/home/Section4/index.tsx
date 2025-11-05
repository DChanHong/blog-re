"use client";

import Link from "next/link";
import { FaArrowRight, FaBriefcase, FaCode, FaRocket } from "react-icons/fa";

/**
 * Section4 - 커리어 미리보기 섹션
 *
 * 홈페이지에서 커리어 정보를 간략히 보여주고 상세 페이지로 이동할 수 있는 섹션입니다.
 */
export default function Section4() {
    const careerHighlights = [
        {
            icon: <FaBriefcase className="w-8 h-8" />,
            title: "프론트엔드 전담 개발자",
            description: "2023.09 ~ 현재, 로펌에서 다양한 프로젝트 경험",
            color: "text-blue-600",
        },
        {
            icon: <FaRocket className="w-8 h-8" />,
            title: "실시간 채팅 서비스",
            description: "80여 개 홈페이지에 배포된 채팅 시스템 개발",
            color: "text-green-600",
        },
        {
            icon: <FaCode className="w-8 h-8" />,
            title: "풀스택 개발 경험",
            description: "Next.js, TypeScript, DB 설계부터 배포까지",
            color: "text-purple-600",
        },
    ];

    return (
        <section className="w-full max-w-[1800px] mx-auto px-4">
            <div className="w-[95%] mx-auto mb-12">
                <div className="mx-auto mb-4">
                    <Link href="/career">
                        <h2
                            className={`font-bold mb-4 text-[20px] md:text-[30px] 3xl:text-[40px] 6xl:text-[50px] pb-4 border-b-2`}
                        >
                            <span className="text-container">💼 경력 살펴보기</span>
                        </h2>
                    </Link>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        신입부터 현재까지, 다양한 프로젝트를 통해 성장해온 개발 여정을 소개합니다.
                    </p>
                </div>

                {/* 커리어 하이라이트 카드들 */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {careerHighlights.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className={`${item.color} mb-4 flex justify-center`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-center leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 경력 요약 */}
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 mb-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">주요 성과</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    <span>80여 개 홈페이지 채팅 기능 확장</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    <span>WebSocket 실시간 통신 구현</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    <span>풀스택 개발 전 과정 경험</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                    <span>외부 서비스 연동 (Firebase, 카카오, 토스)</span>
                                </li>
                            </ul>
                        </div>
                        <div className="text-center">
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <div className="text-3xl font-bold text-blue-600 mb-2">2년+</div>
                                <div className="text-gray-600 mb-4">개발 경력</div>
                                <div className="text-2xl font-bold text-green-600 mb-2">3개</div>
                                <div className="text-gray-600">주요 프로젝트</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA 버튼 */}
                <div className="text-center">
                    <Link
                        href="/career"
                        className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <span className="mr-3">상세 경력 보기</span>
                        <FaArrowRight className="w-5 h-5" />
                    </Link>
                </div>
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
        </section>
    );
}
