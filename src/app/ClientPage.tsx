"use client";

import Section4 from "@/components/domain/home/Section4";
import { ReactNode } from "react";
import Section4CtaButton from "@/components/ui/Buttons/section-4-cta-button";

interface ClientPageProps {
    section3Slot: ReactNode;
}

export default function ClientPage({ section3Slot }: ClientPageProps) {
    return (
        <div className="relative z-10 text-slate-900 pb-20">
            <section className="relative py-24 md:py-36 overflow-hidden">
                <div className="container max-w-[1800px] w-full px-6 md:px-10 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-slate-900 md:text-5xl">
                                Career <span className="text-blue-600">Snapshot</span>
                            </h2>
                            <p className="max-w-xl text-sm leading-6 text-slate-500 md:text-lg md:leading-8">
                                운영형 웹 서비스에서 쌓은 경험과 대표 프로젝트를 요약했습니다.
                            </p>
                        </div>
                        <Section4CtaButton href="/career" text="경력 자세히 보기" />
                    </div>
                    <Section4 />
                </div>
            </section>
            {section3Slot}
        </div>
    );
}
