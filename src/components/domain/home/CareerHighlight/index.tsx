import { ArrowUpRight, BookOpenText, Github } from "lucide-react";
import { personalInfoData } from "@/data/careerData";

const highlights = [
    { value: "약 3년", label: "실서비스 개발 경력", caption: "2023.09부터" },
    { value: "4개", label: "참여·주도한 프로젝트", caption: "법률·ERP·CMS·실시간 상담" },
    { value: "2개", label: "현재 운영 중인 서비스", caption: "실시간 상담 · ERP" },
];

export default function CareerHighlight() {
    return (
        <div className="overflow-hidden rounded-3xl border border-border bg-raised shadow-sm px-7 py-8 sm:px-10 sm:py-10">
            <div className="relative">
                {/* 배경 블러 */}
                <div
                    aria-hidden="true"
                    className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sunken blur-3xl opacity-60"
                />
                <div
                    aria-hidden="true"
                    className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-sunken blur-3xl opacity-60"
                />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_auto]">
                    {/* 좌측: 이름·포지션·소개 */}
                    <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2.5 text-sm">
                            <span className="rounded-full border border-border bg-sunken px-3 py-1 font-medium text-accent">
                                {personalInfoData.position}
                            </span>
                            <span className="text-muted-ink">{personalInfoData.period}</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                            {personalInfoData.name}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-secondary sm:text-base sm:leading-8">
                            프론트엔드를 출발점으로 API 설계와 실시간 플랫폼, 백엔드 개발까지 담당
                            범위를 넓혀왔습니다. 운영되는 서비스와 함께 역할을 확장하며
                            성장해왔습니다.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <a
                                href={personalInfoData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-full border border-border bg-raised px-4 py-2 text-sm font-medium text-secondary transition hover:border-border hover:bg-sunken hover:text-accent"
                            >
                                <Github className="h-4 w-4" aria-hidden="true" />
                                GitHub
                                <ArrowUpRight
                                    className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </a>
                            <a
                                href={personalInfoData.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-full border border-border bg-raised px-4 py-2 text-sm font-medium text-secondary transition hover:border-border hover:bg-sunken hover:text-accent"
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

                    {/* 우측: 현재 회사 카드 */}
                    <div className="lg:w-56 rounded-2xl border border-border bg-muted p-5">
                        <p className="text-[0.8125rem] font-semibold tracking-[0.18em] text-muted-ink uppercase">
                            현재 소속
                        </p>
                        <p className="mt-2 text-base font-semibold text-ink">
                            {personalInfoData.company}
                        </p>
                        <div className="my-4 h-px bg-muted" />
                        <p className="text-[0.8125rem] leading-5 text-secondary">
                            사용자 서비스, 관리자 CMS, ERP, 실시간 상담 플랫폼 등 운영 중인 웹
                            서비스 개발을 담당하고 있습니다.
                        </p>
                    </div>
                </div>

                {/* 핵심 지표 */}
                <dl className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {highlights.map((m) => (
                        <div
                            key={m.label}
                            className="rounded-2xl border border-border bg-raised p-4 shadow-sm"
                        >
                            <dt className="text-[0.8125rem] font-medium text-secondary">
                                {m.label}
                            </dt>
                            <dd className="mt-1.5 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                                {m.value}
                            </dd>
                            <p className="mt-1 text-[0.8125rem] leading-4 text-muted-ink">
                                {m.caption}
                            </p>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
