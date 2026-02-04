export default function BlogSkeleton() {
    return (
        <div className="w-full m-auto max-w-[1800px] flex justify-center mt-[20px] mb-20">
            <div className="w-[95%]">
                {/* Title Skeleton */}
                <div className="mb-8">
                    <div className="h-8 md:h-12 w-48 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-[4/3] rounded-xl bg-gray-200 animate-pulse" />
                    ))}
                </div>

                {/* More Button Skeleton */}
                <div className="flex justify-center mt-8">
                    <div className="h-14 w-40 bg-gray-200 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    );
}
