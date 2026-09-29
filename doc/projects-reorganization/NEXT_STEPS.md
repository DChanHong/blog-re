# Portfolio Reorganization — Next Steps

Updated: 2026-09-29 (Asia/Seoul)

## Current State

- Branch: `develop`
- Latest implementation commit: `fa21c48 fix: secure production data boundaries`
- Plan 00: `Verified`
- Plan 01: `Verified` (operational application verification excluded by user decision)
- Plan 02: `Approved` — `plan/02-information-architecture-and-content-model.md`
- Plans after 02 have not been written yet.
- The working tree was clean immediately after commit `fa21c48`.

## What Is Already Complete

- The Plan 01 production Supabase migration was applied successfully twice.
- Production row counts were preserved during migration:
  - `velog=97`
  - `chatbot_faq=15`
  - `chatbot_rate_limit=6`
  - `chatbot_conversations=8`
  - `chatbot_settings=1`
- Anonymous/authenticated access to sensitive Chatbot tables was removed.
- Anonymous/authenticated access to `velog` and `chatbot_faq` is SELECT-only.
- Required RLS policies, grants, and indexes were verified.
- Public crawler/test routes, FAQ hit mutation, and public API Docs routes were removed in code.
- Local build, route smoke tests, TypeScript, and the security regression script passed.
- Repository-wide lint still stops at the pre-existing missing `eslint-plugin-prettier` baseline recorded in Plans 00 and 01.

Do not reapply or roll back the production migration merely because work continues on another computer. Plan 01 uses a security-preserving roll-forward policy.

## Required Next Action: Implement Plan 02

- On 2026-09-29 the user explicitly removed production application verification as a completion requirement and requested proceeding to Plan 02.
- Plan 01 is verified using the completed local checks and existing DB security evidence under its revised acceptance criteria.
- Vercel deployment, production route/security smoke, and deployment waiting are not prerequisites for continuing the reorganization. Do not add these gates to subsequent plans unless the user requests them.
- Retain the historical production observations in the audit artifact; completion does not assert that the production application has been updated.
- The user approved Plan 02 on 2026-09-29. Run `$portfolio-execute` with `doc/projects-reorganization/plan/02-information-architecture-and-content-model.md`, then hand off to `$portfolio-verify` for local verification.

Relevant files:

- `doc/projects-reorganization/plan/02-information-architecture-and-content-model.md`
- `doc/projects-reorganization/plan/01-production-security-and-schema-alignment.md`
- `doc/projects-reorganization/audit/production-security-verification.md`
- `migrations/20260928_production_security_schema_alignment.sql`
- `scripts/verify-production-security.mjs`

## Approved Chatbot Exception

The OpenAI Assistants API was shut down on 2026-08-26. The existing `/api/chatbot/ask` implementation therefore receives an upstream 404 and returns 500.

The user approved the following handling:

- Do not expand Plan 01 into an OpenAI API migration.
- Treat the Supabase service-role boundary as the Plan 01 responsibility.
- Defer Chatbot response restoration and migration to the Responses API to `06-ask-chatbot-decision-and-implementation.md`.
- Do not restore public access to sensitive Supabase tables as a workaround.

## Plan 02 Decisions

The approved Plan 02 is the implementation contract for routes, content ownership, navigation, Korean-only UI, and complete AI UI removal. Implement it with `$portfolio-execute`; use the full plan rather than this handoff alone.

## Plan 02 Interview Decisions — 2026-09-29

These confirmed decisions are now incorporated in the approved Plan 02.

- Match the reference route structure: `/`, `/work`, `/project/[slug]`, `/resume`, `/writing`, and existing `/blog/[slug]` article URLs. AI is explicitly excluded from the current release.
- Use permanent redirects from `/career` to `/resume` and from the exact `/blog` list route to `/writing`, preserving list query parameters. Article URLs remain unchanged.
- Keep career and project content in typed source files, split their ownership, and reuse the same project records across Home, Work and project detail pages. Keep writing content in the existing Supabase `velog` table; no content DB migration is requested.
- Support Korean only. Use Korean navigation and interface labels; do not add a locale switch or translated article copies. Existing technology names and career facts remain intact.
- Defer AI to Plan 06 and remove all AI UI entry points, including the global floating chatbot, question controls and related navigation/CTA text. Do not create `/ask` in this phase. Preserve existing backend code and stored data for later review.
- Keep existing career and project content unchanged, including the four projects, their metrics, status and featured selection. Complete the UI improvements first; revisit career content in a separate later work unit.
- Plan 02's scope and final approval are complete. Full visual redesign follows the information architecture/data foundation work; career content revision follows the UI improvements.

## Security Notes

- Never commit `.env`, database URLs, database passwords, Supabase keys, OpenAI keys, JWTs, assistant/thread identifiers, messages, IP addresses, or User-Agent values.
- Copy secrets to the other computer through a secure secret manager or manually recreate its local `.env`.
- Use the Session pooler connection string on port 5432 if `DATABASE_URL` is needed and the network cannot reach Supabase direct IPv6 connections.
- Do not run destructive database commands, restore public sensitive-table policies, or use Vercel CLI deployment as part of this handoff.
