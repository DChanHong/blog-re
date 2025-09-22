import { OPENAI_API_KEY, OPENAI_MODEL } from "@/lib/utils/env";
import { getRateLimitByIp, upsertRateLimit } from "@/lib/repositories/chatbotRepository";
import type { AskResult, ChatHistoryMessage } from "@/types/chatbot";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// 간단한 분당/시간당 윈도우는 서비스 레벨에서 계산
const WINDOW_MINUTES = 10; // 10분 윈도우
const LIMIT_THRESHOLD = 5; // 10분 동안 5회 제한

function getClientIp(req: Request): string | null {
    // Next.js on Vercel: x-forwarded-for 사용, 로컬은 127.0.0.1
    const forwarded = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    if (forwarded) return forwarded;
    const real = req.headers.get("x-real-ip");
    return real || null;
}

async function readResumeText(): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), "public", "resume.txt");
        const buf = await readFile(filePath);
        return buf.toString("utf8");
    } catch {
        return "";
    }
}

function minutesDiffFromNow(untilIso: string): number {
    const until = new Date(untilIso).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, until - now);
    return Math.ceil(diffMs / 60000);
}

async function ensureWithinLimit(
    ip: string | null,
): Promise<{ ok: true } | { ok: false; retryAfterMinutes: number }> {
    if (!ip) return { ok: true }; // IP가 없으면 제한 적용 어려움 → 통과

    const now = new Date();
    const existing = await getRateLimitByIp(ip);

    if (!existing) {
        await upsertRateLimit({
            ip,
            window_started_at: now.toISOString(),
            call_count: 0,
            limit_threshold: LIMIT_THRESHOLD,
        });
        return { ok: true };
    }

    // 윈도우 내부인지 확인
    const windowStart = new Date(existing.window_started_at);
    const minutesSince = (now.getTime() - windowStart.getTime()) / 60000;
    if (minutesSince >= WINDOW_MINUTES) {
        // 새 윈도우 시작
        await upsertRateLimit({
            id: existing.id,
            ip,
            window_started_at: now.toISOString(),
            call_count: 0,
            limit_threshold: existing.limit_threshold ?? LIMIT_THRESHOLD,
            limited_until: null,
        });
        return { ok: true };
    }

    if (existing.limited_until && new Date(existing.limited_until).getTime() > now.getTime()) {
        return { ok: false, retryAfterMinutes: minutesDiffFromNow(existing.limited_until) };
    }

    if (existing.call_count >= (existing.limit_threshold ?? LIMIT_THRESHOLD)) {
        const limitedUntil = new Date(now.getTime() + 10 * 60000); // 10분 차단
        await upsertRateLimit({ id: existing.id, limited_until: limitedUntil.toISOString() });
        return { ok: false, retryAfterMinutes: minutesDiffFromNow(limitedUntil.toISOString()) };
    }

    return { ok: true };
}

async function incrementCall(ip: string | null) {
    if (!ip) return;
    const existing = await getRateLimitByIp(ip);
    if (!existing) return; // ensureWithinLimit에서 생성됨
    await upsertRateLimit({ id: existing.id, call_count: existing.call_count + 1 });
}

async function callOpenAIWithMessages(
    messages: Array<{ role: string; content: string }>,
): Promise<string> {
    if (!OPENAI_API_KEY) {
        return "OPENAI_API_KEY가 설정되지 않았습니다. FAQ를 이용해주세요.";
    }
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages,
            temperature: 0.5,
        }),
    });
    if (!res.ok) {
        throw new Error(`OpenAI API error: ${res.status}`);
    }
    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content?.trim();
    return text || "죄송합니다. 적절한 답변을 생성하지 못했습니다.";
}

export async function askChatbot(
    req: Request,
    question: string,
    options?: { threadId?: string; history?: ChatHistoryMessage[] },
): Promise<AskResult> {
    try {
        const ip = getClientIp(req);
        const limitCheck = await ensureWithinLimit(ip);
        if (!limitCheck.ok) {
            return {
                type: "rate_limited",
                message: "잠시 후 다시 시도해주세요.",
                retryAfterMinutes: limitCheck.retryAfterMinutes,
            };
        }

        const resume = await readResumeText();
        const threadId = options?.threadId || randomUUID();
        const history = (options?.history || []).slice(-12);
        const messages: Array<{ role: string; content: string }> = [
            {
                role: "system",
                content: "너는 개발자의 개인 블로그 챗봇 어시스턴트야. 간결하고 정확하게 답해.",
            },
            { role: "system", content: `이력서 컨텍스트:\n${resume}` },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: question },
        ];

        const answer = await callOpenAIWithMessages(messages);
        await incrementCall(ip);
        return { type: "ok", data: { answer, threadId } };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return { type: "error", message: msg };
    }
}
