import Link from "next/link";
import type { CareerProject, ProjectStatus } from "@/types/portfolio";

interface ProjectTimelineProps {
    projects: CareerProject[];
}

const statusStyles: Record<ProjectStatus, string> = {
    "운영 중": "border-emerald-200 bg-emerald-50 text-emerald-600",
    완료: "border-blue-200 bg-blue-50 text-blue-600",
    "출시 보류": "border-amber-200 bg-amber-50 text-amber-600",
};

export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
    return (
        <section id="projects" className="scroll-mt-32 pb-20 md:pb-28">
            <div className="mb-12 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
                    프로젝트
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
                {projects.map((project) => (
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
                                                    대표 프로젝트
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
                                            역할
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

                            <Link
                                href={`/project/${project.id}`}
                                className="block border-t border-slate-200 px-5 py-4 text-sm font-semibold text-blue-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 sm:px-8"
                            >
                                프로젝트 상세 보기
                            </Link>
                        </article>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export type { CareerProject };
