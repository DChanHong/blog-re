"use client";

import { ReactNode } from "react";
import Section4CtaButton from "@/components/ui/Buttons/section-4-cta-button";
import CareerHighlight from "@/components/domain/home/CareerHighlight";
import ProjectShowcase from "@/components/domain/home/ProjectShowcase";

interface ClientPageProps {
    section3Slot: ReactNode;
}

export default function ClientPage({ section3Slot }: ClientPageProps) {
    return (
        <div className="relative z-10 text-slate-900 pb-20">
            {/* 이력 요약 */}
            <section className="py-16 md:py-24">
                <div className="container max-w-[1800px] w-full px-6 md:px-10 mx-auto">
                    <CareerHighlight />
                </div>
            </section>

            {/* 경력 프로젝트 */}
            <section className="pb-20 md:pb-28">
                <div className="container max-w-[1800px] w-full px-6 md:px-10 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-slate-900 md:text-5xl">
                                Career <span className="text-blue-600">Projects</span>
                            </h2>
                            <p className="max-w-xl text-sm leading-6 text-slate-500 md:text-lg md:leading-8">
                                경력 카드를 클릭하면 담당 역할과 주요 성과를 확인할 수 있습니다.
                            </p>
                        </div>
                        <Section4CtaButton href="/career" text="커리어 타임라인 보기" />
                    </div>
                    <ProjectShowcase />
                </div>
            </section>

            {section3Slot}
        </div>
    );
}
