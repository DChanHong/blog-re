import Link from "next/link";
import type { ReactNode } from "react";
import TextLink from "@/components/ui/TextLink";
import type { VelogPostDto } from "@/types/blog";
import SectionEntrance from "../SectionEntrance";
import styles from "../home-reference.module.css";

export function WritingPreviewFrame({
    children,
    animated = true,
}: {
    children: ReactNode;
    animated?: boolean;
}) {
    const Container = animated ? SectionEntrance : "div";
    return (
        <section className={`${styles.section} ${styles.writing}`} aria-labelledby="home-writing">
            <Container className={styles.container}>
                <div className={styles.writingHeading} data-entrance="heading">
                    <p className={styles.eyebrow}>최근 글</p>
                    <h2 id="home-writing" className={styles.heading}>
                        새롭게 배우고.
                        <br />
                        <span>배움의 과정을 기록합니다.</span>
                    </h2>
                </div>
                {children}
                <div className={styles.more} data-entrance="heading">
                    <TextLink href="/writing" className={styles.link}>
                        전체 글 보기 <span aria-hidden="true">›</span>
                    </TextLink>
                </div>
            </Container>
        </section>
    );
}

export default function Section3({
    blogList,
    failed = false,
}: {
    blogList: VelogPostDto[];
    failed?: boolean;
}) {
    return (
        <WritingPreviewFrame>
            {failed ? (
                <p role="status" className={styles.writingState}>
                    최근 글을 불러오지 못했습니다. 전체 글 목록에서 다시 확인해 주세요.
                </p>
            ) : blogList.length === 0 ? (
                <p className={styles.writingState}>아직 공개된 글이 없습니다.</p>
            ) : (
                <ul className={styles.articleList} data-entrance="rows">
                    {blogList.slice(0, 2).map((post) => {
                        const sourceHref =
                            post.source_url ||
                            (post.detail_link?.startsWith("http")
                                ? post.detail_link
                                : `https://velog.io${post.detail_link?.startsWith("/") ? "" : "/"}${post.detail_link}`);
                        const href = post.slug
                            ? `/blog/${encodeURIComponent(post.slug)}`
                            : sourceHref;
                        const internal = href.startsWith("/blog/");
                        return (
                            <li key={post.id ?? post.detail_link}>
                                <Link
                                    href={href}
                                    className={styles.articleRow}
                                    target={internal ? undefined : "_blank"}
                                    rel={internal ? undefined : "noopener noreferrer"}
                                >
                                    <div>
                                        <h3>{post.title}</h3>
                                        {post.intro && <p>{post.intro}</p>}
                                    </div>
                                    <span className={styles.articleMeta}>
                                        {post.tags?.[0]} <span aria-hidden="true">↗</span>
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </WritingPreviewFrame>
    );
}
