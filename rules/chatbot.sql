-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================
-- 최소 스키마: FAQ (질문/답변)
-- ============================================

-- 홈/채팅 화면에서 노출되는 고정 질문과 정적 답변 저장
create table if not exists public.chatbot_faq (
    id uuid primary key default gen_random_uuid(),
    question text not null, -- 질문 (버튼 라벨로도 사용)
    answer text not null,   -- 정적 답변 (마크다운 허용 가능)
    created_at timestamptz not null default now()
);

-- RLS: 공개 읽기 허용, 쓰기는 서비스 롤만 (정책 미생성)
alter table public.chatbot_faq enable row level security;

create policy chatbot_faq_read_anon
on public.chatbot_faq
for select
to anon
using (true);




-- ============================================
-- 최소 스키마: IP 기반 레이트 리밋
-- - 동일 IP의 GPT 호출 횟수를 윈도우 단위로 집계
-- - 운영 정책은 서비스 레이어에서 처리
-- ============================================
create table if not exists public.chatbot_rate_limit (
    id uuid primary key default gen_random_uuid(),
    ip varchar(64) not null,
    window_started_at timestamptz not null,
    call_count int not null default 0,
    limit_threshold int not null,
    limited_until timestamptz null,
    created_at timestamptz not null default now()
);

-- RLS: 공개 접근 금지 (정책 미생성) → 서비스 롤만 사용
alter table public.chatbot_rate_limit enable row level security;


-- ============================================
-- 최소 스키마: FAQ 선택 로깅
-- - 어떤 FAQ가 얼마나 자주 클릭되는지 통계용
-- ============================================
create table if not exists public.chatbot_faq_log (
    id uuid primary key default gen_random_uuid(),
    faq_id uuid not null references public.chatbot_faq(id) on delete cascade,
    ip varchar(64) null,
    created_at timestamptz not null default now()
);

-- RLS: 공개 접근 금지 (정책 미생성) → 서비스 롤만 사용
alter table public.chatbot_faq_log enable row level security;


-- ============================================
-- AI 대화 로그 저장 테이블 (Assistants API용)
-- - Assistants API를 통한 AI 질문/답변 저장
-- ============================================
create table if not exists public.chatbot_conversations (
    id uuid primary key default gen_random_uuid(),
    thread_id varchar(255) not null, -- Assistants API thread ID
    user_message text not null,
    assistant_message text not null,
    ip varchar(64) null,
    user_agent text null,
    created_at timestamptz not null default now()
);

-- RLS: 공개 접근 금지 (정책 미생성) → 서비스 롤만 사용
alter table public.chatbot_conversations enable row level security;

-- 인덱스 추가 (성능 최적화)
create index if not exists idx_chatbot_conversations_thread_id on public.chatbot_conversations using btree (thread_id);
create index if not exists idx_chatbot_conversations_created_at on public.chatbot_conversations using btree (created_at);
create index if not exists idx_chatbot_conversations_ip on public.chatbot_conversations using btree (ip);
