import styles from "./writing.module.css";

export default function WritingSkeleton() {
    return (
        <div role="status" aria-label="글을 불러오는 중" className={styles.skeleton}>
            {Array.from({ length: 9 }, (_, index) => (
                <div key={index} className={styles.skeletonRow} aria-hidden="true">
                    <span />
                    <span />
                </div>
            ))}
        </div>
    );
}
