# Production Security Verification

- Plan: `01-production-security-and-schema-alignment.md`
- Target: production Supabase and local application
- Started: 2026-09-29 (Asia/Seoul)
- Status: Verified under revised scope; production application deployment verification excluded by user decision on 2026-09-29

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

## Original Deployment Gate — Superseded

Production application route checks remain pending until the user pushes the implementation
and the corresponding Vercel deployment is available. No Vercel CLI deployment is performed.

## Verification Attempt — 2026-09-29

- Repository: `develop` and `origin/develop` both point to handoff commit `1d979d8`, which contains implementation commit `fa21c48`; worktree was clean before verification.
- Environment preflight: all required Supabase variables and `DATABASE_URL` were present without printing their values.
- `git diff --check`: success.
- `npx tsc --noEmit`: success.
- `npm run build`: success; 111 static pages generated and removed routes absent from the route manifest.
- `npm run lint`: exit 2 at the previously recorded missing `eslint-plugin-prettier` baseline; no new lint category was reached.
- Local `npm run verify:security`: success. Public table counts matched the snapshot, sensitive anon reads were blocked, service-role counts matched, removed routes returned 404/405, and FAQ GET returned 200.
- Local core smoke: Home, Blog, Career, Chatbot categories, recent Velog posts, Blog posts, and robots returned 200. Robots retained `/api/` disallow and omitted the redundant `/api-docs` rule.
- Production database catalog recheck: row counts remained `velog=97`, `chatbot_faq=15`, `chatbot_rate_limit=6`, `chatbot_conversations=8`, `chatbot_settings=1`; RLS was enabled on all five tables; public policies/grants were SELECT-only on `velog` and `chatbot_faq`; all seven required indexes were present; `chatbot_faq_log` remained absent.
- Production core smoke: Home, Blog, Career, Chatbot categories, recent Velog posts, Blog posts, FAQ GET, and robots returned 200.
- Production application security regression: failed because the deployed application still exposes the pre-Plan-01 routes. Observed `GET /api/velog/crawl` 200, `POST /api/velog/crawl` 405, `GET /api/velog/test-detail` 200, `POST /api/chatbot/faqs` 500, `GET /api-docs` 200, and `GET /api-docs/v1` 200.
- Production robots still contains the redundant `/api-docs` disallow while retaining `/api/` disallow, confirming that the Plan 01 application deployment is not active on the production domain.
- Verdict: failed at the deployment gate. Plan status remains `Implemented - Pending Verification`; implementation code was not changed and no production migration was reapplied.

## Revised Verdict — 2026-09-29

- The user explicitly removed production application verification and requested proceeding to Plan 02.
- The historical observations above remain accurate; the deployment gate no longer applies to completion.
- Local build, TypeScript, route/security regression, robots and core smoke passed. The recorded lint baseline remains unchanged. Existing production DB security and preservation evidence is retained.
- Plan 01 is `Verified` against the revised acceptance criteria. This verdict does not assert that the production application contains the implementation.
- No additional production verification, deployment, migration, or implementation changes were performed for this scope revision.
