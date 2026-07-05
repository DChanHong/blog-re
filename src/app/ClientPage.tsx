"use client";

import Section4 from "@/components/domain/home/Section4";
import { ReactNode } from "react";

interface ClientPageProps {
    section2Slot: ReactNode;
    section3Slot: ReactNode;
}

import { SparklesCore } from "@/components/ui/sparkles";
import SectionWithMockup from "@/components/ui/section-with-mockup";

import Section4CtaButton from "@/components/ui/Buttons/section-4-cta-button";

export default function ClientPage({ section2Slot, section3Slot }: ClientPageProps) {
    return (
        <>
            {/* 배경 */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-black">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="black"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="relative z-10 text-white pb-20">
                {/* 헤더 영역 */}
                <div className="container max-w-[1800px] w-full px-6 md:px-10 mx-auto mt-20 md:mt-32 mb-[-80px] md:mb-[-120px] relative z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-white md:text-5xl">
                                Career <span className="text-blue-400">Snapshot</span>
                            </h2>
                            <p className="max-w-xl text-sm leading-6 text-gray-400 md:text-lg md:leading-8">
                                운영형 웹 서비스에서 쌓은 경험과 대표 프로젝트를 요약했습니다.
                            </p>
                        </div>
                        <Section4CtaButton href="/career" text="경력 자세히 보기" />
                    </div>
                </div>

                <SectionWithMockup leftNode={<Section4 />} rightNode={section2Slot} />
                {section3Slot}
            </div>
        </>
    );
}
