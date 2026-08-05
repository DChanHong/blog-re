import { ArrowUpRight, BookOpenText, Github } from "lucide-react";
import { careerMetrics, personalInfoData } from "@/data/careerData";

export default function CareerHighlight() {
    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 px-7 py-8 sm:px-10 sm:py-10">
            <div className="relative">
                {/* 배경 블러 */}
                <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100 blur-3xl opacity-60" />
                <div aria-hidden="true" className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-violet-100 blur-3xl opacity-60" />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
                    {/* 좌측: 이름·포지션·소개 */}
                    <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2.5 text-sm">
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-medium text-blue-600">
                                {personalInfoData.position}
                            </span>
                            <span className="text-slate-400">{personalInfoData.period}</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {personalInfoData.name}
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                            {personalInfoData.introduction}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <a
                                href={personalInfoData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <Github className="h-4 w-4" aria-hidden="true" />
                                GitHub
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            </a>
                            <a
                                href={personalInfoData.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <BookOpenText className="h-4 w-4" aria-hidden="true" />
                                Tech Blog
                                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* 우측: 현재 회사 카드 */}
                    <div className="lg:w-56 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">Current</p>
                        <p className="mt-2 text-base font-semibold text-slate-900">{personalInfoData.company}</p>
                        <div className="my-4 h-px bg-slate-200" />
                        <p className="text-xs leading-5 text-slate-500">
                            프론트엔드를 중심으로 사용자 서비스, 관리자 CMS, ERP와 실시간 상담 플랫폼을 개발하고 있습니다.
                        </p>
                    </div>
                </div>

                {/* 핵심 지표 */}
                <dl className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {careerMetrics.map((m) => (
                        <div key={m.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <dt className="text-xs font-medium text-slate-500">{m.label}</dt>
                            <dd className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                {m.value}
                            </dd>
                            <p className="mt-1 text-[10px] leading-4 text-slate-400">{m.caption}</p>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
