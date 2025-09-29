import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import "swiper/css";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { ChatbotFaqDto } from "@/types/chatbot";
import { useIncrementFaqHitMutation } from "@/actions/chatbot";
import type { ChatMessageItem } from "@/store/chatbotStore";
import { ChatLoadingWithStyles as ChatLoading } from "./ChatLoading";

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
    const incHit = useIncrementFaqHitMutation();
    if (!isOpen) return null;
    return (
        <>
            {isOpen && (
                <div
                    className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]`}
                    onClick={() => onClose()}
                >
                    <div
                        className={`bg-white w-full max-w-[680px] h-[80vh] sm:h-[80vh] md:h-[80vh] lg:h-[80vh] overflow-hidden p-0 rounded-2xl z-50 flex flex-col shadow-2xl border border-black/10 animate-[chatbotSlideIn_0.4s_ease-out]`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 헤더 */}
                        <div
                            className={`flex items-center justify-between px-5 py-3 border-b border-black/10`}
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
                                className={`rounded-full hover:bg-black/5 p-1 cursor-pointer`}
                                aria-label="Close chatbot"
                            >
                                <IoIosClose size={28} />
                            </button>
                        </div>

                        {/* 추천 질문 영역 (가로 스와이프) */}
                        <div className={`px-4 pt-3 `}>
                            <div className={`text-xs text-black/60 mb-2`}>추천 질문</div>
                            <div className={`w-full`}>
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
                                    threshold={6}
                                    preventClicks={true}
                                    preventClicksPropagation={true}
                                    nested={true}
                                    touchStartPreventDefault={true}
                                    touchMoveStopPropagation={true}
                                    passiveListeners={false}
                                    touchEventsTarget="container"
                                    touchRatio={1}
                                    touchAngle={45}
                                    className={`w-full`}
                                    style={{
                                        overflow: "visible",
                                        height: "auto",
                                        minHeight: "44px",
                                        touchAction: "pan-x",
                                    }}
                                >
                                    {faqList.map((f) => (
                                        <SwiperSlide key={f.id} style={{ width: "auto" }}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // 히트 증가 트리거 (실패해도 UX 방해하지 않음)
                                                    if (f.id) incHit.mutate(f.id);
                                                    onPresetClick(f.question, f.answer);
                                                }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onMouseUp={(e) => e.stopPropagation()}
                                                className={`px-3 py-1 rounded-full text-sm bg-[#F3F5F8] text-black/80 hover:bg-[#e7ebf2] transition-colors cursor-pointer whitespace-nowrap`}
                                                aria-label={`Ask: ${f.question}`}
                                            >
                                                {f.question}
                                            </button>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
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
                                                    ? "bg-[#EFF4FB] text-black"
                                                    : "bg-gradient-to-br from-indigo-500 to-blue-500 text-white"
                                            }`}
                                        >
                                            {item.message}
                                        </span>
                                    </li>
                                ))}
                                {isLoading && <ChatLoading type="message" />}
                            </ul>
                        </div>

                        {/* 입력 영역 */}
                        <div className={`px-4 py-3 border-t border-black/10`}>
                            <div className={`flex items-center gap-2`}>
                                {!isLoading ? (
                                    <input
                                        className={`flex-1 p-3 rounded-xl border border-black/10 bg-white outline-none focus:ring-2 focus:ring-blue-400/50`}
                                        placeholder="ex) 찬홍님의 이력은 어떻게 되나요?"
                                        ref={inputRef}
                                        onKeyUp={onKeyUp}
                                        disabled={isLoading}
                                    />
                                ) : (
                                    <ChatLoading type="input" />
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
                                    <div className="h-[44px] w-[44px] rounded-xl grid place-items-center border border-black/10" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
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
            `}</style>
        </>
    );
};
export default ChatBox;
