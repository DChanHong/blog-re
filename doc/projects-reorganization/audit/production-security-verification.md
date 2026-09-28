# Production Security Verification

- Plan: `01-production-security-and-schema-alignment.md`
- Target: production Supabase and local application
- Started: 2026-09-29 (Asia/Seoul)
- Status: Implementation complete; production application deployment verification pending

This artifact intentionally excludes connection strings, credentials, JWTs, row bodies,
assistant/thread identifiers, messages, IP addresses, and User-Agent values.

## Preflight

- Production identity: expected Supabase project confirmed through the configured project reference and required tables.
- Expected tables: 5/5 present.
- Row counts: `velog=97`, `chatbot_faq=15`, `chatbot_rate_limit=6`, `chatbot_conversations=8`, `chatbot_settings=1`.
- Preconditions: one active settings row, no duplicate rate-limit `(ip, window_started_at)` keys, no unexpected FAQ required-column nulls.
- `chatbot_faq_log`: absent.

## Before Migration

- RLS enabled: `velog`, `chatbot_faq`, `chatbot_rate_limit`.
- RLS disabled: `chatbot_conversations`, `chatbot_settings`.
- Public policies: anon SELECT on `velog` and `chatbot_faq`; none on sensitive tables.
- Grants: anon/authenticated had all table privileges on all five tables.
- Existing indexes: primary keys, `velog_tags_gin`, and the active-settings partial unique index.
- Missing planned indexes: rate-limit composite index, FAQ sort index, and conversation lookup indexes.

## Migration Application

- Applied with `psql` and `ON_ERROR_STOP` inside the migration transaction.
- First application: success.
- Immediate second application: success; idempotency confirmed against production schema/data.
- No table/row deletion, truncation, or sensitive public-access rollback was performed.

## Postflight

- Row counts preserved: `velog=97`, `chatbot_faq=15`, `chatbot_rate_limit=6`, `chatbot_conversations=8`, `chatbot_settings=1`.
- RLS enabled on all five expected tables.
- `velog` and `chatbot_faq`: anon/authenticated `SELECT` grants and SELECT policies only.
- Sensitive Chatbot tables: no anon/authenticated grants or policies; service-role privileges retained.
- Required FAQ sorting, rate-limit composite, conversation lookup, active-settings partial unique, and Velog tags GIN indexes present.
- `chatbot_faq_log` remains absent and was not created.
- HEAD/count regression: public anon reads succeeded, sensitive anon reads returned 401, and service-role counts matched the preflight snapshot.

## Application and Route Checks

- `git diff --check`: success.
- `npx tsc --noEmit`: success.
- `npm run lint`: exit 2 at the pre-existing missing `eslint-plugin-prettier` baseline.
- `npm run build`: success; 111 generated pages and removed routes absent from the route manifest.
- Local `npm run verify:security` with exact snapshot counts: success.
- Local removed routes: crawler/test/API Docs returned 404; FAQ POST returned 405.
- Local retained pages/routes returned 200; `/api/` robots disallow remained and the redundant `/api-docs` rule was removed.
- Chatbot answer smoke returned 500 because the OpenAI Assistants API was sunset on 2026-08-26 and now returns 404. The user approved deferring Responses API migration and functional recovery to Plan 06; the Supabase service-role boundary passed.

## Deployment Gate

Production application route checks remain pending until the user pushes the implementation
and the corresponding Vercel deployment is available. No Vercel CLI deployment is performed.
