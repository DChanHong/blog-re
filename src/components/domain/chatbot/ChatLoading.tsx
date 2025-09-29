"use client";
import React from "react";

interface ChatLoadingProps {
    type?: "input" | "message";
}

export const ChatLoading = ({ type = "message" }: ChatLoadingProps) => {
    if (type === "input") {
        return (
            <div
                className={`flex-1 flex items-center justify-center p-3 rounded-xl border border-black/10`}
            >
                <span className="loader" />
            </div>
        );
    }

    return (
        <li className={`flex justify-start`}>
            <span
                className={`px-3 py-2 rounded-2xl max-w-[80%] break-words whitespace-pre-line text-sm md:text-[15px] bg-[#EFF4FB] text-black`}
            >
                {/* AI 타이핑 로딩 표시 */}
                <span className="typing">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                </span>
            </span>
        </li>
    );
};

export default ChatLoading;

// ChatLoading 전용 스타일
const chatLoadingStyles = `
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
`;

// 스타일 태그를 추가하기 위해 React 컴포넌트에서 사용
const ChatLoadingWithStyles = ({ type = "message" }: ChatLoadingProps) => {
    if (type === "input") {
        return (
            <>
                <style jsx>{chatLoadingStyles}</style>
                <div
                    className={`flex-1 flex items-center justify-center p-3 rounded-xl border border-black/10`}
                >
                    <span className="loader" />
                </div>
            </>
        );
    }

    return (
        <>
            <style jsx>{chatLoadingStyles}</style>
            <li className={`flex justify-start`}>
                <span
                    className={`px-3 py-2 rounded-2xl max-w-[80%] break-words whitespace-pre-line text-sm md:text-[15px] bg-[#EFF4FB] text-black`}
                >
                    {/* AI 타이핑 로딩 표시 */}
                    <span className="typing">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                    </span>
                </span>
            </li>
        </>
    );
};

export { ChatLoadingWithStyles };
