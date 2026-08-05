import { CheckCircle2 } from "lucide-react";
import type { Capability } from "@/data/careerData";

interface TechStackProps {
    capabilities: Capability[];
}

export default function TechStack({ capabilities }: TechStackProps) {
    return (
        <section id="capabilities" className="scroll-mt-32 pb-20 md:pb-28">
            <div className="mb-10 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
                    Capabilities
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    기술 이름보다 적용 근거
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                    라이브러리를 사용했다는 사실보다 어떤 문제에 적용했고, 운영 가능한 구조로
                    만들었는지를 설명합니다.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {capabilities.map((capability, index) => (
                    <article
                        key={capability.title}
                        className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-8 motion-reduce:transform-none"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <span className="font-mono text-xs font-semibold text-blue-600">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <ul
                                className="flex flex-wrap justify-end gap-1.5"
                                aria-label="관련 기술"
                            >
                                {capability.technologies.map((technology) => (
                                    <li
                                        key={technology}
                                        className="rounded-md bg-blue-50 px-2 py-1 text-[11px] text-blue-600"
                                    >
                                        {technology}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h3 className="mt-8 text-xl font-semibold text-slate-900">
                            {capability.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-500">
                            {capability.description}
                        </p>
                        <ul className="mt-6 space-y-3 border-t border-slate-200 pt-5">
                            {capability.evidence.map((item) => (
                                <li
                                    key={item}
                                    className="flex gap-3 text-sm leading-6 text-slate-600"
                                >
                                    <CheckCircle2
                                        className="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                                        aria-hidden="true"
                                    />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
}

export type { Capability };
