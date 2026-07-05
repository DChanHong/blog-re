"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Building2, Check, Newspaper, RadioTower, Scale } from "lucide-react";
import { projectsData } from "@/data/careerData";

const projectPresentation = {
    "realtime-support": { label: "실시간 상담", icon: RadioTower },
    "snn-cms": { label: "SNN CMS", icon: Newspaper },
    "erp-groupware": { label: "ERP·그룹웨어", icon: Building2 },
    "legal-platform": { label: "법률 플랫폼", icon: Scale },
};

export default function Section4() {
    const [activeProjectId, setActiveProjectId] = useState(projectsData[0].id);
    const activeProject =
        projectsData.find((project) => project.id === activeProjectId) ?? projectsData[0];
    const ActiveIcon =
        projectPresentation[activeProject.id as keyof typeof projectPresentation]?.icon ??
        RadioTower;

    const moveTabFocus = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
        let nextIndex = currentIndex;

        if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % projectsData.length;
        else if (event.key === "ArrowLeft")
            nextIndex = (currentIndex - 1 + projectsData.length) % projectsData.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = projectsData.length - 1;
        else return;

        event.preventDefault();
        const nextProject = projectsData[nextIndex];
        setActiveProjectId(nextProject.id);
        requestAnimationFrame(() =>
            document.getElementById(`career-tab-${nextProject.id}`)?.focus(),
        );
    };

    return (
        <section
            className="flex h-full w-full flex-col justify-center"
            aria-labelledby="career-preview-title"
        >
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 shadow-2xl shadow-blue-950/10 backdrop-blur-xl">
                <div className="px-5 pt-6 sm:px-7 sm:pt-7 lg:px-8 lg:pt-8">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                                aria-hidden="true"
                            />
                            Frontend Engineer
                        </span>
                        <span className="text-xs text-slate-500">2023.09 — Present</span>
                    </div>

                    <h3
                        id="career-preview-title"
                        className="mt-5 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl"
                    >
                        주요 프로젝트
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        프로젝트를 선택하면 담당 역할과 해당 프로젝트의 성과를 확인할 수 있습니다.
                    </p>
                </div>

                <div
                    className="mt-6 overflow-x-auto border-y border-white/10 bg-black/20 px-2 py-2"
                    role="tablist"
                    aria-label="주요 프로젝트 선택"
                >
                    <div className="flex min-w-max gap-1">
                        {projectsData.map((project, index) => {
                            const presentation =
                                projectPresentation[project.id as keyof typeof projectPresentation];
                            const isActive = activeProject.id === project.id;

                            return (
                                <button
                                    key={project.id}
                                    id={`career-tab-${project.id}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls="career-project-panel"
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => setActiveProjectId(project.id)}
                                    onKeyDown={(event) => moveTabFocus(event, index)}
                                    className={`rounded-xl px-3.5 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:text-sm ${
                                        isActive
                                            ? "bg-blue-400/15 text-blue-200"
                                            : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                                    }`}
                                >
                                    {presentation?.label ?? project.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div
                    id="career-project-panel"
                    role="tabpanel"
                    aria-labelledby={`career-tab-${activeProject.id}`}
                    className="p-5 sm:p-7 lg:p-8"
                >
                    <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
                            <ActiveIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-medium text-blue-300">
                                    {activeProject.status}
                                </span>
                                <span className="text-slate-700">/</span>
                                <span className="font-mono text-slate-500">
                                    {activeProject.period}
                                </span>
                            </div>
                            <h4 className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">
                                {activeProject.title}
                            </h4>
                            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                                {activeProject.role}
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate-300">{activeProject.summary}</p>

                    <dl
                        className={`mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 ${
                            activeProject.metrics.length >= 4
                                ? "grid-cols-2 sm:grid-cols-4"
                                : "grid-cols-3"
                        }`}
                    >
                        {activeProject.metrics.map((metric) => (
                            <div
                                key={`${metric.value}-${metric.label}`}
                                className="min-w-0 bg-slate-950/95 px-3 py-4 text-center"
                            >
                                <dd className="text-base font-bold tracking-tight text-white sm:text-lg">
                                    {metric.value}
                                </dd>
                                <dt className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                                    {metric.label}
                                </dt>
                            </div>
                        ))}
                    </dl>

                    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                        {activeProject.responsibilities.slice(0, 2).map((responsibility) => (
                            <li
                                key={responsibility}
                                className="flex gap-2.5 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6"
                            >
                                <Check
                                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                                    aria-hidden="true"
                                />
                                <span>{responsibility}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                        <ul className="flex flex-wrap gap-1.5" aria-label="프로젝트 기술">
                            {activeProject.techStack.slice(0, 5).map((technology) => (
                                <li
                                    key={technology}
                                    className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-slate-500"
                                >
                                    {technology}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={`/career#${activeProject.id}`}
                            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            프로젝트 상세 보기
                            <ArrowUpRight
                                className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
