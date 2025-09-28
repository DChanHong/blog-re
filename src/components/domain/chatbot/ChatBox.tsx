import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { ChatbotFaqDto } from "@/types/chatbot";
import type { ChatMessageItem } from "@/store/chatbotStore";

interface ChatBoxProps {
    isOpen: boolean;
    isDragging: boolean;
    faqList: ChatbotFaqDto[];
    isFaqLoading: boolean;
    onPresetClick: (question: string, answer?: string) => void;
    messages: ChatMessageItem[];
    isLoading: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onKeyUp: React.KeyboardEventHandler<HTMLInputElement>;
    onAsk: () => void;
    onClose: () => void;
}
export const ChatBox = ({
    isOpen,
    isDragging,
    faqList,
    isFaqLoading,
    onPresetClick,
    messages,
    isLoading,
    inputRef,
    onKeyUp,
    onAsk,
    onClose,
}: ChatBoxProps) => {
    if (!isOpen) return null;
    return (
        <>
            {isOpen && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]`}
                    onClick={() => !isDragging && onClose()}
                >
                    <div
                        className={`bg-white dark:bg-[#1e1e1e] w-full max-w-[680px] h-[80vh] sm:h-[80vh] md:h-[80vh] lg:h-[80vh] overflow-hidden p-0 rounded-2xl z-50 flex flex-col shadow-2xl border border-black/10 dark:border-white/10 animate-[chatbotSlideIn_0.4s_ease-out]`}
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
                                <span>성찬홍에 대해 질문해보세요!</span>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className={`rounded-full hover:bg-black/5 dark:hover:bg-white/10 p-1 cursor-pointer`}
                                aria-label="Close chatbot"
                            >
                                <IoIosClose size={28} />
                            </button>
                        </div>

                        {/* 추천 질문 영역 (가로 스와이프) */}
                        <div
                            className={`px-4 pt-3 `}
                            style={{ pointerEvents: isDragging ? "none" : "auto" }}
                            onClick={(e) => {
                                if (isDragging) {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            <div className={`text-xs text-black/60 dark:text-white/60 mb-2`}>
                                추천 질문
                            </div>
                            {isFaqLoading ? (
                                <div className={`h-[36px] flex items-center gap-2`}>
                                    <span className="typing">
                                        <span className="dot" />
                                        <span className="dot" />
                                        <span className="dot" />
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className={`w-full`}
                                    onMouseDown={(e) => {
                                        // setIsDragging은 props로 전달받아야 함
                                        e.stopPropagation();
                                    }}
                                    onMouseUp={(e) => {
                                        setTimeout(() => {}, 100);
                                        e.stopPropagation();
                                    }}
                                    onMouseLeave={(e) => {
                                        setTimeout(() => {}, 100);
                                        e.stopPropagation();
                                    }}
                                >
                                    <Swiper
                                        modules={[FreeMode, Mousewheel]}
                                        slidesPerView={"auto"}
                                        spaceBetween={8}
                                        freeMode={{
                                            enabled: true,
                                            momentum: true,
                                            momentumVelocityRatio: 0.5,
                                            sticky: false,
                                        }}
                                        direction="horizontal"
                                        grabCursor={true}
                                        simulateTouch={true}
                                        mousewheel={{
                                            enabled: true,
                                            forceToAxis: true,
                                        }}
                                        allowTouchMove={true}
                                        threshold={5}
                                        touchRatio={1}
                                        touchAngle={45}
                                        onTouchMove={() => {
                                            // setIsDragging은 props로 전달받아야 함
                                        }}
                                        onTouchEnd={() => {
                                            setTimeout(() => {}, 100);
                                        }}
                                        onMomentumBounce={() => {
                                            // setIsDragging은 props로 전달받아야 함
                                        }}
                                        className={`w-full`}
                                        style={{
                                            overflow: "visible",
                                            height: "auto",
                                            minHeight: "44px",
                                        }}
                                    >
                                        {faqList.map((f) => (
                                            <SwiperSlide key={f.id} style={{ width: "auto" }}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!isDragging) {
                                                            onPresetClick(f.question, f.answer);
                                                        }
                                                    }}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onMouseUp={(e) => e.stopPropagation()}
                                                    className={`px-3 py-1 rounded-full text-sm bg-[#F3F5F8] dark:bg-[#0f172a] text-black/80 dark:text-[#cbd5e1] hover:bg-[#e7ebf2] dark:hover:bg-[#0b1222] transition-colors cursor-pointer whitespace-nowrap`}
                                                    aria-label={`Ask: ${f.question}`}
                                                >
                                                    {f.question}
                                                </button>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}
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
                                {isLoading && (
                                    <li className={`flex justify-start`}>
                                        <span
                                            className={`px-3 py-2 rounded-2xl max-w-[80%] break-words whitespace-pre-line text-sm md:text-[15px] bg-[#EFF4FB] dark:bg-[#111826] text-black dark:text-[#cbd5e1]`}
                                        >
                                            {/* AI 타이핑 로딩 표시 */}
                                            <span className="typing">
                                                <span className="dot" />
                                                <span className="dot" />
                                                <span className="dot" />
                                            </span>
                                        </span>
                                    </li>
                                )}
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
                                        onKeyUp={onKeyUp}
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
                                        onClick={onAsk}
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

                @keyframes chatbotSlideIn {
                    0% {
                        transform: scale(0.9) translateY(20px);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1) translateY(0);
                        opacity: 1;
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

                /* AI 타이핑 로딩 점 애니메이션 */
                .typing {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    height: 18px;
                }
                .typing .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #94a3b8; /* slate-400 */
                    animation: typingBlink 1s infinite ease-in-out;
                }
                .typing .dot:nth-child(2) {
                    animation-delay: 0.15s;
                }
                .typing .dot:nth-child(3) {
                    animation-delay: 0.3s;
                }
                @keyframes typingBlink {
                    0%,
                    80%,
                    100% {
                        opacity: 0.25;
                        transform: translateY(0);
                    }
                    40% {
                        opacity: 1;
                        transform: translateY(-2px);
                    }
                }
            `}</style>
        </>
    );
};
export default ChatBox;
