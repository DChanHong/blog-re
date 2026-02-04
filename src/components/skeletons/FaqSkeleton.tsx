export default function FaqSkeleton() {
    return (
        <section className="w-full max-w-[1800px] m-auto flex justify-center mt-[40px] mb-20">
            <div className="w-11/12 md:w-11/12 lg2:w-11/12 3xl:w-10/12 6xl:w-11/12 p-4">
                {/* Title Skeleton */}
                <div className="flex justify-center mb-8">
                    <div className="h-8 md:h-10 w-64 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Categories Skeleton */}
                <div className="flex flex-wrap justify-center gap-2 my-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-20 bg-gray-200 rounded-[14px] animate-pulse" />
                    ))}
                </div>

                {/* Questions Skeleton */}
                <div className="flex flex-wrap justify-center gap-2 my-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 w-32 bg-gray-200 rounded-[20px] animate-pulse" />
                    ))}
                </div>

                {/* Search Input Skeleton */}
                <div className="flex justify-center items-center">
                    <div className="w-full md:w-[780px] lg:w-[1000px] h-[60px] bg-gray-200 rounded-xl animate-pulse" />
                </div>
            </div>
        </section>
    );
}
