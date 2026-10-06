import type { Metadata } from "next";
import PageContainer from "@/components/layout/PageContainer";
import Link from "next/link";
import { workCards } from "@/data/work";
import styles from "./work.module.css";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
    absoluteUrl,
    createBreadcrumbJsonLd,
    createCollectionPageJsonLd,
    createImageObjectJsonLd,
    getCanonicalUrl,
    SEO_CONFIG,
} from "@/lib/seo";

const title = "프로젝트";
const description =
    "실시간 상담과 인사평가, 뉴스 CMS, 채용 등 7개 프로젝트에서 맡은 역할과 구현 방법, 해결한 문제를 소개합니다.";
const canonical = getCanonicalUrl("/work");
const image = absoluteUrl(SEO_CONFIG.defaultOgImage.path);

export const metadata: Metadata = {
    title,
    description,
    alternates: { canonical },
    openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        locale: SEO_CONFIG.locale,
        siteName: SEO_CONFIG.siteName,
        images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function WorkPage() {
    return (
        <PageContainer>
            <JsonLdScript
                schemas={[
                    createCollectionPageJsonLd({ url: "/work", name: title, description }),
                    createImageObjectJsonLd({ url: "/work", name: title, description }),
                    createBreadcrumbJsonLd([
                        { name: "홈", path: "/" },
                        { name: title, path: "/work" },
                    ]),
                ]}
            />
            <header className={styles.hero}>
                <p className={styles.eyebrow}>프로젝트</p>
                <h1>업무에 필요한 기능을<span>직접 개발했습니다.</span></h1>
                <p className={styles.intro}>
                    고객 상담 서비스와 사내 업무 도구, 외주 관리자 시스템을 개발했습니다.
                    프로젝트별로 맡은 작업과 적용 규모, 구현 결과와 검증 범위를 정리했습니다.
                </p>
            </header>
            <ul className={styles.grid} aria-label="프로젝트 목록">
                {workCards.map((project) => (
                    <li key={project.slug}>
                        <Link href={`/project/${project.slug}`} className={styles.card}>
                            <p className={styles.category}>{project.category}</p>
                            <h2>{project.title}</h2>
                            <p className={styles.description}>{project.description}</p>
                            <div className={styles.outcome}>
                                <p className={styles.metric}>{project.metric}</p>
                                <p className={styles.caption}>{project.caption}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </PageContainer>
    );
}
