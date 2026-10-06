import type { ReactNode } from "react";
import Link from "next/link";
import { careerMetrics, personalInfoData } from "@/data/careerData";
import { projectsData } from "@/data/projects";
import PrimaryButton from "@/components/ui/PrimaryButton";
import TextLink from "@/components/ui/TextLink";
import HomeProjectCard from "./HomeProjectCard";
import HeroEntrance from "./HeroEntrance";
import SectionEntrance from "./SectionEntrance";
import styles from "./home-reference.module.css";

const capabilityCards = [
    {
        title: "사용 과정을 챙깁니다",
        description:
            "입력한 내용이 유지되는지, 실시간 변경이 화면에 반영되는지 살핍니다. 오류가 나면 다음에 무엇을 해야 하는지 안내해 기능을 끝까지 이용할 수 있도록 합니다.",
    },
    {
        title: "화면과 데이터를 연결합니다",
        description:
            "사용자 화면과 관리자 도구에 필요한 API와 데이터 구조를 함께 설계합니다. 화면에서 입력한 값이 저장되고 다시 조회되는 과정까지 개발합니다.",
    },
    {
        title: "변경하기 쉬운 구조를 만듭니다",
        description:
            "여러 서비스에서 쓰는 기능은 공통 모듈로 관리합니다. 자주 바뀌는 문구와 설정은 서버에서 변경할 수 있게 해 수정할 때 반복되는 배포 작업을 줄입니다.",
    },
    {
        title: "운영 문제를 해결합니다",
        description:
            "실제 사용 중 발생한 오류를 재현하고 원인을 찾습니다. 상담 연결이 끊기거나 대량 저장과 외부 알림 처리에 실패하는 문제를 확인하고 복구 방법을 적용합니다.",
    },
];

const homeJourney = [
    {
        year: "2023",
        title: "화면과 API를 함께 개발하다",
        description:
            "채용사이트와 법률 서비스의 사용자·관리자 화면과 API를 개발했습니다. Next.js를 사용해 지원서 제출과 상담 신청에 필요한 데이터 처리도 맡았습니다.",
    },
    {
        year: "2024–2025",
        title: "뉴스 CMS의 데이터를 설계하다",
        description:
            "뉴스 CMS의 PostgreSQL 구조와 관리자 화면, API를 개발했습니다. 기사와 기자, 태그의 관계를 정리하고 검색과 콘텐츠 관리에 맞게 데이터 구조를 조정했습니다.",
    },
    {
        year: "2025–현재",
        title: "실시간 서비스의 운영을 맡다",
        description:
            "약 80개 홈페이지의 상담 위젯과 관리자 콘솔을 개발했습니다. 연결 복구와 상태 동기화를 개선했으며 기존 Go 서버의 API와 파일 처리 기능도 맡았습니다.",
    },
    {
        year: "2026",
        title: "인사평가와 관리자 업무를 구현하다",
        description:
            "인사평가 결과 전달과 이의제기 기능을 개발하고 대량 처리 오류를 개선했습니다. 외주 프로젝트에서는 관리자 기능과 운영 규칙을 정하고 반복되는 코드를 공통 보일러플레이트로 분리했습니다.",
    },
    {
        year: "현재",
        title: "서비스 이관과 AI 개발을 배우다",
        description:
            "Spring Boot 알림 서비스와 Kafka 연동을 구현해 개발 서버에서 동작과 배포를 확인했습니다. 개인 프로젝트로는 FastAPI와 LangGraph를 사용한 야구 직관 안내 챗봇을 개발하고 있습니다.",
    },
];

const toolkitGroups = [
    { title: "Frontend", technologies: "React · Next.js · TypeScript" },
    { title: "Backend & Data", technologies: "Node.js · Go · PostgreSQL · Prisma" },
    { title: "Realtime", technologies: "WebSocket · TanStack Query · Zustand" },
    {
        title: "Service Deployment",
        technologies: "Spring Boot · Kafka · Kubernetes · Helm · ArgoCD",
        context: "서비스 이관 · 개발 서버 배포·검증",
    },
    {
        title: "AI Development",
        technologies: "Python · FastAPI · LangGraph · pgvector",
        context: "개인 프로젝트·학습",
    },
];

