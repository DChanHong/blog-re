import { GraduationCap } from "lucide-react";
import PersonalInfoHeader from "@/components/domain/career/PersonalInfoHeader";
import CareerSummary from "@/components/domain/career/CareerSummary";
import CareerSectionNav from "@/components/domain/career/CareerSectionNav";
import ProjectTimeline from "@/components/domain/career/ProjectTimeline";
import TechStack from "@/components/domain/career/TechStack";
import {
    capabilitiesData,
    careerMetrics,
    growthSteps,
    personalInfoData,
    projectsData,
} from "@/data/careerData";

export default function CareerPage() {
    return (
        <div className="mx-auto max-w-[1440px]">
            <PersonalInfoHeader personalInfo={personalInfoData} metrics={careerMetrics} />
            <CareerSectionNav />
            <CareerSummary steps={growthSteps} />
            <ProjectTimeline projects={projectsData} />
            <TechStack capabilities={capabilitiesData} />

            <section
                id="education"
                className="scroll-mt-32 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-500/10 via-slate-950/80 to-violet-500/10 p-6 sm:p-10 lg:p-12"
            >
                <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
                    <div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                            <GraduationCap className="h-5 w-5 text-blue-300" aria-hidden="true" />
                        </div>
                        <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-blue-400 uppercase">
                            Education
                        </p>
                        <h2 className="mt-3 text-2xl font-bold text-white">
                            {personalInfoData.university}
                        </h2>
                        <p className="mt-2 text-sm text-slate-300">
                            {personalInfoData.degree} · {personalInfoData.gpa}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">2016.02 ~ 2022.02 · 부산</p>
                    </div>

                    <div className="lg:text-right">
                        <p className="text-sm font-medium text-blue-300">Engineering direction</p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:ml-auto">
                            사용자 경험과 운영 효율을 함께 개선하는 서비스를 만듭니다.
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 lg:ml-auto">
                            프론트엔드를 중심으로 필요한 경우 API와 데이터 흐름까지 추적하며, 실제
                            운영 환경에서 발생하는 문제를 해결합니다.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
