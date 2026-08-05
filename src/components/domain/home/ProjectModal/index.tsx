"use client";

import { useEffect } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import Link from "next/link";
import type { CareerProject } from "@/data/careerData";

const statusColor: Record<string, string> = {
    "운영 중": "bg-emerald-50 text-emerald-600 border-emerald-200",
    완료: "bg-slate-100 text-slate-600 border-slate-200",
    "출시 보류": "bg-amber-50 text-amber-600 border-amber-200",
};

interface ProjectModalProps {
    project: CareerProject;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            {/* 백드롭 */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* 모달 패널 */}
            <div className="relative w-full sm:max-w-2xl bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl max-h-[92dvh] overflow-y-auto">
                {/* 헤더 */}
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white/90 backdrop-blur-sm px-6 py-5 border-b border-slate-100">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[project.status] ?? ""}`}
                            >
                                {project.status}
                            </span>
                            <span className="font-mono text-xs text-slate-400">{project.period}</span>
                        </div>
                        <h2
                            id="modal-title"
                            className="text-lg font-bold leading-snug text-slate-900 sm:text-xl"
                        >
                            {project.title}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">{project.role}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        aria-label="닫기"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="px-6 py-6 space-y-6">
                    {/* 요약 */}
                    <p className="text-sm leading-7 text-slate-600">{project.summary}</p>

                    {/* 지표 */}
                    {project.metrics.length > 0 && (
                        <dl
                            className={`grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 ${project.metrics.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
                        >
                            {project.metrics.map((m) => (
                                <div key={m.label} className="bg-white px-3 py-4 text-center">
                                    <dd className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                                        {m.value}
                                    </dd>
                                    <dt className="mt-1 text-[10px] leading-4 text-slate-400 sm:text-xs">
                                        {m.label}
                                    </dt>
                                </div>
                            ))}
                        </dl>
                    )}

                    {/* 담당 업무 */}
                    <div>
                        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                            담당 업무
                        </p>
                        <ul className="space-y-2">
                            {project.responsibilities.map((r) => (
                                <li
                                    key={r}
                                    className="flex gap-2.5 text-sm leading-6 text-slate-600"
                                >
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 주요 챌린지 */}
                    {project.challenges.length > 0 && (
                        <div>
                            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                                주요 챌린지
                            </p>
                            <div className="space-y-3">
                                {project.challenges.map((c) => (
                                    <div
                                        key={c.title}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                                        <p className="mt-1.5 text-xs leading-5 text-slate-500">{c.result}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 기술 스택 */}
                    <div>
                        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                            Tech Stack
                        </p>
                        <ul className="flex flex-wrap gap-2">
                            {project.techStack.map((t) => (
                                <li
                                    key={t}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
                                >
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 푸터 */}
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-slate-100 px-6 py-4">
                    <Link
                        href={`/career#${project.id}`}
                        onClick={onClose}
                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        커리어 페이지에서 자세히 보기
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
