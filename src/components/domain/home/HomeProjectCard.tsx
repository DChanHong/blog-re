import Link from "next/link";
import type { CareerProject } from "@/types/portfolio";
import styles from "./home-reference.module.css";

export default function HomeProjectCard({ project }: { project: CareerProject }) {
    return (
        <Link href={`/project/${project.id}`} className={styles.projectCard}>
            <p className={styles.eyebrow}>{project.status}</p>
            <h3>{project.title}</h3>
            <p className={styles.projectSummary}>{project.summary}</p>
            <div className={styles.projectMetricSpace}>
                <dl className={styles.projectMetrics}>
                    {project.metrics.slice(0, 2).map((metric) => (
                        <div key={metric.label}>
                            <dt>{metric.label}</dt>
                            <dd>{metric.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <span className={styles.cardLink}>
                프로젝트 자세히 보기 <span aria-hidden="true">›</span>
            </span>
        </Link>
    );
}
