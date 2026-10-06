import Link from "next/link";
import { personalInfoData } from "@/data/careerData";
import { projectsData } from "@/data/projects";
import { resumeExperiences, resumeSummary, resumeTools } from "@/data/resume";
import styles from "./resume.module.css";

export default function ResumePage() {
    return (
        <div className={styles.resume}>
            <header className={styles.hero}>
                <div>
                    <p className={styles.eyebrow}>이력서</p>
                    <h1>경력 및 역량</h1>
                </div>
                <a className={styles.contact} href={`mailto:${personalInfoData.email}`}>
                    연락하기
                </a>
            </header>
            <article className={styles.document} aria-label="성찬홍 이력서">
                <header className={styles.identity}>
                    <h2>
                        {personalInfoData.name} <span>· 웹 개발자</span>
                    </h2>
                    <a href={`mailto:${personalInfoData.email}`}>{personalInfoData.email}</a>
                    <div className={styles.links}>
                        <a href={personalInfoData.github} target="_blank" rel="noopener noreferrer">
                            GitHub<span className="sr-only"> (새 탭)</span>
                        </a>
                        <a href={personalInfoData.blog} target="_blank" rel="noopener noreferrer">
                            기술 블로그<span className="sr-only"> (새 탭)</span>
                        </a>
                    </div>
                </header>
                <section id="overview" className={styles.section} aria-labelledby="resume-summary">
                    <h2 id="resume-summary">소개</h2>
                    <p>{resumeSummary}</p>
                </section>
                <section
                    id="experience"
                    className={styles.section}
                    aria-labelledby="resume-experience"
                >
                    <h2 id="resume-experience">경력</h2>
                    <div className={styles.company}>
                        <div className={styles.entryHeading}>
                            <h3>스카이즈코리아 · 개발팀</h3>
                            <p className={styles.period}>{personalInfoData.period}</p>
                        </div>
                        <p>웹 개발 · 정규직</p>
                        <p className={styles.note}>
                            법무법인 대륜 IT 조직에서 분리된 법인 · 고객 서비스 및 내부 업무 시스템
                            개발·운영
                        </p>
                    </div>
                    <div id="projects">
                        {resumeExperiences.map((entry) => (
                            <section
                                id={entry.id}
                                key={entry.id}
                                className={styles.entry}
                                aria-labelledby={`title-${entry.id}`}
                            >
                                <div className={styles.entryHeading}>
                                    <h3 id={`title-${entry.id}`}>{entry.title}</h3>
                                    <p className={styles.period}>{entry.period}</p>
                                </div>
                                <ul>
                                    {entry.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                    <div className={styles.projectLinks}>
                        <p>프로젝트 상세 보기</p>
                        <ul>
                            {projectsData.map((project) => (
                                <li
                                    key={project.id}
                                    id={
                                        resumeExperiences.some((entry) => entry.id === project.id)
                                            ? undefined
                                            : project.id
                                    }
                                >
                                    <Link href={`/project/${project.id}`}>{project.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <section className={styles.section} aria-labelledby="resume-personal">
                    <h2 id="resume-personal">개인 프로젝트</h2>
                    <div className={styles.entryHeading}>
                        <h3>KBO Mate — 야구 직관 안내 AI 챗봇</h3>
                        <p className={styles.period}>개인 학습 프로젝트 · 개발 중</p>
                    </div>
                    <ul>
                        <li>
                            FastAPI, LangGraph, PostgreSQL/pgvector, Next.js를 사용해 야구 직관 안내
                            챗봇을 개발하고 있습니다. 경기 일정 같은 정형 데이터는 조회하고
                            구장·예매·규칙 안내는 문서에서 검색하도록 처리 방식을 나눴습니다.
                        </li>
                        <li>
                            후속 질문에도 답할 수 있도록 앞선 대화의 경기 정보를 유지합니다. 데이터가
                            없거나 검색 결과와 답변 근거가 부족한 사례를 기록해 평가 질문과 검색
                            조건을 개선하고 있습니다.
                        </li>
                    </ul>
                </section>
                <section
                    id="capabilities"
                    className={styles.section}
                    aria-labelledby="resume-tools"
                >
                    <h2 id="resume-tools">기술 및 도구</h2>
                    <dl className={styles.tools}>
                        {resumeTools.map((group) => (
                            <div key={group.label}>
                                <dt>{group.label}</dt>
                                <dd>{group.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
                <section
                    id="education"
                    className={styles.section}
                    aria-labelledby="resume-education"
                >
                    <h2 id="resume-education">교육 및 학력</h2>
                    <div className={styles.educationEntry}>
                        <h3>IT 스칼라 · AI Agent 교육 수강</h3>
                        <p>교육에서 배운 AI 이론과 실습 내용, 개인 프로젝트 개발 과정을 기술 블로그에 기록하고 있습니다.</p>
                    </div>
                    <div className={styles.educationEntry}>
                        <div className={styles.entryHeading}>
                            <h3>{personalInfoData.university}</h3>
                            <p className={styles.period}>2016.02 ~ 2022.02</p>
                        </div>
                        <p>{personalInfoData.degree} · 학점 3.9 / 4.5</p>
                    </div>
                </section>
            </article>
        </div>
    );
}
