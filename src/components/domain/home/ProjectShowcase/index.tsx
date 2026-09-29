import Link from "next/link";
import type { ElementType } from "react";
import { ArrowUpRight, Building2, Newspaper, RadioTower, Scale } from "lucide-react";
import { projectsData } from "@/data/projects";
import type { CareerProject } from "@/types/portfolio";

const projectMeta: Record<string, { icon: ElementType; iconColor: string; accentBar: string }> = {
    "realtime-support": {
        icon: RadioTower,
        iconColor: "text-accent bg-sunken border-border",
        accentBar: "bg-accent",
    },
    "snn-cms": {
        icon: Newspaper,
        iconColor: "text-accent bg-sunken border-border",
        accentBar: "bg-accent",
    },
    "erp-groupware": {
        icon: Building2,
        iconColor: "text-secondary bg-muted border-border",
        accentBar: "bg-muted",
    },
    "legal-platform": {
        icon: Scale,
        iconColor: "text-warning bg-warning-surface border-border",
        accentBar: "bg-warning",
    },
};

const statusBadge: Record<string, string> = {
    "운영 중": "bg-success-surface text-success border-border",
    완료: "bg-muted text-secondary border-border",
    "출시 보류": "bg-warning-surface text-warning border-border",
};

export default function ProjectShowcase() {
    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {projectsData.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                ))}
            </div>
        </>
    );
}

function ProjectCard({ project }: { project: CareerProject }) {
    const meta = projectMeta[project.id];
    const Icon = meta?.icon ?? RadioTower;

    return (
        <Link
            href={`/project/${project.id}`}
            className="group text-left w-full overflow-hidden rounded-2xl border border-border bg-raised shadow-sm hover:shadow-sm hover:border-border hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
            {/* 컬러 탑 바 */}
            <div className={`h-1 w-full ${meta?.accentBar}`} />

            <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${meta?.iconColor}`}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                            <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.8125rem] font-semibold ${statusBadge[project.status]}`}
                            >
                                {project.status}
                            </span>
                            <p className="mt-1 text-[0.8125rem] text-muted-ink">{project.period}</p>
                        </div>
                    </div>
                    <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-muted-ink group-hover:text-accent transition-colors mt-1"
                        aria-hidden="true"
                    />
                </div>

                {/* 제목 */}
                <h3 className="text-base font-bold leading-snug text-ink group-hover:text-accent transition-colors sm:text-lg">
                    {project.title}
                </h3>
                <p className="mt-1 text-[0.8125rem] text-muted-ink line-clamp-1">
                    {project.subtitle}
                </p>

                {/* 요약 */}
                <p className="mt-3 text-sm leading-6 text-secondary line-clamp-2">
                    {project.summary}
                </p>

                {/* 구분선 */}
                <div className="my-4 h-px bg-muted" />

                {/* 수치 */}
                {project.metrics.length > 0 && (
                    <dl className="grid grid-cols-2 gap-3 mb-4">
                        {project.metrics.slice(0, 2).map((m) => (
                            <div key={m.label}>
                                <dd className="text-lg font-bold tracking-tight text-ink">
                                    {m.value}
                                </dd>
                                <dt className="mt-0.5 text-[0.8125rem] text-muted-ink">
                                    {m.label}
                                </dt>
                            </div>
                        ))}
                    </dl>
                )}

                {/* 기술 스택 */}
                <ul className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((t) => (
                        <li
                            key={t}
                            className="rounded-md border border-border bg-muted px-2 py-0.5 text-[0.8125rem] font-medium text-secondary"
                        >
                            {t}
                        </li>
                    ))}
                </ul>
            </div>
        </Link>
    );
}
