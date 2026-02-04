"use client";

import Section4 from "@/components/domain/home/Section4";
import { ReactNode } from "react";

interface ClientPageProps {
    section2Slot: ReactNode;
    section3Slot: ReactNode;
}

import { SparklesCore } from "@/components/ui/sparkles";
import SectionWithMockup from "@/components/ui/section-with-mockup";

import Link from "next/link";
import Section4CtaButton from "@/components/ui/Buttons/section-4-cta-button";
import { DiceLoader } from "@/components/ui/loader/dice-loader";

// ... (previous imports)

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
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                My <span className="text-blue-400">Career</span> Journey
                            </h2>
                            <p className="text-gray-400 text-sm md:text-lg max-w-lg">
                                신입부터 현재까지, 다양한 프로젝트를 통해 성장해온 개발 여정을 소개합니다.
                            </p>
                        </div>
                        <Section4CtaButton href="/career" text="경력 자세히 보기" />
                    </div>
                </div>

                <SectionWithMockup
                    leftNode={<Section4 />}
                    rightNode={section2Slot}
                />
                {section3Slot}
            </div>
        </>
    );
}
