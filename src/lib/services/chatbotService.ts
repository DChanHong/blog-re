import { OPENAI_MODEL } from "@/lib/utils/env";
import {
    getRateLimitByIp,
    upsertRateLimit,
    fetchFaqs,
    incrementFaqHit,
    fetchFaqCategories,
    saveConversation,
    getActiveChatbotSettings,
    deactivateActiveChatbotSettings,
    insertChatbotSettings,
    type FaqRow,
} from "@/lib/repositories/chatbotRepository";
import type { AskResult, ChatHistoryMessage } from "@/types/chatbot";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import OpenAI from "openai";

// 간단한 분당/시간당 윈도우는 서비스 레벨에서 계산
const WINDOW_MINUTES = 10; // 10분 윈도우
const LIMIT_THRESHOLD = 5; // 10분 동안 5회 제한

// 답변 문자열에서 마크다운 장식 제거(굵게/기울임/인라인코드/헤더/리스트 등 기본 요소)
function stripMarkdownToPlain(text: string): string {
    if (!text) return "";
    let out = text;
    // 코드블록 ```...```
    out = out.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));
    // 인라인 코드 `code`
    out = out.replace(/`([^`]*)`/g, "$1");
    // 굵게/기울임 *bold*, **bold**, _italics_, __bold__
    out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
    out = out.replace(/\*([^*]+)\*/g, "$1");
    out = out.replace(/__([^_]+)__/g, "$1");
    out = out.replace(/_([^_]+)_/g, "$1");
    // 헤더 #, ##, ### ... 제거
    out = out.replace(/^\s{0,3}#{1,6}\s+/gm, "");
    // 리스트 마커 -, *, + 숫자. 제거
    out = out.replace(/^\s*[-*+]\s+/gm, "");
    out = out.replace(/^\s*\d+\.\s+/gm, "");
    // 링크 [text](url) → text
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
    // 이미지 ![alt](url) → alt
    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1");
    // 블록인용 > 제거
    out = out.replace(/^\s*>\s?/gm, "");
    // HTML 태그 제거
    out = out.replace(/<[^>]+>/g, "");
    // 남은 별표/밑줄 잔재 정리
    out = out.replace(/[*_]{1,}/g, "");
    // 연속 공백 정리
    out = out
        .replace(/[\t ]+/g, " ")
        .replace(/\s+\n/g, "\n")
        .trim();
    return out;
}

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

// OpenAI 클라이언트는 요청 시점에 생성하여 dev HMR 환경에서의 오래된 키 고착을 방지
function createOpenAIClient(): OpenAI {
    // dev 환경에서 부모 프로세스의 오래된 ENV를 덮어쓰기 위해 .env 값을 우선 적용
    if (process.env.NODE_ENV !== "production") {
        try {
            const envPath = path.join(process.cwd(), ".env");
            const raw = readFileSync(envPath, "utf8");
            // 간단 파싱: 주석/공백 제거 후 OPENAI 키만 로드
            for (const line of raw.split(/\r?\n/)) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#")) continue;
                const eq = trimmed.indexOf("=");
                if (eq <= 0) continue;
                const key = trimmed.slice(0, eq).trim();
                const value = trimmed.slice(eq + 1).trim();
                if (key === "OPENAI_API_KEY" && value) {
                    process.env.OPENAI_API_KEY = value;
                }
                if (key === "OPENAI_PROJECT" && value) {
                    process.env.OPENAI_PROJECT = value;
                }
            }
        } catch {
            // .env가 없거나 읽기 실패 시 무시
        }
    }
    const apiKey = process.env.OPENAI_API_KEY;
    const project = process.env.OPENAI_PROJECT;
    if (!apiKey || apiKey.length === 0) {
        throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
    }
    if (!project || project.length === 0) {
        throw new Error("OPENAI_PROJECT 설정되지 않았습니다.");
    }
    return new OpenAI({ apiKey, project });
}

// Assistant/Thread: settings 기반 단일 활성 레코드 사용
async function getOrCreateAssistantAndThread(): Promise<{ assistantId: string; threadId: string }> {
    const settings = await getActiveChatbotSettings();
    // settings가 있으나 필수 값이 비정상인 경우 비활성화 후 재생성
    if (settings) {
        if (settings.assistant_id && settings.thread_id) {
            return { assistantId: settings.assistant_id, threadId: settings.thread_id };
        }
        await deactivateActiveChatbotSettings();
    }

    // 없으면 신규 생성
    const openai = createOpenAIClient();

    // 1) Assistant 생성
    const assistant = await openai.beta.assistants.create({
        name: "ResumeBot",
        instructions: "이력 정보를 바탕으로만 답합니다.",
        model: OPENAI_MODEL,
    });
    console.log("assistant", assistant);

    // 2) Thread 생성
    const thread = await openai.beta.threads.create();
    console.log("thread", thread);

    // 3) settings insert
    if (!assistant?.id || !assistant.id.startsWith("asst_")) {
        throw new Error("생성된 Assistant ID가 비정상입니다.");
    }
    if (!thread?.id || !thread.id.startsWith("thread_")) {
        throw new Error("생성된 Thread ID가 비정상입니다.");
    }
    await insertChatbotSettings({ assistant_id: assistant.id, thread_id: thread.id });

    return { assistantId: assistant.id, threadId: thread.id };
}

function minutesDiffFromNow(untilIso: string): number {
    const until = new Date(untilIso).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, until - now);
    return Math.ceil(diffMs / 60000);
}

function normalizeIpForRateLimit(ip: string | null): string | null {
    if (!ip) return null;
    // IPv6 loopback → IPv4 루프백으로 정규화
    if (ip === "::1") return "127.0.0.1";
    // IPv4-mapped IPv6 형태 (::ffff:127.0.0.1)
    if (ip.startsWith("::ffff:")) return ip.slice(7);
    // x-forwarded-for 다중 IP일 경우 첫 번째만 사용 (방어적)
    if (ip.includes(",")) return ip.split(",")[0].trim();
    return ip;
}

async function ensureWithinLimit(
    ip: string | null,
): Promise<{ ok: true } | { ok: false; retryAfterMinutes: number }> {
    try {
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
    } catch (e) {
        console.warn("ensureWithinLimit failed:", e);
        return { ok: true };
    }
}

async function incrementCall(ip: string | null) {
    if (!ip) return;
    const existing = await getRateLimitByIp(ip);
    if (!existing) return; // ensureWithinLimit에서 생성됨
    await upsertRateLimit({ id: existing.id, call_count: existing.call_count + 1 });
}

// Assistants API를 사용한 메시지 처리
async function callOpenAIWithAssistants(
    question: string,
    resumeText: string,
): Promise<{ answer: string; threadId: string }> {
    const openai = createOpenAIClient();

    const { assistantId, threadId } = await getOrCreateAssistantAndThread();
    console.log("assistantId", assistantId);
    console.log("threadId", threadId);
    if (!threadId || !threadId.startsWith("thread_")) {
        throw new Error("threadId가 비정상입니다.");
    }

    // 이력 정보를 포함한 instructions 생성
    const instructions = `
