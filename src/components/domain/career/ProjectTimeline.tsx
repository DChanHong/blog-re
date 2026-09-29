import Link from "next/link";
import type { CareerProject, ProjectStatus } from "@/types/portfolio";

interface ProjectTimelineProps {
    projects: CareerProject[];
}

const statusStyles: Record<ProjectStatus, string> = {
    "개발·검수": "border-border bg-muted text-secondary",
    "이관 진행 중": "border-border bg-sunken text-accent",
    "운영 중": "border-border bg-success-surface text-success",
    완료: "border-border bg-sunken text-accent",
    "출시 보류": "border-border bg-warning-surface text-warning",
};

export default function ProjectTimeline({ projects }: ProjectTimelineProps) {
    return (
        <section id="projects" className="scroll-mt-32 pb-20 md:pb-28">
            <div className="mb-12 max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
                    프로젝트
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    운영 문제를 해결한 프로젝트
                </h2>
                <p className="mt-4 text-base leading-7 text-secondary sm:text-lg">
                    구현 기능보다 왜 필요했고, 어떤 경계를 설계했으며, 운영 결과가 어떻게
                    달라졌는지를 중심으로 정리했습니다.
                </p>
            </div>

            <ol className="relative ml-3 border-l border-border sm:ml-5">
                {projects.map((project) => (
                    <li
                        key={project.id}
                        id={project.id}
                        className="relative scroll-mt-32 pb-10 pl-6 sm:pl-10"
                    >
                        <span
                            aria-hidden="true"
                            className={`absolute -left-[7px] top-7 h-3.5 w-3.5 rounded-full border-[3px] border-border ${
                                project.status === "운영 중" ? "bg-success" : "bg-accent"
                            }`}
                        />

                        <article className="overflow-hidden rounded-3xl border border-border bg-raised shadow-md transition hover:border-border hover:shadow-sm">
                            <div className="p-5 sm:p-8">
                                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                                    <div className="min-w-0 max-w-3xl">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-[0.8125rem] font-semibold ${statusStyles[project.status]}`}
                                            >
                                                {project.status}
                                            </span>
                                            <span className="text-[0.8125rem] text-muted-ink">
                                                {project.period}
                                            </span>
                                            {project.featured && (
                                                <span className="text-[0.8125rem] font-medium text-accent">
                                                    대표 프로젝트
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-sm font-medium text-accent">
                                            {project.subtitle}
                                        </p>
                                        <p className="mt-5 text-sm leading-7 text-secondary sm:text-base">
                                            {project.summary}
                                        </p>
                                    </div>

                                    <div className="shrink-0 xl:w-72">
                                        <p className="text-[0.8125rem] font-semibold tracking-[0.14em] text-muted-ink uppercase">
                                            역할
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-secondary">
                                            {project.role}
                                        </p>
                                    </div>
                                </div>

                                <dl className="metric-grid mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-muted lg:grid-cols-4">
                                    {project.metrics.map((metric) => (
                                        <div
                                            key={`${metric.value}-${metric.label}`}
                                            className="bg-raised px-4 py-4"
                                        >
                                            <dd className="text-lg font-bold text-ink">
                                                {metric.value}
                                            </dd>
                                            <dt className="mt-1 text-[0.8125rem] leading-5 text-muted-ink">
                                                {metric.label}
                                            </dt>
                                        </div>
                                    ))}
                                </dl>

                                <ul className="mt-6 flex flex-wrap gap-2" aria-label="사용 기술">
                                    {project.techStack.map((tech) => (
                                        <li
                                            key={tech}
                                            className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-[0.8125rem] text-secondary"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link
                                href={`/project/${project.id}`}
                                className="block border-t border-border px-5 py-4 text-sm font-semibold text-accent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:px-8"
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
