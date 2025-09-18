import Section1 from "@/components/domain/home/Section1";
import Section2 from "@/components/domain/home/Section2";
import Section3 from "@/components/domain/home/Section3";
import { fetchRecentPosts } from "@/fetchers/velog";

// ISR 1일 (86400초)
export const revalidate = 86400;

export default async function Home() {
    const recentRes = await fetchRecentPosts(12);
    const recentPosts = recentRes.result.success && recentRes.data ? recentRes.data : [];
    return (
        <div className=" borderfont-sans grid grid-rows-[auto_auto_auto] items-center justify-items-center min-h-screen p-0 pb-20 gap-16 sm:p-0">
            <Section1 />
            <Section2 />
            <Section3 blogList={recentPosts} />
        </div>
    );
}
