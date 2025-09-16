"use client";

// 섹션2: 검색 인풋 + 저장된 질문 버튼 목록
// - 저장된 질문 클릭 시 챗봇을 열고, 질문/답변을 메시지로 세팅
// - 직접 입력 시에도 챗봇 열림 + 데모 응답 제공 (API 연동 전)

import React, { useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { useChatbotStore } from "@/store/chatbotStore";

interface SavedQuestionItem {
    idx: number;
    savedQuetions: string; // 원본 철자 유지
    savedAnswer: string;
}

export default function Section2() {
    // 전역 챗봇 상태
    const { open, addMessage, setLoading } = useChatbotStore();
    const inputRef = useRef<HTMLInputElement | null>(null);

    // 데모용 저장된 질문 목록 (추후 DB 연동 예정)
    const questionList: SavedQuestionItem[] = [
        {
            idx: 1,
            savedQuetions: "이력이 궁금해요",
            savedAnswer: "찬홍님은 현재 Frontend 개발자로 부산에서 재직중입니다.",
        },
        {
            idx: 2,
            savedQuetions: "사용 스킬이 궁금해요",
            savedAnswer: "React , NextJs , node , mysql 등의 스킬을 가지고 있습니다.",
        },
        { idx: 3, savedQuetions: "누구인가요", savedAnswer: "27살 남자입니다." },
        {
            idx: 4,
            savedQuetions: "관심사가 궁금해요",
            savedAnswer: "개발 공부,넷플릭스 보기,어떻게 살아갈까에 대한 고민을 많이 합니다.",
        },
    ];

    // 저장된 질문 실행: 질문/답변 메시지 푸시 후 챗봇 열기
    const handleSaved = async (savedQuetions: string, savedAnswer: string) => {
        open();
        addMessage({ isAnswer: false, message: savedQuetions });
        setLoading(true);
        await new Promise((r) => setTimeout(r, 300));
        addMessage({ isAnswer: true, message: savedAnswer });
        setLoading(false);
    };

    // 직접 질문하기
    const handleAsk = async () => {
        if (!inputRef.current) return;
        const question = inputRef.current.value.trim();
        if (!question) return;

        open();
        addMessage({ isAnswer: false, message: question });
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        // API 연동 전 데모 응답
        addMessage({ isAnswer: true, message: `답변: ${question}` });
        setLoading(false);
        inputRef.current.value = "";
    };

    const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = async (e) => {
        if (e.key === "Enter") {
            await handleAsk();
        }
    };

    return (
        <section className={`w-full max-w-[1800px] m-auto flex justify-center mt-[40px] mb-20`}>
            <div className={`w-11/12 md:w-11/12 lg2:w-11/12 3xl:w-10/12 6xl:w-11/12 p-4`}>
                <div className={"text-center text-[28px] md:text-[34px] font-bold"}>
                    Ask a question about chanhong's information
                </div>

                {/* 저장된 질문 버튼들 */}
                <div className={"flex flex-wrap justify-center gap-2 my-8"}>
                    {questionList.map((item) => (
                        <button
                            key={item.idx}
                            className="px-4 py-2 rounded-[20px] font-semibold bg-gray-100 hover:bg-[#0A0044] hover:text-slate-200 transition-colors duration-300"
                            type="button"
                            onClick={() => handleSaved(item.savedQuetions, item.savedAnswer)}
                        >
                            {item.savedQuetions}
                        </button>
                    ))}
                </div>

                {/* 검색 인풋 */}
                <div className={"flex justify-center items-center"}>
                    <div
                        className={
                            "w-full md:w-[780px] lg:w-[1000px] flex border-2 mt-4 outline-[1px] focus-within:border-[#0A0044] rounded-xl overflow-hidden"
                        }
                    >
                        <input
                            type="text"
                            placeholder="찬홍님에 대해 궁금한 점을 입력해보세요."
                            className={
                                "w-full p-4 text-[16px] md:text-[18px] lg:text-[20px] outline-none"
                            }
                            onKeyUp={handleKeyUp}
                            ref={inputRef}
                        />
                        <button
                            onClick={handleAsk}
                            type={`button`}
                            className={`w-[54px] grid place-items-center`}
                        >
                            <CiSearch size={28} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