당신은 성찬홍의 개인 블로그 챗봇 어시스턴트입니다.

다음은 성찬홍에 대한 이력 정보입니다. 이 정보를 바탕으로 모든 질문에 답변해주세요:

${resumeText}

답변 원칙:
1. 이력 정보를 바탕으로만 답변
2. 자연스럽고 친근한 톤으로 대화
3. 구체적인 기술/프로젝트 언급 시 이력 정보 기반으로만
4. 모르는 정보는 "잘 모르겠습니다"라고 솔직하게 인정
5. 한국어로 답변

이력 정보에 없는 질문에는 "이력서에 자세한 정보가 없네요. 다른 질문을 해보세요!"라고 답변하세요.
`;

    try {
        // Assistant 업데이트 (instructions 포함)
        await openai.beta.assistants.update(assistantId, {
            instructions,
        });
    } catch (error) {
        // Assistant가 존재하지 않으면 새로 생성
        console.warn("Assistant 업데이트 실패:", error);
    }

    // Thread에 사용자 메시지 추가
    await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: question,
    });

    // Run 생성 및 실행
    await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
    });
    // runs.list만으로 상태 폴링 (runs.retrieve 경로 문제 우회)
    let latestRun: any | null = null;
    for (let i = 0; i < 30; i++) {
        const listRes: any = await openai.beta.threads.runs.list(threadId);
        const data: any[] = Array.isArray(listRes?.data) ? listRes.data : [];
        latestRun =
            data
                .filter((r: any) => typeof r?.id === "string")
                .sort(
                    (a: any, b: any) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                )[0] || null;
        if (!latestRun) {
            await new Promise((res) => setTimeout(res, 1000));
            continue;
        }
        if (latestRun.status !== "queued" && latestRun.status !== "in_progress") break;
        await new Promise((res) => setTimeout(res, 1000));
    }
    if (!latestRun?.id || !String(latestRun.id).startsWith("run_")) {
        throw new Error(`run.id를 찾지 못했습니다(폴링 후): ${String(latestRun?.id || "")}`);
    }
    if (latestRun.status === "failed") {
        throw new Error("Assistant 실행에 실패했습니다.");
    }

    // 최신 메시지들 가져오기
    const messages = await openai.beta.threads.messages.list(threadId);
    // 가장 최근 assistant 메시지 찾기
    const latestMessage = messages.data
        .filter((msg: any) => msg.role === "assistant")
        .sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )[0];

    console.log("latestMessage", latestMessage);
    if (!latestMessage?.content?.[0] || latestMessage.content[0].type !== "text") {
        throw new Error("답변을 생성하지 못했습니다.");
    }

    const rawAnswer = latestMessage.content[0].text.value;
    const answer = stripMarkdownToPlain(rawAnswer);

    console.log("answer", answer);
    return { answer, threadId };
}

export async function askChatbot(
    req: Request,
    question: string,
    options?: { threadId?: string; history?: ChatHistoryMessage[] },
): Promise<AskResult> {
    try {
        const rawIp = getClientIp(req);
        const ip = normalizeIpForRateLimit(rawIp);

        const limitCheck = await ensureWithinLimit(ip);

        if (!limitCheck.ok) {
            return {
                type: "rate_limited",
                message: "잠시 후 다시 시도해주세요.",
                retryAfterMinutes: limitCheck.retryAfterMinutes,
            };
        }

        const resume = await readResumeText();

        // Assistants API 호출
        const result = await callOpenAIWithAssistants(question, resume);

        // AI 대화 로그 저장
        try {
            await saveConversation({
                thread_id: result.threadId,
                user_message: question,
                assistant_message: result.answer,
                ip: ip || undefined,
                user_agent: req.headers.get("user-agent") || undefined,
            });
        } catch (logError) {
            // 로그 저장 실패는 무시하고 계속 진행
            console.warn("대화 로그 저장 실패:", logError);
        }

        try {
            await incrementCall(ip);
        } catch (incErr) {
            console.warn("incrementCall failed:", incErr);
            // 레이트리밋 카운트 실패는 응답을 막지 않음
        }
        return {
            type: "ok",
            data: { answer: stripMarkdownToPlain(result.answer), threadId: result.threadId },
        };
    } catch (e: unknown) {
        const msg =
            e instanceof Error
                ? e.message
                : (() => {
                      try {
                          return JSON.stringify(e);
                      } catch {
                          return "Unknown error";
                      }
                  })();
        console.error("Chatbot error:", msg);
        return { type: "error", message: msg };
    }
}

// ============================================
// FAQ 서비스: 카테고리/정렬 기반 FAQ 목록과 카테고리 목록 제공
// ============================================

export async function getFaqList(params?: { category?: string | null }): Promise<FaqRow[]> {
    return await fetchFaqs({ category: params?.category ?? undefined });
}

// FAQ 클릭 시 hit 증가
export async function increaseFaqHit(
    faqId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
    try {
        await incrementFaqHit(faqId);
        return { ok: true };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return { ok: false, message: msg };
    }
}

export async function getFaqCategories(): Promise<string[]> {
    return await fetchFaqCategories();
}
