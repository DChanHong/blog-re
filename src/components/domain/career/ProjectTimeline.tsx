import { ArrowDown, Check, ChevronDown, CircleAlert, Layers3 } from "lucide-react";
import type { CareerProject, ProjectStatus } from "@/data/careerData";

interface ProjectTimelineProps {
    projects: CareerProject[];
}

const statusStyles: Record<ProjectStatus, string> = {
    "운영 중": "border-emerald-200 bg-emerald-50 text-emerald-600",
    완료: "border-blue-200 bg-blue-50 text-blue-600",
    "출시 보류": "border-amber-200 bg-amber-50 text-amber-600",
};

function ProjectArchitecture({ items }: { items: string[] }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
                <Layers3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <h4 className="text-sm font-semibold text-slate-900">서비스 흐름</h4>
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

function ProjectDetails({ project }: { project: CareerProject }) {
    return (
        <div className="border-t border-slate-200 px-5 py-7 sm:px-8 sm:py-9">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                        Context
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">프로젝트 배경</h4>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{project.background}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                        Contribution
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">담당 범위</h4>
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

            {project.architecture && (
                <div className="mt-9">
                    <ProjectArchitecture items={project.architecture} />
                </div>
            )}

            {project.challenges.length > 0 && (
                <div className="mt-10">
                    <div className="mb-5">
                        <p className="text-xs font-semibold tracking-[0.16em] text-blue-600 uppercase">
                            Problem solving
                        </p>
                        <h4 className="mt-2 text-xl font-semibold text-slate-900">문제와 해결</h4>
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
                                    <h5 className="font-semibold text-slate-900">{challenge.title}</h5>
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
                    <h4 className="text-sm font-semibold text-emerald-700">성과와 영향</h4>
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
                        <h4 className="text-sm font-semibold text-violet-700">회고</h4>
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

export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
    return (
        <section id="projects" className="scroll-mt-32 pb-20 md:pb-28">
            <div className="mb-12 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
                    Selected projects
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    운영 문제를 해결한 프로젝트
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">
                    구현 기능보다 왜 필요했고, 어떤 경계를 설계했으며, 운영 결과가 어떻게
                    달라졌는지를 중심으로 정리했습니다.
                </p>
            </div>

            <ol className="relative ml-3 border-l border-slate-200 sm:ml-5">
                {projects.map((project, index) => (
                    <li
                        key={project.id}
                        id={project.id}
                        className="relative scroll-mt-32 pb-10 pl-6 sm:pl-10"
                    >
                        <span
                            aria-hidden="true"
                            className={`absolute -left-[7px] top-7 h-3.5 w-3.5 rounded-full border-[3px] border-slate-50 ${
                                project.status === "운영 중" ? "bg-emerald-400" : "bg-blue-400"
                            }`}
                        />

                        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-200/80 transition hover:border-slate-300 hover:shadow-lg">
                            <div className="p-5 sm:p-8">
                                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                                    <div className="min-w-0 max-w-3xl">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[project.status]}`}
                                            >
                                                {project.status}
                                            </span>
                                            <span className="font-mono text-xs text-slate-400">
                                                {project.period}
                                            </span>
                                            {project.featured && (
                                                <span className="text-xs font-medium text-violet-600">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-sm font-medium text-blue-600">
                                            {project.subtitle}
                                        </p>
                                        <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                                            {project.summary}
                                        </p>
                                    </div>

                                    <div className="shrink-0 xl:w-72">
                                        <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">
                                            Role
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            {project.role}
                                        </p>
                                    </div>
                                </div>

                                <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
                                    {project.metrics.map((metric) => (
                                        <div
                                            key={`${metric.value}-${metric.label}`}
                                            className="bg-white px-4 py-4"
                                        >
                                            <dd className="text-lg font-bold text-slate-900">
                                                {metric.value}
                                            </dd>
                                            <dt className="mt-1 text-xs leading-5 text-slate-400">
                                                {metric.label}
                                            </dt>
                                        </div>
                                    ))}
                                </dl>

                                <ul className="mt-6 flex flex-wrap gap-2" aria-label="사용 기술">
                                    {project.techStack.map((tech) => (
                                        <li
                                            key={tech}
                                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <details className="group" open={index === 0}>
                                <summary className="flex cursor-pointer list-none items-center justify-between border-t border-slate-200 px-5 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 sm:px-8 [&::-webkit-details-marker]:hidden">
                                    <span>프로젝트 상세 보기</span>
                                    <ChevronDown
                                        className="h-4 w-4 transition-transform group-open:rotate-180"
                                        aria-hidden="true"
                                    />
                                </summary>
                                <ProjectDetails project={project} />
                            </details>
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export type { CareerProject };
