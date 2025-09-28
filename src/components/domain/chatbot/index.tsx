"use client";

// 우측 하단 챗봇 버튼 + 하단에서 슬라이드업 되는 채팅창

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useChatbotStore } from "@/store/chatbotStore";
import { askChatbotApi } from "@/fetchers/chatbot";
import { useChatbotFaqsQuery } from "@/actions/chatbot";
import type { ChatHistoryMessage, ChatbotFaqDto } from "@/types/chatbot";

import ChatButton from "./ChatButtont";
import ChatBox from "./ChatBox";

export default function ChatBot() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
        isOpen,
        toggle,
        close,
        messages,
        addMessage,
        isLoading,
        setLoading,
        threadId,
        setThreadId,
    } = useChatbotStore();

    // localStorage에서 threadId 복원
    useEffect(() => {
        try {
            const saved = localStorage.getItem("chatbot_thread_id");
            if (saved) setThreadId(saved);
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 모달 열림/닫힘 시 페이지 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            // 모달이 열릴 때 body 스크롤 방지
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "0px"; // 스크롤바 숨김으로 인한 여백 방지
        } else {
            // 모달이 닫힐 때 body 스크롤 복원
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "unset";
        }

        // cleanup 함수로 컴포넌트 언마운트 시 스크롤 복원
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "unset";
        };
    }, [isOpen]);

    // FAQ 쿼리 (전체 FAQ 데이터를 가져옴)
    const { data: faqsRes, isLoading: isFaqLoading } = useChatbotFaqsQuery(undefined, {
        enabled: isOpen, // 챗봇이 열릴 때만 쿼리 실행
    });

    // 드래그 상태 추적 (모달 닫기 방지용)
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // 특정 카테고리만 필터링하고 랜덤 정렬 (중복 제거)
    const filteredFaqList = useMemo(() => {
        if (!faqsRes?.result?.success || !Array.isArray(faqsRes.data)) {
            return [];
        }

        // "projects", "career", "tech_stack" 카테고리만 필터링
        const allowedCategories = ["projects", "career", "tech_stack"];
        const filtered = faqsRes.data.filter(
            (faq) => faq.category && allowedCategories.includes(faq.category),
        );

        // 질문 내용 기준으로 중복 제거
        const seenQuestions = new Set<string>();
        const uniqueFiltered = filtered.filter((faq) => {
            if (seenQuestions.has(faq.question)) {
                return false;
            }
            seenQuestions.add(faq.question);
            return true;
        });

        // 랜덤 정렬 (Fisher-Yates shuffle 알고리즘)
        const shuffled = [...uniqueFiltered];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    }, [faqsRes]);

    // 공통 질문 실행 로직 (인풋/추천 버튼 공용)
    const performAsk = async (question: string) => {
        if (!question) return;

        // 질문 push
        addMessage({ isAnswer: false, message: question });
        setLoading(true);

        // 히스토리 구성 (최근 몇 개만)
        const history: ChatHistoryMessage[] = messages.slice(-10).map((m) => ({
            role: m.isAnswer ? "assistant" : "user",
            content: m.message,
        }));

        try {
            const resp = await askChatbotApi({
                question,
                threadId: threadId || undefined,
                history,
            });
            addMessage({ isAnswer: true, message: resp.answer });
            if (resp.threadId && resp.threadId !== threadId) {
                setThreadId(resp.threadId);
                try {
                    localStorage.setItem("chatbot_thread_id", resp.threadId);
                } catch {}
            }
        } catch (e: any) {
            addMessage({ isAnswer: true, message: e?.message || "오류가 발생했습니다." });
        }
        setLoading(false);
    };

    const handleAsk = async () => {
        if (!inputRef.current) return;
        const question = inputRef.current.value.trim();
        if (!question) return;
        await performAsk(question);
        inputRef.current.value = "";
    };

    const handlePresetClick = async (question: string, answer?: string) => {
        // FAQ의 답변이 있다면 직접 보여주기
        if (answer) {
            addMessage({ isAnswer: false, message: question });
            setLoading(true);
            await new Promise((r) => setTimeout(r, 300));
            addMessage({ isAnswer: true, message: answer });
            setLoading(false);
        } else {
            // 답변이 없다면 기존 방식으로 AI 호출
            await performAsk(question);
        }
    };

    const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = async (e) => {
        if (e.key === "Enter") {
            await handleAsk();
        }
    };

    return (
        <>
            {/* 플로팅 버튼 */}
            <ChatButton onClick={toggle} isOpen={isOpen} />

            {/* 오버레이 + 패널 (모달처럼, 열릴 때만 렌더) */}
            <ChatBox
                isOpen={isOpen}
                isDragging={isDragging}
                faqList={filteredFaqList}
                isFaqLoading={isFaqLoading}
                onPresetClick={handlePresetClick}
                messages={messages}
                isLoading={isLoading}
                inputRef={inputRef}
                onKeyUp={handleKeyUp}
                onAsk={handleAsk}
                onClose={close}
            />
        </>
    );
}
