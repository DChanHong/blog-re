"use client";

// 챗봇 전역 상태 (Zustand)
// - 열림/닫힘 상태
// - 메시지 목록 (간단 텍스트 기반)

import { create } from "zustand";

export interface ChatMessageItem {
    isAnswer: boolean;
    message: string;
}

interface ChatbotState {
    isOpen: boolean;
    isLoading: boolean;
    messages: ChatMessageItem[];
    threadId: string | null;
    open: () => void;
    close: () => void;
    toggle: () => void;
    addMessage: (msg: ChatMessageItem) => void;
    setLoading: (v: boolean) => void;
    setThreadId: (id: string | null) => void;
    reset: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
    isOpen: false,
    isLoading: false,
    // 로컬스토리지에서 메시지 복원
    messages: (() => {
        try {
            if (typeof window === "undefined") return [] as ChatMessageItem[];
            const raw = localStorage.getItem("chatbot_messages_v1");
            if (!raw) return [] as ChatMessageItem[];
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (x: any) =>
                        x && typeof x.message === "string" && typeof x.isAnswer === "boolean",
                ) as ChatMessageItem[];
            }
            return [] as ChatMessageItem[];
        } catch {
            return [] as ChatMessageItem[];
        }
    })(),
    threadId: null,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    addMessage: (msg) =>
        set((s) => {
            const next = [...s.messages, msg];
            try {
                if (typeof window !== "undefined") {
                    localStorage.setItem("chatbot_messages_v1", JSON.stringify(next));
                }
            } catch {}
            return { messages: next };
        }),
    setLoading: (v) => set({ isLoading: v }),
    setThreadId: (id) => set({ threadId: id }),
    reset: () =>
        set(() => {
            try {
                if (typeof window !== "undefined") {
                    localStorage.setItem("chatbot_messages_v1", JSON.stringify([]));
                }
            } catch {}
            return { isOpen: false, isLoading: false, messages: [] };
        }),
}));
