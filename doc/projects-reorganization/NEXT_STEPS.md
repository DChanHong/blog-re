# Portfolio Reorganization — Next Steps

Updated: 2026-09-29 (Asia/Seoul)

## Current State

- Branch: `develop`
- Latest implementation commit: `fa21c48 fix: secure production data boundaries`
- Plan 00: `Verified`
- Plan 01: `Implemented - Pending Verification`
- Plans after 01 have not been written yet.
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

## Required Next Action: Finish Plan 01

1. On the other computer, fetch/checkout the repository and confirm commit `fa21c48` is present.
2. If the commit has not been pushed yet, push the `develop` branch to GitHub.
3. Wait for the matching Vercel deployment to finish. Do not deploy with the Vercel CLI; use the repository's normal GitHub/Vercel flow.
4. Configure the required environment variables locally without committing them:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL` only when direct database metadata verification is required
5. Run `$portfolio-verify` with:
   - `doc/projects-reorganization/plan/01-production-security-and-schema-alignment.md`
6. Verification must include production route checks after the deployment:
   - `GET /api/velog/crawl` → 404
   - `POST /api/velog/crawl` → 404
   - `GET /api/velog/test-detail` → 404
   - `POST /api/chatbot/faqs` → 405
   - `GET /api-docs` → 404
   - `GET /api-docs/v1` → 404
   - `GET /api/chatbot/faqs` → 200
   - `robots.txt` retains `/api/` disallow and has no redundant `/api-docs` rule
7. Run `npm run verify:security`, `npm run build`, and the Plan 01 verification checks.
8. Only `$portfolio-verify` should change Plan 01 from `Implemented - Pending Verification` to `Verified` after all acceptance criteria pass.

Relevant files:

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

## After Plan 01 Is Verified

Use `$portfolio-plan-interview` to create and approve the next plan before changing application structure.

The intended next work unit is Plan 02, information architecture and content model. It should decide:

- Home, Work, Project, Resume, Writing, and Ask route ownership
- Existing `/career`, `/blog`, and `/blog/[slug]` preservation or redirect strategy
- Career/project/blog content ownership and mapping
- Navigation and page responsibilities
- Whether the Chatbot/Ask migration remains at Plan 06 or should be reprioritized

After Plan 02 is approved, implement it with `$portfolio-execute`. Do not begin Plan 02 implementation from this handoff document alone.

## Security Notes

- Never commit `.env`, database URLs, database passwords, Supabase keys, OpenAI keys, JWTs, assistant/thread identifiers, messages, IP addresses, or User-Agent values.
- Copy secrets to the other computer through a secure secret manager or manually recreate its local `.env`.
- Use the Session pooler connection string on port 5432 if `DATABASE_URL` is needed and the network cannot reach Supabase direct IPv6 connections.
- Do not run destructive database commands, restore public sensitive-table policies, or use Vercel CLI deployment as part of this handoff.
