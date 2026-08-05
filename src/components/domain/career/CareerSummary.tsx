import type { GrowthStep } from "@/data/careerData";

interface CareerSummaryProps {
    steps: GrowthStep[];
}

export default function CareerSummary({ steps }: CareerSummaryProps) {
    return (
        <section id="experience" className="scroll-mt-32 py-20 md:py-28">
            <div className="mb-10 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
                    Experience
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    화면 개발에서 서비스 전체 흐름으로
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                    하나의 회사에서 여러 운영 서비스를 경험하며 프론트엔드, API, 데이터, 실시간 통신
                    순서로 담당 범위를 넓혀왔습니다.
                </p>
            </div>

            <ol className="grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <li
                        key={`${step.year}-${step.title}`}
                        className="relative bg-white p-6 sm:p-8"
                    >
                        <div className="mb-7 flex items-center justify-between">
                            <span className="font-mono text-sm font-semibold text-blue-600">
                                {step.year}
                            </span>
                            <span className="text-xs text-slate-300">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-500">{step.description}</p>
                        <ul
                            className="mt-5 flex flex-wrap gap-2"
                            aria-label={`${step.year} 핵심 기술`}
                        >
                            {step.keywords.map((keyword) => (
                                <li
                                    key={keyword}
                                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
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
