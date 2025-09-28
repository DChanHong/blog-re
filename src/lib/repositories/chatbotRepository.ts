import {
    createSupabaseServiceRoleClient,
    createSupabaseServerClient,
} from "@/lib/db/supabaseServer";

// 챗봇 레포지토리: FAQ 조회, FAQ 로그 기록, IP 레이트리밋 상태 관리

export async function fetchActiveFaqs() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("chatbot_faq")
        .select("id, question, answer")
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
}

// 삭제됨: FAQ 클릭 로깅(insertFaqLog)

export interface RateLimitRow {
    id: string;
    ip: string;
    window_started_at: string;
    call_count: number;
    limit_threshold: number;
    limited_until: string | null;
    created_at: string;
}

export async function getRateLimitByIp(ip: string) {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("chatbot_rate_limit")
        .select("*")
        .eq("ip", ip)
        .order("window_started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;
    return (data as RateLimitRow | null) ?? null;
}

export async function upsertRateLimit(row: Partial<RateLimitRow>) {
    const supabase = createSupabaseServiceRoleClient();
    const payload = { ...row } as any;
    const { data, error } = await supabase
        .from("chatbot_rate_limit")
        .upsert(payload)
        .select("*")
        .maybeSingle();
    if (error) throw error;
    return data as RateLimitRow;
}

// ============================================
// FAQ (카테고리/정렬 포함) 조회
// ============================================

export interface FaqRow {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    sorting: number | null;
    hit: number | null;
    created_at: string;
}

export async function fetchFaqs(params?: { category?: string | null }) {
    const supabase = createSupabaseServerClient();
    let query = supabase
        .from("chatbot_faq")
        .select("id, question, answer, category, sorting, created_at, hit");

    if (params?.category) {
        query = query.eq("category", params.category);
        // 지정 카테고리 내에서 sorting 오름차순, 다음 created_at 오름차순
        query = query
            .order("sorting", { ascending: true, nullsFirst: false })
            .order("created_at", { ascending: true });
    } else {
        // 전체 조회 시 category, sorting, created_at 기준 정렬
        query = query
            .order("category", { ascending: true, nullsFirst: true })
            .order("sorting", { ascending: true, nullsFirst: false })
            .order("created_at", { ascending: true });
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as FaqRow[];
}

// FAQ 클릭 시 hit 카운트 증가 (원자적 upsert 아님: 기존 행 업데이트)
export async function incrementFaqHit(faqId: string): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { data: row, error: selErr } = await supabase
        .from("chatbot_faq")
        .select("hit")
        .eq("id", faqId)
        .single();
    if (selErr) throw selErr;
    const next = (Number(row?.hit ?? 0) || 0) + 1;
    const { error } = await supabase.from("chatbot_faq").update({ hit: next }).eq("id", faqId);
    if (error) throw error;
}

export async function fetchFaqCategories(): Promise<string[]> {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("chatbot_faq")
        .select("category")
        .not("category", "is", null)
        .order("category", { ascending: true });
    if (error) throw error;
    const categories = (data || [])
        .map((r: any) => r.category as string)
        .filter((v: any) => typeof v === "string");
    // 중복 제거
    return Array.from(new Set(categories));
}

// AI 대화 로그 저장
export async function saveConversation(params: {
    thread_id: string;
    user_message: string;
    assistant_message: string;
    ip?: string;
    user_agent?: string;
}) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("chatbot_conversations")
        .insert({
            thread_id: params.thread_id,
            user_message: params.user_message,
            assistant_message: params.assistant_message,
            ip: params.ip || null,
            user_agent: params.user_agent || null,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

// AI 대화 로그 조회 (특정 thread)
export async function getConversationsByThread(threadId: string) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("chatbot_conversations")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
}

// AI 대화 로그 통계 (전체)
export async function getConversationStats() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
        .from("chatbot_conversations")
        .select("created_at", { count: "exact" });
    if (error) throw error;
    return data;
}

// ============================================
// 챗봇 설정 (assistant_id, thread_id) - 단일 활성 레코드 사용
// ============================================

export interface ChatbotSettingsRow {
    id: string;
    assistant_id: string;
    thread_id: string;
    created_at: string;
    deleted_at: string | null;
}

export async function getActiveChatbotSettings(): Promise<ChatbotSettingsRow | null> {
    // 설정은 서버 전용이므로 서비스 롤로 접근 (RLS 무시)
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("chatbot_settings")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error && error.code !== "PGRST116") throw error;
    return (data as ChatbotSettingsRow | null) ?? null;
}

export async function deactivateActiveChatbotSettings(): Promise<void> {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase
        .from("chatbot_settings")
        .update({ deleted_at: new Date().toISOString() })
        .is("deleted_at", null);
    if (error) throw error;
}

export async function insertChatbotSettings(params: {
    assistant_id: string;
    thread_id: string;
}): Promise<ChatbotSettingsRow> {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
        .from("chatbot_settings")
        .insert({ assistant_id: params.assistant_id, thread_id: params.thread_id })
        .select("*")
        .single();
    if (error) throw error;
    return data as ChatbotSettingsRow;
}
