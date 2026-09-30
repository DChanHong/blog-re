\set ON_ERROR_STOP on

begin;

do $$
declare
    missing_tables text[];
    active_settings_count bigint;
begin
    select array_agg(required_table order by required_table)
    into missing_tables
    from unnest(array[
        'velog', 'chatbot_faq', 'chatbot_rate_limit',
        'chatbot_conversations', 'chatbot_settings'
    ]) required_table
    where to_regclass(format('public.%I', required_table)) is null;

    if missing_tables is not null then
        raise exception 'Required production tables are missing: %', missing_tables;
    end if;

    if exists (
        select 1
        from (values
            ('chatbot_faq', 'id'), ('chatbot_faq', 'question'),
            ('chatbot_faq', 'answer'), ('chatbot_faq', 'category'),
            ('chatbot_faq', 'sorting'), ('chatbot_faq', 'hit'),
            ('chatbot_faq', 'created_at'), ('chatbot_rate_limit', 'ip'),
            ('chatbot_rate_limit', 'window_started_at'),
            ('chatbot_conversations', 'thread_id'),
            ('chatbot_conversations', 'created_at'),
            ('chatbot_conversations', 'ip'),
            ('chatbot_settings', 'assistant_id'),
            ('chatbot_settings', 'thread_id'),
            ('chatbot_settings', 'created_at'),
            ('chatbot_settings', 'deleted_at'), ('velog', 'tags')
        ) expected(table_name, column_name)
        left join information_schema.columns actual
          on actual.table_schema = 'public'
         and actual.table_name = expected.table_name
         and actual.column_name = expected.column_name
        where actual.column_name is null
    ) then
        raise exception 'Required production columns are missing; refusing automatic correction';
    end if;

    if exists (
        select 1 from public.chatbot_faq
        where id is null or question is null or answer is null or created_at is null
    ) then
        raise exception 'chatbot_faq contains unexpected nulls';
    end if;

    select count(*) into active_settings_count
    from public.chatbot_settings
    where deleted_at is null;

    if active_settings_count > 1 then
        raise exception 'chatbot_settings has % active rows; refusing automatic correction', active_settings_count;
    end if;
end
$$;

alter table public.velog enable row level security;
alter table public.chatbot_faq enable row level security;
alter table public.chatbot_rate_limit enable row level security;
alter table public.chatbot_conversations enable row level security;
alter table public.chatbot_settings enable row level security;

do $$
declare
    target_table text;
    existing_policy record;
begin
    foreach target_table in array array[
        'velog', 'chatbot_faq', 'chatbot_rate_limit',
        'chatbot_conversations', 'chatbot_settings'
    ] loop
        for existing_policy in
            select policyname from pg_policies
            where schemaname = 'public' and tablename = target_table
        loop
            execute format('drop policy if exists %I on public.%I', existing_policy.policyname, target_table);
        end loop;
    end loop;

    if to_regclass('public.chatbot_faq_log') is not null then
        execute 'alter table public.chatbot_faq_log enable row level security';
        for existing_policy in
            select policyname from pg_policies
            where schemaname = 'public' and tablename = 'chatbot_faq_log'
        loop
            execute format('drop policy if exists %I on public.chatbot_faq_log', existing_policy.policyname);
        end loop;
        execute 'revoke all privileges on table public.chatbot_faq_log from anon, authenticated';
        execute 'grant all privileges on table public.chatbot_faq_log to service_role';
    end if;
end
$$;

revoke all privileges on table public.velog from anon, authenticated;
revoke all privileges on table public.chatbot_faq from anon, authenticated;
revoke all privileges on table public.chatbot_rate_limit from anon, authenticated;
revoke all privileges on table public.chatbot_conversations from anon, authenticated;
revoke all privileges on table public.chatbot_settings from anon, authenticated;

grant select on table public.velog to anon, authenticated;
grant select on table public.chatbot_faq to anon, authenticated;

grant all privileges on table public.velog to service_role;
grant all privileges on table public.chatbot_faq to service_role;
grant all privileges on table public.chatbot_rate_limit to service_role;
grant all privileges on table public.chatbot_conversations to service_role;
grant all privileges on table public.chatbot_settings to service_role;

create policy velog_read_public on public.velog
for select to anon, authenticated using (true);

create policy chatbot_faq_read_public on public.chatbot_faq
for select to anon, authenticated using (true);

create unique index if not exists ux_chatbot_settings_single_active
on public.chatbot_settings ((true)) where deleted_at is null;

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
create index if not exists velog_tags_gin
on public.velog using gin (tags);

commit;
