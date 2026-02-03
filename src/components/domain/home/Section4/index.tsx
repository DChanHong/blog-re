"use client";

import Link from "next/link";
import { FaBriefcase, FaCode, FaRocket } from "react-icons/fa";
import CareerCard from "@/components/ui/career-card";
import { Button } from "@/components/ui/Buttons/neon-button";

/**
 * Section4 - 커리어 미리보기 섹션
 *
 * 홈페이지에서 커리어 정보를 간략히 보여주고 상세 페이지로 이동할 수 있는 섹션입니다.
 */
export default function Section4() {
    const careerHighlights = [
        {
            icon: <FaBriefcase className="w-6 h-6 text-blue-400" />,
            title: "프론트엔드 전담 개발자",
            description: "2023.09 ~ 현재, 로펌에서 다양한 프로젝트 경험",
            imageSrc: "/Section1-1/codeDisplay.webp",
            color: "text-blue-400",
        },
        {
            icon: <FaRocket className="w-6 h-6 text-green-400" />,
            title: "실시간 채팅 서비스",
            description: "80여 개 홈페이지에 배포된 채팅 시스템 개발",
            imageSrc: "/Section1-1/chatDispaly.webp",
            color: "text-green-400",
        },
        {
            icon: <FaCode className="w-6 h-6 text-purple-400" />,
            title: "풀스택 개발 경험",
            description: "Next.js, TypeScript, DB 설계부터 배포까지",
            imageSrc: "/Section1-1/fullstackDisplay.webp",
            color: "text-purple-400",
        },
    ];

    return (
        <section className="w-full h-full flex flex-col justify-center">
            {/* 커리어 하이라이트 카드들 (세로 스택) */}
            <div className="flex flex-col gap-4 mb-8">
                {careerHighlights.map((item, index) => (
                    <CareerCard
                        key={index}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        imageSrc={item.imageSrc}
                        color={item.color}
                    />
                ))}
            </div>

            {/* 경력 요약 (다크 모드 스타일) */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-3">주요 성과</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                <span>80여 개 홈페이지 채팅 기능 확장</span>
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                <span>WebSocket 실시간 통신 구현</span>
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                                <span>풀스택 개발 전 과정 경험</span>
                            </li>
                            <li className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                <span>외부 서비스 연동 (Firebase, 카카오, 토스)</span>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                            <div className="text-2xl font-bold text-blue-400 mb-1">2년+</div>
                            <div className="text-xs text-gray-400 mb-3">개발 경력</div>
                            <div className="text-xl font-bold text-green-400 mb-1">3개</div>
                            <div className="text-xs text-gray-400">주요 프로젝트</div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
}
