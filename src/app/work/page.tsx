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
    "실시간 상담 플랫폼, 뉴스 CMS, ERP와 법률 플랫폼에서의 담당 역할과 문제 해결 경험을 소개합니다.";
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
                <h1>업무를 이해하고,<span>서비스로 연결합니다.</span></h1>
                <p className={styles.intro}>
                    화면부터 API, 데이터와 운영까지 직접 연결한 작업입니다.
                    각 카드에는 적용 규모나 구현 결과, 검증 범위를 대표하는 지표를 담았습니다.
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
