-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Create table
create table if not exists public.velog (
    id uuid primary key default gen_random_uuid(),
    title text not null, 
    img_src text not null,
    created_at timestamptz not null,
    tags text[] null,
    detail_link text not null,
    intro text null,
    inserted_at timestamptz not null default now()
);

-- Drop composite unique if exists (we'll enforce uniqueness in application layer)
alter table public.velog drop constraint if exists velog_title_detail_link_key;

-- Index for array operations (@>, &&)
create index if not exists velog_tags_gin on public.velog using gin (tags);

-- Enable RLS
alter table public.velog enable row level security;

-- Read policy for anon
create policy if not exists velog_read_anon
on public.velog for select
to anon
using (true);

-- Optional: restrict writes to service role only (no anon insert)
-- Do not create insert policy for anon; service role bypasses RLS.
