import type { ReactNode } from "react";
import Link from "next/link";
import { capabilitiesData, careerMetrics, growthSteps, personalInfoData } from "@/data/careerData";
import { projectsData } from "@/data/projects";
import PrimaryButton from "@/components/ui/PrimaryButton";
import TextLink from "@/components/ui/TextLink";
import HomeProjectCard from "./HomeProjectCard";
import HeroEntrance from "./HeroEntrance";
import styles from "./home-reference.module.css";

function SectionHeading({
    id,
    label,
    title,
    secondary,
    children,
}: {
    id: string;
    label: string;
    title: string;
    secondary: string;
    children?: ReactNode;
}) {
    return (
        <div className={styles.headingBlock}>
            <p className={styles.eyebrow}>{label}</p>
            <h2 id={id} className={styles.heading}>
                {title}
                <br />
                <span>{secondary}</span>
            </h2>
            {children && <p className={styles.lead}>{children}</p>}
        </div>
    );
}

export default function ReferenceHome({ writingSlot }: { writingSlot: ReactNode }) {
    return (
        <div className={styles.home}>
            <section className={styles.hero} aria-labelledby="home-title">
                <HeroEntrance className={styles.heroInner}>
                    <p className={styles.name}>{personalInfoData.name}</p>
                    <h1 id="home-title" className={styles.heroTitle}>
                        {personalInfoData.position}
                    </h1>
                    <p className={styles.introduction}>{personalInfoData.introduction}</p>
                    <div className={styles.actions}>
                        <PrimaryButton href="/work" className={styles.primary}>
                            프로젝트 보기
                        </PrimaryButton>
                        <TextLink href="/resume" className={styles.link}>
                            이력서 보기 <span aria-hidden="true">›</span>
                        </TextLink>
                    </div>
                    <p className={styles.affiliation}>
                        {personalInfoData.company} · {personalInfoData.period}
                    </p>
                </HeroEntrance>
            </section>
            <section
                className={`${styles.section} ${styles.capabilities}`}
                aria-labelledby="home-capabilities"
            >
                <div className={styles.container}>
                    <SectionHeading
                        id="home-capabilities"
                        label="역량"
                        title="프론트엔드에서 시작해."
                        secondary="서비스의 흐름까지."
                    >
                        {personalInfoData.introduction}
                    </SectionHeading>
                    <ol className={styles.capabilityGrid}>
                        {capabilitiesData.map((item, index) => (
                            <li key={item.title} className={styles.capabilityCard}>
                                <span className={styles.number}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
            <section className={`${styles.section} ${styles.sunken}`} aria-labelledby="home-path">
                <div className={styles.container}>
                    <SectionHeading
                        id="home-path"
                        label="성장 과정"
                        title="서비스 개발의 시작."
                        secondary="그리고 역할의 확장."
                    >
                        프론트엔드를 출발점으로 API 설계와 실시간 플랫폼, 백엔드 개발까지 담당
                        범위를 넓혀왔습니다. 운영되는 서비스와 함께 역할을 확장하며 성장해왔습니다.
                    </SectionHeading>
                    <ol className={styles.pathGrid}>
                        {growthSteps.map((item) => (
                            <li key={item.year} className={styles.pathItem}>
                                <p className={styles.year}>{item.year}</p>
                                <h3>{item.title}</h3>
                                <p className={styles.pathDescription}>{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
            <section className={styles.section} aria-labelledby="home-work">
                <div className={styles.container}>
                    <SectionHeading
                        id="home-work"
                        label="프로젝트"
                        title="경험을 담은 프로젝트."
                        secondary="그 안의 역할과 성과."
                    >
                        각 지표와 프로젝트를 선택하면 담당 역할과 주요 성과를 확인할 수 있습니다.
                    </SectionHeading>
                    <dl className={styles.outcomes}>
                        {careerMetrics.map((metric, index) => (
                            <div key={metric.label}>
                                <Link
                                    href={index === 0 ? "/resume" : "/project/realtime-support"}
                                    className={styles.outcomeLink}
                                >
                                    <dt>{metric.label}</dt>
                                    <dd>{metric.value}</dd>
                                    <dd className={styles.metricCaption}>{metric.caption}</dd>
                                </Link>
                            </div>
                        ))}
                    </dl>
                    <ul className={styles.projectGrid}>
                        {projectsData.map((project) => (
                            <li key={project.id}>
                                <HomeProjectCard project={project} />
                            </li>
                        ))}
                    </ul>
                    <div className={styles.more}>
                        <TextLink href="/work" className={styles.link}>
                            전체 프로젝트 보기 <span aria-hidden="true">›</span>
                        </TextLink>
                    </div>
                </div>
            </section>
            <section
                className={`${styles.section} ${styles.sunken}`}
                aria-labelledby="home-toolkit"
            >
                <div className={styles.container}>
                    <SectionHeading
                        id="home-toolkit"
                        label="기술과 학력"
                        title="사용해 온 기술."
                        secondary="배움의 기반."
                    />
                    <div className={styles.toolkitGrid}>
                        <div>
                            <h3 className={styles.eyebrow}>기술</h3>
                            <dl className={styles.toolkitList}>
                                {capabilitiesData.map((item) => (
                                    <div key={item.title}>
                                        <dt>{item.title}</dt>
                                        <dd>{item.technologies.join(" · ")}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div>
                            <h3 className={styles.eyebrow}>학력</h3>
                            <ul className={styles.education}>
                                <li>
                                    <p>{personalInfoData.degree}</p>
                                    <p>
                                        {personalInfoData.university} · {personalInfoData.gpa}
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {writingSlot}
            <section className={`${styles.section} ${styles.contact}`} aria-labelledby="home-more">
                <div className={styles.heroInner}>
                    <p className={styles.eyebrow}>더 알아보기</p>
                    <h2 id="home-more" className={styles.heading}>
                        코드와 기록을
                        <br />
                        <span>더 살펴보세요.</span>
                    </h2>
                    <p className={styles.lead}>GitHub와 기술 블로그에서 더 확인할 수 있습니다.</p>
                    <div className={styles.actions}>
                        <PrimaryButton
                            href={personalInfoData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.primary}
                        >
                            GitHub
                        </PrimaryButton>
                        <TextLink
                            href={personalInfoData.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            Velog <span aria-hidden="true">›</span>
                        </TextLink>
                    </div>
                </div>
            </section>
        </div>
    );
}
