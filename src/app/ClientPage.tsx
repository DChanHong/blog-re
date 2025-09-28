"use client";

import Section1 from "@/components/domain/home/Section1";
import Section2 from "@/components/domain/home/Section2";
import Section3 from "@/components/domain/home/Section3";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentPosts } from "@/fetchers/velog";
import { fetchChatbotCategories, fetchChatbotFaqs } from "@/fetchers/chatbot";

export default function ClientPage() {
    const { data } = useQuery({
        queryKey: ["velog", "recent", 12],
        queryFn: () => fetchRecentPosts(12),
        staleTime: 60_000,
    });
    const recentPosts = data?.result.success && data.data ? data.data : [];

    const { data: catRes } = useQuery({
        queryKey: ["chatbot", "categories"],
        queryFn: () => fetchChatbotCategories(),
        staleTime: 5 * 60_000,
    });
    const categories = catRes?.result.success && catRes.data ? catRes.data : [];

    const { data: faqsRes } = useQuery({
        queryKey: ["chatbot", "faqs", "all"],
        queryFn: () => fetchChatbotFaqs(undefined),
        staleTime: 60_000,
    });
    const faqs = faqsRes?.result.success && faqsRes.data ? faqsRes.data : [];
    return (
        <div className=" borderfont-sans grid grid-rows-[auto_auto_auto] items-center justify-items-center min-h-screen p-0 pb-20 gap-16 sm:p-0">
            <Section1 />
            <Section2 categories={categories} faqs={faqs} />
            <Section3 blogList={recentPosts} />
        </div>
    );
}
