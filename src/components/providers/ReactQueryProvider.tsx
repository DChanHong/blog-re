"use client";

// React Query Provider 설정 컴포넌트
// - QueryClient를 앱 전역에 제공
// - Devtools 포함 (개발 환경에서만 노출)

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ReactQueryProviderProps {
    children: React.ReactNode;
}

// 전역 QueryClient 인스턴스 (클라이언트 전용, SSR 안전)
const queryClientSingleton = (() => {
    let client: QueryClient | null = null;
    return () => {
        if (!client) {
            client = new QueryClient({
                defaultOptions: {
                    queries: {
                        // 기본 옵션: 필요 시 조정
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            });
        }
        return client;
    };
})();

export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
    const queryClient = queryClientSingleton();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
