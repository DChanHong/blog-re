import { Suspense } from "react";
import ClientPage from "./ClientPage";
// import { getFaqCategories, getFaqList } from "@/lib/services/chatbotService";
// import { getRecentPosts } from "@/lib/services/velogService";
import FaqContainer from "@/components/home/FaqContainer";
import BlogContainer from "@/components/home/BlogContainer";
import FaqSkeleton from "@/components/skeletons/FaqSkeleton";
import BlogSkeleton from "@/components/skeletons/BlogSkeleton";

// ISR 1일 (86400초)
export const revalidate = 86400;

export default function Home() {
    return (
        <ClientPage
            section2Slot={
                <Suspense fallback={<FaqSkeleton />}>
                    <FaqContainer />
                </Suspense>
            }
            section3Slot={
                <Suspense fallback={<BlogSkeleton />}>
                    <BlogContainer />
                </Suspense>
            }
        />
    );
}
