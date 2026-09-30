import { WritingPreviewFrame } from "@/components/domain/home/Section3";
import styles from "@/components/domain/home/home-reference.module.css";

export default function BlogSkeleton() {
    return (
        <WritingPreviewFrame animated={false}>
            <div
                role="status"
                aria-label="최근 글을 불러오는 중"
                aria-busy="true"
                className={styles.articleList}
            >
                {[0, 1].map((index) => (
                    <div key={index} className={styles.skeletonRow} aria-hidden="true">
                        <span />
                        <span />
                    </div>
                ))}
            </div>
        </WritingPreviewFrame>
    );
}
