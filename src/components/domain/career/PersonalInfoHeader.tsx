import { ArrowUpRight, BookOpenText, Github } from "lucide-react";
import type { CareerMetric } from "@/types/portfolio";

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
    "group inline-flex items-center gap-2 rounded-full border border-border bg-raised px-4 py-2.5 text-sm font-medium text-secondary transition hover:border-border hover:bg-sunken hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export default function PersonalInfoHeader({ personalInfo, metrics }: PersonalInfoHeaderProps) {
    return (
        <header id="overview" className="scroll-mt-32 pt-4 md:pt-10">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-raised px-6 py-9 shadow-sm sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                <div
                    aria-hidden="true"
                    className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sunken blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-sunken blur-3xl"
                />

                <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
                    <div>
                        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
                            <span className="rounded-full border border-border bg-sunken px-3 py-1 font-medium text-accent">
                                {personalInfo.position}
                            </span>
                            <span className="text-muted-ink">{personalInfo.period}</span>
                        </div>

                        <p className="mb-3 text-sm font-semibold tracking-[0.24em] text-accent uppercase">
                            이력서
                        </p>
                        <h1 className="text-4xl font-bold tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
                            {personalInfo.name}
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-secondary sm:text-xl sm:leading-9">
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
                                기술 블로그
                                <ArrowUpRight
                                    className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted p-6">
                        <p className="text-[0.8125rem] font-semibold tracking-[0.18em] text-muted-ink uppercase">
                            현재 소속
                        </p>
                        <p className="mt-3 text-xl font-semibold text-ink">
                            {personalInfo.company}
                        </p>
                        <p className="mt-1 text-sm text-secondary">
                            입사 당시 법무법인 대륜 개발팀
                        </p>
                        <div className="my-5 h-px bg-muted" />
                        <p className="text-sm leading-6 text-secondary">
                            실시간 상담 플랫폼과 인사평가·채용·CMS를 개발하며, 사용자 화면부터
                            API·데이터 설계와 운영 문제 해결까지 담당해왔습니다.
                        </p>
                    </div>
                </div>
            </div>

            <dl className="metric-grid mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-2xl border border-border bg-raised p-5 shadow-sm sm:p-6"
                    >
                        <dt className="text-sm font-medium text-secondary">{metric.label}</dt>
                        <dd className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                            {metric.value}
                        </dd>
                        <p className="mt-2 text-[0.8125rem] leading-5 text-muted-ink">
                            {metric.caption}
                        </p>
                    </div>
                ))}
            </dl>
        </header>
    );
}

export type { PersonalInfo };
