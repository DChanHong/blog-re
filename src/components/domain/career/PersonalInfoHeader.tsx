import { ArrowUpRight, BookOpenText, Github } from "lucide-react";
import type { CareerMetric } from "@/data/careerData";

interface PersonalInfo {
    name: string;
    position: string;
    company: string;
    period: string;
    introduction: string;
    university: string;
    degree: string;
    gpa: string;
    email: string;
    github: string;
    blog: string;
}

interface PersonalInfoHeaderProps {
    personalInfo: PersonalInfo;
    metrics: CareerMetric[];
}

const linkClassName =
    "group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-blue-400/60 hover:bg-blue-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

export default function PersonalInfoHeader({ personalInfo, metrics }: PersonalInfoHeaderProps) {
    return (
        <header id="overview" className="scroll-mt-32 pt-4 md:pt-10">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 px-6 py-9 shadow-2xl shadow-blue-950/20 backdrop-blur-xl sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                <div
                    aria-hidden="true"
                    className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
                />

                <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
                    <div>
                        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
                            <span className="rounded-full border border-blue-400/25 bg-blue-400/10 px-3 py-1 font-medium text-blue-300">
                                {personalInfo.position}
                            </span>
                            <span className="text-slate-400">{personalInfo.period}</span>
                        </div>

                        <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-blue-300 uppercase">
                            Career portfolio
                        </p>
                        <h1 className="text-4xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                            {personalInfo.name}
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
                            {personalInfo.introduction}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                className={linkClassName}
                                href={personalInfo.github}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="h-4 w-4" aria-hidden="true" />
                                GitHub
                                <ArrowUpRight
                                    className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </a>
                            <a
                                className={linkClassName}
                                href={personalInfo.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <BookOpenText className="h-4 w-4" aria-hidden="true" />
                                Tech Blog
                                <ArrowUpRight
                                    className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                            Current
                        </p>
                        <p className="mt-3 text-xl font-semibold text-white">
                            {personalInfo.company}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            입사 당시 법무법인 대륜 개발팀
                        </p>
                        <div className="my-5 h-px bg-white/10" />
                        <p className="text-sm leading-6 text-slate-300">
                            프론트엔드를 중심으로 사용자 서비스, 관리자 CMS, ERP와 실시간 상담
                            플랫폼을 개발하고 있습니다.
                        </p>
                    </div>
                </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur-md sm:p-6"
                    >
                        <dt className="text-sm font-medium text-slate-400">{metric.label}</dt>
                        <dd className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            {metric.value}
                        </dd>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{metric.caption}</p>
                    </div>
                ))}
            </dl>
        </header>
    );
}

export type { PersonalInfo };
