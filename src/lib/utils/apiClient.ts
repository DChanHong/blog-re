// 공통 API 클라이언트 (서버/클라 겸용)
// - 명시적 method 전달 (GET/POST/PUT/PATCH/DELETE)
// - 타임아웃(AbortController)
// - Next.js 옵션(next.revalidate, cache, tags) 전달
// - 프로젝트 표준 ApiResponse<T> 파싱

import type { ApiResponse } from "@/types/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type NextOptions = {
    revalidate?: number | false;
    tags?: string[];
};

export interface ApiClientOptions extends RequestInit {
    method: HttpMethod;
    timeoutMs?: number;
    next?: NextOptions;
    cache?: RequestCache;
}

const DEFAULT_TIMEOUT_MS = 10_000;

function withTimeout(init: RequestInit, timeoutMs: number) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const merged: RequestInit = { ...init, signal: controller.signal };
    return { init: merged, clear: () => clearTimeout(id) };
}

async function parseJson<T>(res: Response): Promise<ApiResponse<T>> {
    try {
        return (await res.json()) as ApiResponse<T>;
    } catch {
        return {
            result: { success: false, message: "Invalid JSON" },
            data: null,
        } as ApiResponse<T>;
    }
}

export async function apiRequest<T>(
    url: string,
    options: ApiClientOptions,
): Promise<ApiResponse<T>> {
    const { timeoutMs = DEFAULT_TIMEOUT_MS, headers, method, next, cache, body, ...rest } = options;
    const resolveUrl = (input: string) => {
        if (/^https?:\/\//i.test(input)) return input;
        if (typeof window !== "undefined") return input; // 브라우저는 상대경로 OK
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        return `${base.replace(/\/$/, "")}${input.startsWith("/") ? input : `/${input}`}`;
    };
    const finalUrl = resolveUrl(url);
    const init: RequestInit & { next?: NextOptions; cache?: RequestCache } = {
        method,
        headers: { Accept: "application/json", ...(headers || {}) },
        body,
        next,
        cache,
        ...rest,
    };
    const { init: timedInit, clear } = withTimeout(init, timeoutMs);
    try {
        const res = await fetch(finalUrl, timedInit as any);
        console.log(`[apiClient] ${method} ${finalUrl} -> ${res.status}`);
        if (!res.ok) {
            return {
                result: { success: false, message: `HTTP ${res.status}` },
                data: null,
            } as ApiResponse<T>;
        }
        return await parseJson<T>(res);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return { result: { success: false, message }, data: null } as ApiResponse<T>;
    } finally {
        clear();
    }
}

export function toJsonBody(data: unknown) {
    return JSON.stringify(data ?? {});
}
