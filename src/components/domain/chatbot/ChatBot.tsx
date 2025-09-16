"use client";

// 우측 하단 챗봇 버튼 + 하단에서 슬라이드업 되는 채팅창

import React, { useRef } from "react";
import { useChatbotStore } from "@/store/chatbotStore";
import { IoIosClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";

export default function ChatBot() {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { isOpen, toggle, close, messages, addMessage, isLoading, setLoading } =
        useChatbotStore();

    const handleAsk = async () => {
        if (!inputRef.current) return;
        const question = inputRef.current.value.trim();
        if (!question) return;

        // 질문 push
        addMessage({ isAnswer: false, message: question });
        setLoading(true);

        // TODO: 여기에 실제 API 연동 로직을 연결
        // 데모용 딜레이 + 에코 응답
        await new Promise((r) => setTimeout(r, 600));
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
        <>
            {/* 플로팅 버튼 */}
            <div className={`fixed z-50 right-[3%] bottom-[140px]`}>
                {!isOpen && (
                    <button
                        aria-label="Open chatbot"
                        onClick={toggle}
                        type={`button`}
                        className={`relative hover:scale-125 transition-all cursor-pointer rounded-[10px] p-2`}
                    >
                        {/* 3겹 블루 펄스 */}
                        <span
                            style={{
                                position: "absolute",
                                inset: "0",
                                border: "2px solid rgba(59, 130, 246, 0.7)",
                                borderRadius: "10px",
                                pointerEvents: "none",
                                animation: "pulseBox 2.8s infinite ease-out",
                                animationDelay: "0s",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                inset: "0",
                                border: "2px solid rgba(59, 130, 246, 0.45)",
                                borderRadius: "10px",
                                pointerEvents: "none",
                                animation: "pulseBox 2.8s infinite ease-out",
                                animationDelay: "0.6s",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                inset: "0",
                                border: "2px solid rgba(59, 130, 246, 0.28)",
                                borderRadius: "10px",
                                pointerEvents: "none",
                                animation: "pulseBox 2.8s infinite ease-out",
                                animationDelay: "1.2s",
                            }}
                        />
                        <Image
                            src={"/botIcon.webp"}
                            alt="Chatbot"
                            className={`w-[100px] h-[100px]`}
                            width={100}
                            height={100}
                        />
                    </button>
                )}
            </div>

            {/* 오버레이 + 패널 (모달처럼, 열릴 때만 렌더) */}
            {isOpen && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-end justify-center animate-[fadeIn_0.2s_ease]`}
                    onClick={close}
                >
                    <div
                        className={`bg-white dark:bg-[#1e1e1e] w-full max-w-[680px] h-[70vh] md:h-[60vh] overflow-hidden p-0 rounded-t-2xl md:rounded-2xl md:mb-[6vh] z-50 flex flex-col shadow-2xl border border-black/10 dark:border-white/10 animate-[chatbotSlideUp_0.5s_ease]`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 헤더 */}
                        <div
                            className={`flex items-center justify-between px-5 py-3 border-b border-black/10 dark:border-white/10`}
                        >
                            <div className={`flex items-center gap-2 font-semibold`}>
                                <span
                                    className={`inline-block h-2.5 w-2.5 rounded-full bg-emerald-500`}
                                />
                                <span>ChatBot</span>
                            </div>
                            <button
                                type="button"
                                onClick={close}
                                className={`rounded-full hover:bg-black/5 dark:hover:bg-white/10 p-1`}
                                aria-label="Close chatbot"
                            >
                                <IoIosClose size={28} />
                            </button>
                        </div>

                        {/* 메시지 영역 */}
                        <div className={`flex-1 overflow-y-auto px-4 py-3 space-y-2`}>
                            <ul className={`flex flex-col gap-2`}>
                                {messages.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`flex ${item.isAnswer ? "justify-start" : "justify-end"}`}
                                    >
                                        <span
                                            className={`px-3 py-2 rounded-2xl max-w-[80%] break-words whitespace-pre-line text-sm md:text-[15px] ${
                                                item.isAnswer
                                                    ? "bg-[#EFF4FB] dark:bg-[#111826] text-black dark:text-[#cbd5e1]"
                                                    : "bg-gradient-to-br from-indigo-500 to-blue-500 text-white"
                                            }`}
                                        >
                                            {item.message}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 입력 영역 */}
                        <div className={`px-4 py-3 border-t border-black/10 dark:border-white/10`}>
                            <div className={`flex items-center gap-2`}>
                                {!isLoading ? (
                                    <input
                                        className={`flex-1 p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#121212] outline-none focus:ring-2 focus:ring-blue-400/50`}
                                        placeholder="ex) 찬홍님의 이력은 어떻게 되나요?"
                                        ref={inputRef}
                                        onKeyUp={handleKeyUp}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <div
                                        className={`flex-1 flex items-center justify-center p-3 rounded-xl border border-black/10 dark:border-white/10`}
                                    >
                                        <span className="loader" />
                                    </div>
                                )}
                                {!isLoading ? (
                                    <button
                                        onClick={handleAsk}
                                        type={`button`}
                                        className={`h-[44px] w-[44px] rounded-xl grid place-items-center bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md hover:opacity-90`}
                                        aria-label="Send message"
                                    >
                                        <CiSearch size={22} />
                                    </button>
                                ) : (
                                    <div className="h-[44px] w-[44px] rounded-xl grid place-items-center border border-black/10 dark:border-white/10" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .loader {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    display: block;
                    margin: auto;
                    position: absolute;
                    top: 30%;
                    color: #3c50e0;
                    box-sizing: border-box;
                    animation: animloader 2s linear infinite;
                }

                @keyframes animloader {
                    0% {
                        box-shadow:
                            14px 0 0 -2px,
                            38px 0 0 -2px,
                            -14px 0 0 -2px,
                            -38px 0 0 -2px;
                    }
                    25% {
                        box-shadow:
                            14px 0 0 -2px,
                            38px 0 0 -2px,
                            -14px 0 0 -2px,
                            -38px 0 0 2px;
                    }
                    50% {
                        box-shadow:
                            14px 0 0 -2px,
                            38px 0 0 -2px,
                            -14px 0 0 2px,
                            -38px 0 0 -2px;
                    }
                    75% {
                        box-shadow:
                            14px 0 0 2px,
                            38px 0 0 -2px,
                            -14px 0 0 -2px,
                            -38px 0 0 -2px;
                    }
                    100% {
                        box-shadow:
                            14px 0 0 -2px,
                            38px 0 0 2px,
                            -14px 0 0 -2px,
                            -38px 0 0 -2px;
                    }
                }

                @keyframes chatbotSlideUp {
                    0% {
                        transform: translateY(16px);
                        opacity: 0;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }

                @keyframes pulseBox {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1.3);
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
}
