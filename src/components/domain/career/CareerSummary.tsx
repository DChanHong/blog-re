import type { GrowthStep } from "@/data/careerData";

interface CareerSummaryProps {
    steps: GrowthStep[];
}

export default function CareerSummary({ steps }: CareerSummaryProps) {
    return (
        <section id="experience" className="scroll-mt-32 py-20 md:py-28">
            <div className="mb-10 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-blue-400 uppercase">
                    Experience
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    화면 개발에서 서비스 전체 흐름으로
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
                    하나의 회사에서 여러 운영 서비스를 경험하며 프론트엔드, API, 데이터, 실시간 통신
                    순서로 담당 범위를 넓혀왔습니다.
                </p>
            </div>

            <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <li
                        key={`${step.year}-${step.title}`}
                        className="relative bg-slate-950/90 p-6 sm:p-8"
                    >
                        <div className="mb-7 flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold text-blue-300">
                                {step.year}
                            </span>
                            <span className="text-xs text-slate-600">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-400">{step.description}</p>
                        <ul
                            className="mt-5 flex flex-wrap gap-2"
                            aria-label={`${step.year} 핵심 기술`}
                        >
                            {step.keywords.map((keyword) => (
                                <li
                                    key={keyword}
                                    className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-slate-300"
                                >
                                    {keyword}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export type { GrowthStep };
