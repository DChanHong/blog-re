import { getFaqCategories, getFaqList } from "@/lib/services/chatbotService";
import type { ChatbotFaqDto } from "@/types/chatbot";
import Section2 from "@/components/domain/home/Section2";

export default async function FaqContainer() {
    // 인고의 시간...
    const [categories, faqRows] = await Promise.all([
        getFaqCategories(),
        getFaqList(),
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

    return <Section2 categories={categories} faqs={faqs} />;
}
