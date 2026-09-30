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
        title: "사용자 흐름을 구현합니다",
        description:
            "사용자가 기능을 끝까지 이용할 수 있도록 화면을 만듭니다. 입력 보존과 검증, 실시간 상태 반영, 실패 시 안내까지 사용 과정의 세부 동작을 챙깁니다.",
    },
    {
        title: "화면과 데이터를 연결합니다",
        description:
            "화면에 필요한 API와 데이터 구조를 함께 설계하고 구현합니다. 사용자 기능부터 관리자 도구까지, 조회와 저장이 이어지는 서비스 흐름을 만듭니다.",
    },
    {
        title: "변경하기 쉬운 구조를 만듭니다",
        description:
            "여러 서비스에서 사용하는 기능을 공통화하고, 자주 바뀌는 운영 설정을 코드와 분리합니다. 기능을 추가하고 수정할 때 반복되는 작업을 줄입니다.",
    },
    {
        title: "운영하며 안정성을 높입니다",
        description:
            "실제 사용 중 발생한 문제를 재현하고 원인을 찾아 개선합니다. 연결 복구와 데이터 재조회, 대량 처리와 외부 연동의 실패 대응을 다룹니다.",
    },
];

const homeJourney = [
    {
        year: "2023",
        title: "화면에서 서비스로",
        description:
            "React·Next.js로 웹 개발을 시작했습니다. 채용사이트와 법률 서비스에서 사용자·관리자 화면뿐 아니라 API와 데이터 처리까지 맡으며, 하나의 기능이 완성되는 과정을 경험했습니다.",
    },
    {
        year: "2024–2025",
        title: "데이터부터 직접 설계하다",
        description:
            "뉴스 CMS의 PostgreSQL 구조를 설계하고 관리자 화면과 API를 함께 개발했습니다. 화면에 필요한 정보를 넘어, 콘텐츠의 관계와 검색·운영 방식까지 설계 범위를 넓혔습니다.",
    },
    {
        year: "2025–현재",
        title: "실시간 서비스의 운영을 맡다",
        description:
            "약 80개 홈페이지의 상담 위젯과 관리자 콘솔을 개발했습니다. 연결 복구와 상태 동기화를 개선하고, 기존 Go 백엔드의 API와 파일 처리 기능까지 개발 범위를 확장했습니다.",
    },
    {
        year: "2026",
        title: "기능 전체를 완성하다",
        description:
            "인사평가 업무를 화면·API·DB로 구현하고 대량 처리 문제를 개선했습니다. 외주 관리자 기능과 운영 규칙을 직접 구체화하고, 반복되는 개발 구조를 공통 보일러플레이트로 정리했습니다.",
    },
    {
        year: "현재",
        title: "백엔드와 AI로 더 넓게",
        description:
            "Spring Boot 알림 서비스와 Kafka 연동을 구현하고 개발 서버에서 배포·검증했습니다. 개인 프로젝트에서는 FastAPI와 LangGraph로 AI 서비스를 개발하며 웹과 AI를 연결하고 있습니다.",
    },
];

const toolkitGroups = [
    { title: "Frontend", technologies: "React · Next.js · TypeScript" },
    { title: "Backend & Data", technologies: "Node.js · Go · PostgreSQL · Prisma" },
    { title: "Realtime", technologies: "WebSocket · TanStack Query · Zustand" },
    {
        title: "Service Deployment",
        technologies: "Spring Boot · Kafka · Kubernetes · Helm · ArgoCD",
        context: "서비스 이관·개발 서버 배포 경험",
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
                <SectionEntrance className={styles.container}>
                    <SectionHeading
                        id="home-capabilities"
                        animated
                        label="Web Developer"
                        title="업무를 이해하고."
                        secondary="작동하는 서비스로 만듭니다."
                    >
                        실제로 사용하는 사람의 이야기를 듣고, 필요한 기능을 구체화합니다. 화면과
                        API, 데이터를 함께 설계하고 구현하며, 배포 이후의 불편과 오류까지 개선합니다.
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
                        title="프론트엔드에서 시작해."
                        secondary="서비스 전체를 만드는 개발자로."
                    >
                        사용자 화면을 만드는 일에서 출발해, API와 데이터 설계, 백엔드 개발과 운영까지
                        역할을 넓혀왔습니다. 필요한 기능을 직접 완성하고 운영의 문제를 해결하며,
                        서비스 전반을 연결하는 풀스택 개발 역량을 쌓아왔습니다. 이제는 그 경험에
                        AI를 더해 만들 수 있는 서비스의 범위를 확장하고 있습니다.
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
                        고객이 사용하는 서비스부터 내부 업무 도구까지, 화면과 API, 데이터를 연결해
                        개발했습니다. 각 프로젝트에 직접 맡은 역할과 설계 판단, 운영 과정에서 해결한
                        문제를 담았습니다.
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
                        title="서비스를 만드는 기술."
                        secondary="가능성을 넓히는 배움."
                    >
                        화면과 서버, 데이터를 연결하며 필요한 기술을 익혀왔습니다. 실무에서 쌓은 웹
                        개발 경험을 바탕으로, 백엔드와 AI 서비스 개발까지 깊이를 더하고 있습니다.
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
                                        IT 스칼라 교육 수강. RAG 검색과 답변 품질을 평가하고, 실패
                                        원인을 분석하며 학습 내용을 기록했습니다.
                                    </p>
                                </li>
                                <li>
                                    <h4>KBO Mate · 개인 프로젝트</h4>
                                    <p>
                                        FastAPI와 LangGraph 기반으로 야구 직관 정보를 안내하는 AI
                                        서비스를 개발하고 있습니다.
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
