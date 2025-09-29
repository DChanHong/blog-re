"use client";

import Section1 from "@/components/domain/home/Section1";
import Section2 from "@/components/domain/home/Section2";
import Section3 from "@/components/domain/home/Section3";
import type { ChatbotFaqDto } from "@/types/chatbot";
import type { VelogPostDto } from "@/types/blog";

interface ClientPageProps {
    categories: string[];
    faqs: ChatbotFaqDto[];
    recentPosts: VelogPostDto[];
}

export default function ClientPage({ categories, faqs, recentPosts }: ClientPageProps) {
    return (
        <div className=" borderfont-sans grid grid-rows-[auto_auto_auto] items-center justify-items-center min-h-screen p-0 pb-20 gap-16 sm:p-0">
            <Section1 />
            <Section2 categories={categories} faqs={faqs} />
            <Section3 blogList={recentPosts} />
        </div>
    );
}
