"use client";

import { useState } from "react";
import { ArrowUpRight, Building2, Newspaper, RadioTower, Scale } from "lucide-react";
import { projectsData } from "@/data/careerData";
import type { CareerProject } from "@/data/careerData";
import ProjectModal from "@/components/domain/home/ProjectModal";

const projectMeta: Record<string, { icon: React.ElementType; iconColor: string; accentBar: string }> = {
    "realtime-support": { icon: RadioTower, iconColor: "text-blue-600 bg-blue-50 border-blue-100",   accentBar: "bg-blue-500" },
    "snn-cms":          { icon: Newspaper,  iconColor: "text-violet-600 bg-violet-50 border-violet-100", accentBar: "bg-violet-500" },
    "erp-groupware":    { icon: Building2,  iconColor: "text-slate-600 bg-slate-100 border-slate-200",  accentBar: "bg-slate-400" },
    "legal-platform":   { icon: Scale,      iconColor: "text-amber-600 bg-amber-50 border-amber-100",   accentBar: "bg-amber-400" },
};

const statusBadge: Record<string, string> = {
    "운영 중":   "bg-emerald-50 text-emerald-600 border-emerald-200",
    완료:       "bg-slate-100 text-slate-500 border-slate-200",
    "출시 보류": "bg-amber-50 text-amber-600 border-amber-200",
};

export default function ProjectShowcase() {
    const [activeProject, setActiveProject] = useState<CareerProject | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {projectsData.map((p) => (
                    <ProjectCard key={p.id} project={p} onOpen={() => setActiveProject(p)} />
                ))}
            </div>

            {activeProject && (
                <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
            )}
        </>
    );
}

function ProjectCard({ project, onOpen }: { project: CareerProject; onOpen: () => void }) {
    const meta = projectMeta[project.id];
    const Icon = meta?.icon ?? RadioTower;

    return (
        <button
            type="button"
            onClick={onOpen}
            className="group text-left w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
            {/* 컬러 탑 바 */}
            <div className={`h-1 w-full ${meta?.accentBar}`} />

            <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${meta?.iconColor}`}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusBadge[project.status]}`}>
                                {project.status}
                            </span>
                            <p className="mt-1 font-mono text-[10px] text-slate-400">{project.period}</p>
                        </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors mt-1" aria-hidden="true" />
                </div>

                {/* 제목 */}
                <h3 className="text-base font-bold leading-snug text-slate-900 group-hover:text-blue-700 transition-colors sm:text-lg">
                    {project.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-1">{project.subtitle}</p>

                {/* 요약 */}
                <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">{project.summary}</p>

                {/* 구분선 */}
                <div className="my-4 h-px bg-slate-100" />

                {/* 수치 */}
                {project.metrics.length > 0 && (
                    <dl className="grid grid-cols-2 gap-3 mb-4">
                        {project.metrics.slice(0, 2).map((m) => (
                            <div key={m.label}>
                                <dd className="text-lg font-bold tracking-tight text-slate-900">{m.value}</dd>
                                <dt className="mt-0.5 text-[10px] text-slate-400">{m.label}</dt>
                            </div>
                        ))}
                    </dl>
                )}

                {/* 기술 스택 */}
                <ul className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((t) => (
                        <li key={t} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {t}
                        </li>
                    ))}
                </ul>
            </div>
        </button>
    );
}
