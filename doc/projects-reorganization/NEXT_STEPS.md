# Portfolio Reorganization — Next Steps

Updated: 2026-09-29 (Asia/Seoul)

## Current State

- Branch: `develop`
- Current implementation checkpoint: Plan 03 design system and Plan 04 reference Home; resolve its commit hash with `git log -1` after this checkpoint is committed.
- Plan 00: `Verified`
- Plan 01: `Verified` (operational application verification excluded by user decision)
- Plan 02: `Verified` — `plan/02-information-architecture-and-content-model.md`
- Plan 03: `Verified` — `plan/03-design-system-and-global-shell.md`
- Plan 04: `Verified` — `plan/04-home-reference-reconstruction.md`; Home reference reconstruction and shared Header/Footer corrections complete.
- Plans after 04 have not been written yet.
- Plan 02 verification and handoff artifacts were committed as `b213173`; the working tree was clean before writing Plan 03.

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

## Next Action: Incremental UI Refinements

- Plan 04 was implemented with `$portfolio-execute` and separately verified with `$portfolio-verify` on 2026-09-29. Final verdict PASS; see `audit/04-home-reference-verification.md`.
- The user approved Plan 04 on 2026-09-29 with “확정”. The goal is matching the reference Home's design and composition, replacing only personal content, not merely borrowing its visual style.
- Reconstruct Home and correct Header/Footer fidelity. Preserve Korean/Pretendard, existing branding, no AI/language UI, existing career/project facts and public links. Keep four actual growth steps and omit unavailable certifications; use four projects and two recent text-only article previews.
- Actual reference/result desktop/mobile light/dark captures, measured dimensions and behavioral evidence are in `baseline/plan04/`. Build/tsc/diff and all 8 changed TSX focused lint checks passed; local HTTP/state checks passed 56/56. Global lint still has the unchanged missing-plugin baseline. Controlled zoom/reduced-motion methods and accessibility differences are explicitly recorded in the audit.
- The user inspected Home and confirmed that this is the desired form on 2026-09-29, then requested committing the completed work before making incremental refinements.
- This checkpoint includes Plan 03 and Plan 04 implementation, plans and verification evidence. Home remains available at `http://localhost:3000/`; no push, deployment or DB write is included. User development server remains running.
- Commit-time staged whitespace check passes excluding the preserved raw build log and upstream Pretendard LICENSE/README/CSS, which contain trailing whitespace or extra EOF blank lines. These artifacts were retained without content changes; no application logic changed during the commit step.
- No next plan is approved. Use `$portfolio-plan-interview` for Work/Project reference reconstruction as a new work unit, then Resume and Writing/Blog. Do not automatically start those implementations.
- Other page bodies remain separate follow-up plans; shell changes require regression checks on them.

- On 2026-09-29 the user explicitly removed production application verification as a completion requirement and requested proceeding to Plan 02.
- Plan 01 is verified using the completed local checks and existing DB security evidence under its revised acceptance criteria.
- Vercel deployment, production route/security smoke, and deployment waiting are not prerequisites for continuing the reorganization. Do not add these gates to subsequent plans unless the user requests them.
- Retain the historical production observations in the audit artifact; completion does not assert that the production application has been updated.
- Plan 02 was approved, implemented and verified on 2026-09-29. The final `$portfolio-verify` verdict is PASS; see the audit below.
- New Work/Project/Resume/Writing routes, redirects, Korean navigation, split typed content and removal of active AI UI are implemented. Existing career/project facts and blog data contracts are preserved.
- Local build, TypeScript and diff checks passed. The browser/HTTP/content/SEO script passed 54 checks and supplementary checks passed 4. Global lint remains blocked by the existing missing plugin; scoped Next rules covered all 32 changed/moved TS/TSX files with no errors and one pre-existing image warning.
- Plan 03 was approved, implemented and verified on 2026-09-29. Common tokens, Pretendard, light/dark themes and global shell are complete. Regression 54/54 and design/behavior 49/49 passed; build/TypeScript/diff passed. Global lint retains the same plugin baseline; all 34 changed/new TS/TSX passed focused rules with one existing image warning.
- Plan 03 implementation, planning and evidence are included in the same checkpoint as Plan 04. No push or deployment was performed.
- The user approved restarting the existing port-3000 development server. It was gracefully restarted on 2026-09-29 and recovered: Home, Work, Writing, Resume and representative Project all return 200; writing hydration/data loading and theme toggle/reload persistence pass with no browser page errors. See baseline/plan03/dev-server-recovery.json. Port 3000 remains available; the temporary production verification server is no longer needed.
- Plan 03 covers light/dark themes with system fallback and saved preference, Pretendard, shared tokens/container/controls, inline mobile navigation, a normal-flow footer, accessibility and theme adaptation of all active pages/states. Existing content, routes, SEO and DB contracts remain unchanged.
- Home page-specific visual reconstruction is complete under Plan 04. Other page-body redesign and career-content revision remain future work. The prior Plan 03 verdict did not assert reference Home equivalence; Plan 04 provides that separate approved-scope comparison. No plan after 04 is approved for implementation.

Relevant files:

- `doc/projects-reorganization/plan/04-home-reference-reconstruction.md`
- `doc/projects-reorganization/audit/04-home-reference-verification.md`
- `doc/projects-reorganization/baseline/plan04/browser-checks.json`
- `doc/projects-reorganization/plan/03-design-system-and-global-shell.md`
- `doc/projects-reorganization/audit/03-design-system-verification.md`
- `doc/projects-reorganization/baseline/plan03/design-checks.json`
- `doc/projects-reorganization/plan/02-information-architecture-and-content-model.md`
- `doc/projects-reorganization/audit/02-information-architecture-verification.md`
- `doc/projects-reorganization/audit/02-information-architecture-check.cjs`
- `doc/projects-reorganization/baseline/plan02/checks.json`
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

Plan 02 is verified for routes, content ownership, navigation, Korean-only UI, and complete active AI UI removal. Use the full plan and final audit evidence rather than this handoff alone.

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
