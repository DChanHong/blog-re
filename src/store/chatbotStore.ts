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
    open: () => void;
    close: () => void;
    toggle: () => void;
    addMessage: (msg: ChatMessageItem) => void;
    setLoading: (v: boolean) => void;
    reset: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
    isOpen: false,
    isLoading: false,
    messages: [],
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
    setLoading: (v) => set({ isLoading: v }),
    reset: () => set({ isOpen: false, isLoading: false, messages: [] }),
}));
