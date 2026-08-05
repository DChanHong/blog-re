"use client";

import { useState } from "react";
import { ArrowUpRight, Building2, Newspaper, RadioTower, Scale } from "lucide-react";
import { projectsData } from "@/data/careerData";
import type { CareerProject } from "@/data/careerData";
import ProjectModal from "@/components/domain/home/ProjectModal";

const projectMeta: Record<string, { icon: React.ElementType; color: string }> = {
    "realtime-support": { icon: RadioTower, color: "text-blue-600 bg-blue-50 border-blue-200" },
    "snn-cms": { icon: Newspaper, color: "text-violet-600 bg-violet-50 border-violet-200" },
    "erp-groupware": { icon: Building2, color: "text-slate-600 bg-slate-100 border-slate-200" },
    "legal-platform": { icon: Scale, color: "text-amber-600 bg-amber-50 border-amber-200" },
};

const statusColor: Record<string, string> = {
    "운영 중": "bg-emerald-50 text-emerald-600 border-emerald-200",
    완료: "bg-slate-100 text-slate-600 border-slate-200",
    "출시 보류": "bg-amber-50 text-amber-600 border-amber-200",
};

const featured = projectsData.find((p) => p.id === "realtime-support")!;
const rest = projectsData.filter((p) => p.id !== "realtime-support");

export default function ProjectShowcase() {
    const [activeProject, setActiveProject] = useState<CareerProject | null>(null);

    return (
        <>
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                {/* Featured 카드 */}
                <FeaturedCard project={featured} onOpen={() => setActiveProject(featured)} />

                {/* 소형 카드 3개 */}
                <div className="flex flex-col gap-4">
                    {rest.map((p) => (
                        <SmallCard key={p.id} project={p} onOpen={() => setActiveProject(p)} />
                    ))}
                </div>
            </div>

            {activeProject && (
                <ProjectModal
                    project={activeProject}
                    onClose={() => setActiveProject(null)}
                />
            )}
        </>
    );
}

function FeaturedCard({ project, onOpen }: { project: CareerProject; onOpen: () => void }) {
    const meta = projectMeta[project.id];
    const Icon = meta?.icon ?? RadioTower;

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group text-left w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-7 sm:p-9 hover:border-blue-200 hover:shadow-blue-100/60 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
            {/* 상단 뱃지 */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColor[project.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    {project.status}
                </span>
                <span className="font-mono text-xs text-slate-400">{project.period}</span>
            </div>

            {/* 제목 */}
            <div className="flex items-start gap-4 mb-4">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${meta?.color}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                    <h3 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl group-hover:text-blue-700 transition-colors">
                        {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{project.subtitle}</p>
                </div>
            </div>

            <p className="text-sm leading-7 text-slate-600 mb-6">{project.summary}</p>

            {/* 지표 */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 mb-6">
                {project.metrics.map((m) => (
                    <div key={m.label} className="bg-white px-3 py-3.5 text-center">
                        <dd className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">{m.value}</dd>
                        <dt className="mt-1 text-[10px] leading-4 text-slate-400">{m.label}</dt>
                    </div>
                ))}
            </dl>

            {/* 기술 스택 + CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5" aria-label="기술 스택">
                    {project.techStack.slice(0, 6).map((t) => (
                        <li key={t} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                            {t}
                        </li>
                    ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                    자세히 보기
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
            </div>
        </button>
    );
}

function SmallCard({ project, onOpen }: { project: CareerProject; onOpen: () => void }) {
    const meta = projectMeta[project.id];
    const Icon = meta?.icon ?? Building2;

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group text-left w-full overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:border-blue-200 hover:shadow-md hover:shadow-slate-200/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
            <div className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta?.color}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {project.title}
                        </p>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColor[project.status]}`}>
                            {project.status}
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{project.subtitle}</p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((t) => (
                    <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                        {t}
                    </span>
                ))}
            </div>
        </button>
    );
}
