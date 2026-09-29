export default function PostCardSkeleton() {
    return (
        <div className="block bg-muted backdrop-blur-md rounded-2xl border border-border overflow-hidden animate-pulse">
            {/* 썸네일 */}
            <div className="aspect-video bg-muted" />

            {/* 콘텐츠 */}
            <div className="p-6">
                {/* 카테고리 & 날짜 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-4 w-20 bg-muted rounded" />
                </div>

                {/* 제목 */}
                <div className="space-y-2 mb-3">
                    <div className="h-5 w-full bg-muted rounded" />
                    <div className="h-5 w-4/5 bg-muted rounded" />
                </div>

                {/* 요약 */}
                <div className="space-y-2 mb-5">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/5 bg-muted rounded" />
                </div>

                {/* 태그 */}
                <div className="flex gap-2">
                    <div className="h-5 w-14 bg-muted rounded" />
                    <div className="h-5 w-16 bg-muted rounded" />
                    <div className="h-5 w-12 bg-muted rounded" />
                </div>
            </div>
        </div>
    );
}
