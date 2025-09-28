"use client";
import React from "react";
import Image from "next/image";
interface ChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
}
// ChatButton 전용 스타일
const chatButtonStyles = `
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
`;

// 스타일 태그를 추가하기 위해 React 컴포넌트에서 사용
const ChatButton = ({ onClick, isOpen }: ChatButtonProps) => {
    if (isOpen) return null;

    return (
        <>
            <style jsx>{chatButtonStyles}</style>
            <div className={`fixed z-50 right-[3%] bottom-[140px]`}>
                <button
                    aria-label="Open chatbot"
                    onClick={onClick}
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
            </div>
        </>
    );
};
export default ChatButton;
