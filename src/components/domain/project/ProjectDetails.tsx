import { ArrowDown, Check, CircleAlert, Layers3 } from "lucide-react";
import type { CareerProject } from "@/types/portfolio";

function ProjectArchitecture({ items }: { items: string[] }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-slate-900">서비스 흐름</h2>
            </div>
            <ol className="grid gap-2 lg:grid-flow-col lg:auto-cols-fr">
                {items.map((item, index) => (
                    <li
                        key={item}
                        className="relative flex min-w-0 flex-col items-center gap-2 lg:block"
                    >
                        <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-xs leading-5 text-slate-600 lg:min-h-20 lg:px-2 lg:flex lg:items-center lg:justify-center">
                            {item}
                        </div>
                        {index < items.length - 1 && (
                            <ArrowDown
                                className="h-4 w-4 shrink-0 text-slate-300 lg:absolute lg:-right-3 lg:top-1/2 lg:z-10 lg:-translate-y-1/2 lg:-rotate-90"
                                aria-hidden="true"
                            />
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default function ProjectDetails({ project }: { project: CareerProject }) {
    return (
        <div className="border-t border-slate-200 px-5 py-7 sm:px-8 sm:py-9">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                        배경
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">프로젝트 배경</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{project.background}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                        기여
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">담당 범위</h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {project.responsibilities.map((responsibility) => (
                            <li
                                key={responsibility}
                                className="flex gap-3 text-sm leading-6 text-slate-600"
                            >
                                <Check
                                    className="mt-1 h-4 w-4 shrink-0 text-blue-500"
                                    aria-hidden="true"
                                />
                                <span>{responsibility}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {!!project.architecture?.length && (
                <div className="mt-9">
                    <ProjectArchitecture items={project.architecture} />
                </div>
            )}

            {project.challenges.length > 0 && (
                <div className="mt-10">
                    <div className="mb-5">
                        <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                            문제 해결
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-slate-900">문제와 해결</h2>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {project.challenges.map((challenge, index) => (
                            <article
                                key={challenge.title}
                                className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 ${
                                    project.challenges.length % 2 === 1 &&
                                    index === project.challenges.length - 1
                                        ? "lg:col-span-2"
                                        : ""
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-semibold text-slate-900">
                                        {challenge.title}
                                    </h3>
                                    <span className="font-mono text-xs text-slate-300">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>
                                <dl className="mt-5 space-y-4 text-sm leading-6">
                                    <div>
                                        <dt className="mb-1 text-xs font-semibold text-slate-400">
                                            문제
                                        </dt>
                                        <dd className="text-slate-500">{challenge.problem}</dd>
                                    </div>
                                    <div>
                                        <dt className="mb-1 text-xs font-semibold text-blue-600">
                                            접근
                                        </dt>
                                        <dd className="text-slate-600">{challenge.action}</dd>
                                    </div>
                                    <div>
                                        <dt className="mb-1 text-xs font-semibold text-emerald-600">
                                            결과
                                        </dt>
                                        <dd className="text-slate-600">{challenge.result}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
                    <h2 className="text-sm font-semibold text-emerald-700">성과와 영향</h2>
                    <ul className="mt-4 space-y-3">
                        {project.achievements.map((achievement) => (
                            <li
                                key={achievement}
                                className="flex gap-3 text-sm leading-6 text-slate-600"
                            >
                                <Check
                                    className="mt-1 h-4 w-4 shrink-0 text-emerald-500"
                                    aria-hidden="true"
                                />
                                <span>{achievement}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {project.retrospective && (
                    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:p-6">
                        <h2 className="text-sm font-semibold text-violet-700">회고</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                            {project.retrospective}
                        </p>
                    </div>
                )}
            </div>

            {project.scopeNote && (
                <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                    <CircleAlert
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                        aria-hidden="true"
                    />
                    <p className="text-xs leading-5 text-slate-500">
                        <strong className="mr-1 font-semibold text-amber-700">담당 범위.</strong>
                        {project.scopeNote}
                    </p>
                </div>
            )}
        </div>
    );
}
