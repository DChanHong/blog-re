"use client";

// 섹션2: 검색 인풋 + 저장된 질문 버튼 목록
// - 저장된 질문 클릭 시 챗봇을 열고, 질문/답변을 메시지로 세팅
// - 직접 입력 시에도 챗봇 열림 + 데모 응답 제공 (API 연동 전)

import React, { useEffect, useMemo, useState } from "react";
import { GlowingInput } from "@/components/ui/glowing-input";
import { Button } from "@/components/ui/Buttons/neon-button";
import { useChatbotStore } from "@/store/chatbotStore";
import type { ChatbotFaqDto } from "@/types/chatbot";
import { useIncrementFaqHitMutation } from "@/actions/chatbot";

interface SavedQuestionItem {
    idx: number;
    id: string;
    savedQuetions: string; // 원본 철자 유지
    savedAnswer: string;
}

interface Section2Props {
    categories: string[];
    faqs: ChatbotFaqDto[]; // 모든 카테고리 FAQ 전체 전달, 섹션 내부에서 필터링
}

export default function Section2({ categories, faqs }: Section2Props) {
    // 전역 챗봇 상태
    const { open, addMessage, setLoading } = useChatbotStore();

    // 카테고리 라벨 맵핑 (DB 키 → 한글 라벨)
    const categoryLabelMap: Record<string, string> = {
        basic: "기본 정보",
        career: "경력/포지션",
        projects: "프로젝트",
        tech_stack: "기술 스택",
    };

    const [activeCategory, setActiveCategory] = useState<string | undefined>(categories?.[0]);
    const incHit = useIncrementFaqHitMutation();

    useEffect(() => {
        // 카테고리 목록이 갱신되면 기본 선택값 갱신
        if (categories && categories.length > 0) {
            setActiveCategory((prev) => prev || categories[0]);
        }
    }, [categories]);

    const questionList: SavedQuestionItem[] = useMemo(() => {
        const filtered = activeCategory
            ? faqs.filter((f) => (f.category || "") === activeCategory)
            : faqs;
        return filtered
            .sort((a, b) => {
                const sa = a.sorting ?? 0;
                const sb = b.sorting ?? 0;
                if (sa !== sb) return sa - sb;
                return (a.created_at || "").localeCompare(b.created_at || "");
            })
            .map((f, idx) => ({ idx, id: f.id, savedQuetions: f.question, savedAnswer: f.answer }));
    }, [faqs, activeCategory]);

    // 저장된 질문 실행: 질문/답변 메시지 푸시 후 챗봇 열기
    const handleSaved = async (savedQuetions: string, savedAnswer: string, faqId?: string) => {
        if (faqId) {
            try {
                incHit.mutate(faqId);
            } catch {}
        }
        open();
        addMessage({ isAnswer: false, message: savedQuetions });
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        addMessage({ isAnswer: true, message: savedAnswer });
        setLoading(false);
    };

    return (
        <section className={` w-full max-w-[1800px] m-auto flex justify-center mt-[40px] mb-20`}>
            <div className={`w-11/12 md:w-11/12 lg2:w-11/12 3xl:w-10/12 6xl:w-11/12 p-4`}>
                <div className={"text-center text-[28px] md:text-[34px] font-bold"}>
                    {`'성찬홍'에 대해 무엇이든 물어보세요.`}
                </div>

                {/* 카테고리 탭 */}
                <div className={"flex flex-wrap justify-center gap-2 my-4"}>
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            className={`cursor-pointer transition-all ${
                                activeCategory === cat
                                    ? "border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    : "text-gray-400 hover:text-white"
                            }`}
                            variant="default"
                            size="default"
                            onClick={() => setActiveCategory(cat)}
                        >
                            {categoryLabelMap[cat] || cat}
                        </Button>
                    ))}
                </div>

                {/* 저장된 질문 버튼들 */}
                <div className={"flex flex-wrap justify-center gap-2 my-6"}>
                    {questionList.map((item) => (
                        <Button
                            key={item.idx}
                            className="cursor-pointer font-semibold text-gray-300 hover:text-white border-white/30 hover:border-white/50"
                            variant="ghost"
                            size="default"
                            onClick={() =>
                                handleSaved(item.savedQuetions, item.savedAnswer, item.id)
                            }
                        >
                            {item.savedQuetions}
                        </Button>
                    ))}
                </div>

                {/* 검색 인풋 */}
                <GlowingInput
                    placeholder="찬홍님에 대해 궁금한 점을 입력해보세요."
                    onSubmit={(value) => {
                        open();
                        addMessage({ isAnswer: false, message: value });
                        setLoading(true);
                        setTimeout(() => {
                            addMessage({ isAnswer: true, message: `답변: ${value}` });
                            setLoading(false);
                        }, 600);
                    }}
                />
            </div>
        </section>
    );
}
