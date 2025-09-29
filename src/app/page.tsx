import ClientPage from "./ClientPage";
import { getFaqCategories, getFaqList } from "@/lib/services/chatbotService";
import { getRecentPosts } from "@/lib/services/velogService";
import type { ChatbotFaqDto } from "@/types/chatbot";
import type { VelogPostDto } from "@/types/blog";

// ISR 1일 (86400초)
export const revalidate = 86400;

export default async function Home() {
    // 서버에서 데이터 패칭 (ISR)
    const [categories, faqRows, recentRows] = await Promise.all([
        getFaqCategories(),
        getFaqList(),
        getRecentPosts(12),
    ]);

    // DTO 매핑: FAQ
    const faqs: ChatbotFaqDto[] = (faqRows || []).map((r: any) => ({
        id: r.id,
        question: r.question,
        answer: r.answer,
        category: r.category ?? null,
        sorting: typeof r.sorting === "number" ? r.sorting : null,
        hit: typeof r.hit === "number" ? r.hit : null,
        created_at:
            typeof r.created_at === "string"
                ? r.created_at
                : r.created_at
                  ? new Date(r.created_at).toISOString()
                  : undefined,
    }));

    // DTO 매핑: 최근 블로그 포스트
    const recentPosts: VelogPostDto[] = (recentRows || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        img_src: row.img_src,
        created_at:
            typeof row.created_at === "string"
                ? row.created_at
                : row.created_at
                  ? new Date(row.created_at).toISOString()
                  : "",
        tags: Array.isArray(row.tags) ? row.tags : [],
        detail_link: row.detail_link,
        intro: row.intro,
        inserted_at:
            typeof row.inserted_at === "string"
                ? row.inserted_at
                : row.inserted_at
                  ? new Date(row.inserted_at).toISOString()
                  : undefined,
    }));

    return <ClientPage categories={categories} faqs={faqs} recentPosts={recentPosts} />;
}
