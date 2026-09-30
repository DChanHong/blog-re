import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectCaseStudy } from "@/data/projectCaseStudies";
import styles from "./project-detail.module.css";

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className={styles.section}>
            <h2>{title}</h2>
            <div>{children}</div>
        </section>
    );
}

export default function ProjectDetails({
    study,
    previous,
    next,
}: {
    study: ProjectCaseStudy;
    previous: { slug: string; title: string };
    next: { slug: string; title: string };
}) {
    const { project } = study;
    return (
        <div className={styles.page}>
            <Link href="/work" className={styles.back}>
                ← 전체 프로젝트
            </Link>
            <article>
                <header className={styles.hero}>
                    <p>
                        {study.category} · {project.status}
                    </p>
                    <h1>{project.title}</h1>
                    <p className={styles.subtitle}>{project.subtitle}</p>
                </header>
                <dl className={styles.metrics} aria-label="핵심 성과와 구현 범위">
                    {project.metrics.map((metric) => (
                        <div key={metric.label}>
                            <dt>{metric.label}</dt>
                            <dd>{metric.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className={styles.comparison}>
                    <section>
                        <h2>{study.comparison[0]}</h2>
                        <ul>
                            {study.before.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                    <section className={styles.after}>
                        <h2>{study.comparison[1]}</h2>
                        <ul>
                            {study.after.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </section>
                </div>
                <div className={styles.body}>
                    <Section title="프로젝트 배경">
                        <p className={styles.lead}>{project.background}</p>
                    </Section>
                    <Section title="내 역할과 범위">
                        <p className={styles.role}>{project.role}</p>
                        <p className={styles.period}>{project.period}</p>
                        <p>{study.scope}</p>
                    </Section>
                    <Section title="해결할 문제">
                        <ol className={styles.numbered}>
                            {project.challenges.map((item, index) => (
                                <li key={item.title}>
                                    <span aria-hidden="true">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.problem}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </Section>
                    <Section title="구현한 내용">
                        <p className={styles.lead}>{project.summary}</p>
                        <ul className={styles.bullets}>
                            {project.responsibilities.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </Section>
                    <Section title="접근 방식">
                        <ol className={styles.approach}>
                            {project.challenges.map((item) => (
                                <li key={item.title}>
                                    <h3>{item.title}</h3>
                                    <p>{item.action}</p>
                                    <p className={styles.result}>{item.result}</p>
                                </li>
                            ))}
                        </ol>
                    </Section>
                    <Section title="시스템 구조">
                        <ol className={styles.flow} aria-label="주요 구현 흐름">
                            {study.flow.map((item) => (
                                <li key={item.label}>
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </li>
                            ))}
                        </ol>
                        <p className={styles.flowNote}>
                            담당 기능을 중심으로 정리한 개념 흐름입니다.
                        </p>
                        <dl className={styles.architecture}>
                            {study.architecture.map((item) => (
                                <div key={item.label}>
                                    <dt>{item.label}</dt>
                                    <dd>{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </Section>
                    <Section title="품질 관리와 검증">
                        <ul className={styles.checks}>
                            {study.quality.map((item) => (
                                <li key={item}>
                                    <span aria-hidden="true">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>
                    {project.retrospective && (
                        <Section title="회고">
                            <p>{project.retrospective}</p>
                        </Section>
                    )}
                    <Section title="사용 기술">
                        <ul className={styles.stack}>
                            {project.techStack.map((tech) => (
                                <li key={tech}>{tech}</li>
                            ))}
                        </ul>
                    </Section>
                    <nav className={styles.navigation} aria-label="프로젝트 이전 다음 탐색">
                        <Link href={`/project/${previous.slug}`}>
                            <span>← 이전 프로젝트</span>
                            {previous.title}
                        </Link>
                        <Link href={`/project/${next.slug}`}>
                            <span>다음 프로젝트 →</span>
                            {next.title}
                        </Link>
                    </nav>
                </div>
            </article>
        </div>
    );
}
