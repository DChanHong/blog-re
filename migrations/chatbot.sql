-- Canonical Chatbot schema for new environments.
create extension if not exists "pgcrypto";

create table if not exists public.chatbot_faq (
    id uuid primary key default gen_random_uuid(),
    question text not null,
    answer text not null,
    category text null,
    sorting integer null,
    hit integer null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.chatbot_rate_limit (
    id uuid primary key default gen_random_uuid(),
    ip varchar(64) not null,
    window_started_at timestamptz not null,
    call_count integer not null default 0,
    limit_threshold integer not null,
    limited_until timestamptz null,
    created_at timestamptz not null default now()
);

create table if not exists public.chatbot_conversations (
    id uuid primary key default gen_random_uuid(),
    thread_id varchar(255) not null,
    user_message text not null,
    assistant_message text not null,
    ip varchar(64) null,
    user_agent text null,
    created_at timestamptz not null default now()
);

create table if not exists public.chatbot_settings (
    id uuid primary key default gen_random_uuid(),
    assistant_id text not null,
    thread_id text not null,
    created_at timestamptz not null default now(),
    deleted_at timestamptz null
);

alter table public.chatbot_faq enable row level security;
alter table public.chatbot_rate_limit enable row level security;
alter table public.chatbot_conversations enable row level security;
alter table public.chatbot_settings enable row level security;

drop policy if exists chatbot_faq_read_anon on public.chatbot_faq;
drop policy if exists chatbot_faq_read_public on public.chatbot_faq;

revoke all privileges on table public.chatbot_faq from anon, authenticated;
revoke all privileges on table public.chatbot_rate_limit from anon, authenticated;
revoke all privileges on table public.chatbot_conversations from anon, authenticated;
revoke all privileges on table public.chatbot_settings from anon, authenticated;

grant select on table public.chatbot_faq to anon, authenticated;
grant all privileges on table public.chatbot_faq to service_role;
grant all privileges on table public.chatbot_rate_limit to service_role;
grant all privileges on table public.chatbot_conversations to service_role;
grant all privileges on table public.chatbot_settings to service_role;

create policy chatbot_faq_read_public on public.chatbot_faq
for select to anon, authenticated using (true);

create index if not exists idx_chatbot_rate_limit_ip_window
on public.chatbot_rate_limit (ip, window_started_at desc);
create index if not exists idx_chatbot_conversations_thread_id
on public.chatbot_conversations (thread_id);
create index if not exists idx_chatbot_conversations_created_at
on public.chatbot_conversations (created_at);
create index if not exists idx_chatbot_conversations_ip
on public.chatbot_conversations (ip);
create index if not exists idx_chatbot_faq_category_sorting_created_at
on public.chatbot_faq (category, sorting, created_at);
create unique index if not exists ux_chatbot_settings_single_active
on public.chatbot_settings ((true)) where deleted_at is null;

-- chatbot_faq_log is intentionally excluded from the canonical schema.