function SectionHeading({
    id,
    label,
    title,
    secondary,
    children,
    animated = false,
}: {
    id: string;
    label: string;
    title: string;
    secondary: string;
    children?: ReactNode;
    animated?: boolean;
}) {
    return (
        <div className={styles.headingBlock} data-entrance={animated ? "heading" : undefined}>
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
                    <p className={styles.introduction}>
                        {personalInfoData.introduction.split(/(설계·개발하며)/).map((part) =>
                            part === "설계·개발하며" ? (
                                <span key={part} className={styles.introductionPhrase}>{part}</span>
                            ) : part,
                        )}
                    </p>
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
                <SectionEntrance className={styles.container}>
                    <SectionHeading
                        id="home-capabilities"
                        animated
                        label="Web Developer"
                        title="업무를 이해하고"
                        secondary="작동하는 서비스로 만듭니다."
                    >
                        실시간 상담 플랫폼과 인사평가·채용·콘텐츠 관리 시스템을 개발했습니다.
                        사용자 화면과 API, 데이터 설계부터 운영 중 발생한 문제 해결까지 맡았습니다.
                    </SectionHeading>
                    <ol className={styles.capabilityGrid} data-entrance="cards">
                        {capabilityCards.map((item, index) => (
                            <li key={item.title} className={styles.capabilityCard}>
                                <span className={styles.number}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </SectionEntrance>
            </section>
            <section className={`${styles.section} ${styles.sunken}`} aria-labelledby="home-path">
                <SectionEntrance className={styles.container}>
                    <SectionHeading
                        id="home-path"
                        animated
                        label="걸어온 길"
                        title="고객 서비스와 업무 시스템을"
                        secondary="개발하고 운영해왔습니다."
                    >
                        채용과 콘텐츠 관리, 실시간 상담과 인사평가 등 업무에 필요한 서비스를
                        개발했습니다. 화면과 API, 데이터 구조를 설계하고 운영 중 발생한 문제를
                        개선했습니다. 현재는 Spring Boot 서비스 이관에 참여하고 개인 프로젝트로
                        AI 챗봇을 개발하고 있습니다.
                    </SectionHeading>
                    <ol className={styles.pathGrid} data-entrance="cards">
                        {homeJourney.map((item) => (
                            <li key={item.year} className={styles.pathItem}>
                                <p className={styles.year}>{item.year}</p>
                                <h3>{item.title}</h3>
                                <p className={styles.pathDescription}>{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </SectionEntrance>
            </section>
            <section className={styles.section} aria-labelledby="home-work">
                <SectionEntrance className={styles.container}>
                    <SectionHeading
                        id="home-work"
                        animated
                        label="Work"
                        title="실제로 쓰이는 서비스."
                        secondary="직접 해결한 문제들."
                    >
                        고객 상담 서비스와 사내 업무 도구를 개발했습니다. 프로젝트별로 맡은 역할과
                        구현 방법, 설계한 이유와 운영 중 해결한 문제를 정리했습니다.
                    </SectionHeading>
                    <dl className={styles.outcomes} data-entrance="cards">
                        {careerMetrics.map((metric) => (
                            <div key={metric.label}>
                                <Link
                                    href={metric.href}
                                    className={styles.outcomeLink}
                                >
                                    <dt>{metric.label}</dt>
                                    <dd>{metric.value}</dd>
                                    <dd className={styles.metricCaption}>{metric.caption}</dd>
                                </Link>
                            </div>
                        ))}
                    </dl>
                    <ul className={styles.projectGrid} data-entrance="cards">
                        {projectsData.filter((project) => project.featured).map((project) => (
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
                </SectionEntrance>
            </section>
            <section
                className={`${styles.section} ${styles.sunken}`}
                aria-labelledby="home-toolkit"
            >
                <div className={styles.container}>
                    <SectionHeading
                        id="home-toolkit"
                        label="Toolkit & Learning"
                        title="개발에 사용한 기술과"
                        secondary="새롭게 배우는 것들."
                    >
                        실무에서 사용한 기술과 서비스 이관에 적용한 기술을 정리했습니다.
                        AI 관련 기술은 교육과 개인 프로젝트를 통해 배우고 있습니다.
                    </SectionHeading>
                    <div className={styles.toolkitGrid}>
                        <div>
                            <h3 className={styles.eyebrow}>Toolkit</h3>
                            <dl className={styles.toolkitList}>
                                {toolkitGroups.map((item) => (
                                    <div key={item.title}>
                                        <dt>{item.title}</dt>
                                        <dd>{item.technologies}</dd>
                                        {item.context && (
                                            <dd className={styles.toolkitContext}>{item.context}</dd>
                                        )}
                                    </div>
                                ))}
                            </dl>
                        </div>
                        <div>
                            <h3 className={styles.eyebrow}>Education & Learning</h3>
                            <ul className={styles.education}>
                                <li>
                                    <h4>{personalInfoData.university} · {personalInfoData.degree}</h4>
                                    <p>2016.02–2022.02 · {personalInfoData.gpa}/4.5</p>
                                </li>
                                <li>
                                    <h4>AI Agent 교육과 실습</h4>
                                    <p>
                                        IT 스칼라 교육을 수강하며 RAG 검색과 답변 품질을 평가했습니다.
                                        실패 원인을 분석하고 배운 내용을 기술 블로그에 기록했습니다.
                                    </p>
                                </li>
                                <li>
                                    <h4>KBO Mate · 개인 프로젝트</h4>
                                    <p>
                                        FastAPI와 LangGraph로 경기 일정과 구장·예매 정보를 안내하는
                                        챗봇을 개발하고 있습니다.
                                    </p>
                                    <TextLink
                                        href="https://velog.io/@hongchee/AI-Agent-LangGraph-도입-Tool보다-먼저-정리해야-했던-Context"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.link} ${styles.learningLink}`}
                                    >
                                        개발 기록 보기 <span aria-hidden="true">›</span>
                                    </TextLink>
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
                    <p className={styles.lead}>프로젝트 코드와 개발 과정을 GitHub와 기술 블로그에 기록하고 있습니다.</p>
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
