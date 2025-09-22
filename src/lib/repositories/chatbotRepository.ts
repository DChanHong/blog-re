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

export async function insertFaqLog(params: { faqId: string; ip?: string | null }) {
    const supabase = createSupabaseServiceRoleClient();
    const { error } = await supabase.from("chatbot_faq_log").insert({
        faq_id: params.faqId,
        ip: params.ip ?? null,
    });
    if (error) throw error;
}

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
