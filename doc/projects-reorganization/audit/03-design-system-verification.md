# Plan 03 — Design System and Global Shell

Date: 2026-09-29 (Asia/Seoul)

Status: Verified — PASS (isolated local production)

## Scope and implementation

- Approved plan: [03-design-system-and-global-shell.md](../plan/03-design-system-and-global-shell.md). Baseline commit: b213173. Plan 00–02 were Verified.
- Added semantic light/dark tokens, Korean/Latin Pretendard, saved/system theme, inline sticky header, single main and skip link, normal-flow footer, shared link/button controls.
- Adapted all active page templates and loading/empty/error/404 states, code/table/blockquote styles and reduced motion. Kept content, page section order, projects, routes, SEO and database boundaries.
- Removed only unused mini-navbar and MobileNav after checking references; recoverable from Git. The old CTA path remains a thin shared-button wrapper for inactive consumers. No AI cleanup or restoration.
- Existing Plan 02 screenshots serve as before evidence. After screenshots and machine-readable reports are in [baseline/plan03](../baseline/plan03/). No Plan 02 evidence was overwritten.

## Reproduction

Run from the repository root:

```sh
node doc/projects-reorganization/audit/03-isolated-build.cjs build
node doc/projects-reorganization/audit/03-isolated-build.cjs typecheck
node doc/projects-reorganization/audit/03-isolated-build.cjs start
# In another terminal, with port 3101 running:
node doc/projects-reorganization/audit/03-regression-check.cjs
node doc/projects-reorganization/audit/03-design-system-check.cjs
node doc/projects-reorganization/audit/03-preservation-check.cjs
node doc/projects-reorganization/audit/03-focused-lint.cjs
npm run lint
git diff --check
```

The wrapper executes the unchanged npm run build/start and tsc commands in an exact temporary source snapshot. It copies only source/config/public files, reuses node_modules and symlinks local .env files without printing or copying their contents. Production .next is isolated from the user's existing 3000 development server. build-workspace.json records an ephemeral local path; regenerate it with the build command on another machine. Do not commit temporary builds or credentials.

The browser scripts use installed Puppeteer Core and macOS Chrome. No new package or framework was installed. All runtime targets are local; network reads are limited to existing public article reads/images and official font acquisition. No migration, verify:security, Vercel deployment or production application checks.

## Evidence by acceptance criterion

| Criterion | Evidence |
| --- | --- |
| 1. Tokens/fonts/fallback | CSS/Tailwind tokens; CDP confirms Pretendard Variable custom glyphs. Blocking WOFF2 switches Korean heading to Apple SD Gothic Neo. Geist Mono remains for code. |
| 2. Theme and states | System light/dark, live system change, effective-theme toggle, storage priority, route/reload persistence, first paint and blocked storage checks. Both themes for loading/empty/error/retry and real article component's missing-body branch. |
| 3. Header | Existing four-dot symbol/name, three Korean inline links and Korean theme names. Active parent menu on project/article details. 320/390/768/1024/1440 viewport checks. |
| 4. Footer | Static normal-flow position, main-bottom alignment, existing name/position, exactly three internal links and existing GitHub/Velog URLs. No new email/LinkedIn. |
| 5. Layout | Max 1152px including gutter; article max 640px; single focusable main. No page horizontal overflow across checked routes, boundaries, layout zoom equivalent and 200% text enlargement. Internal pre/table/nav scrolling is retained. |
| 6. Accessibility | Actual keyboard skip/project/theme/search/category/pagination/retry/reverse-tab checks; reduced-motion content visible, animations none; measured contrast samples in design-checks.json. |
| 7. Preservation | 54-check regression plus preservation-check: original exported content deep-equal, four projects/order/status/featured/full detail fields, legacy redirects/query/hash, navigation, metadata declarations, sitemap/robots. API/data/SEO helper/migrations/dependencies unchanged. |
| 8. Scope/security | AI automatic requests 0; no new AI/locale UI. Removed security routes stay 404 and FAQ POST stays 405. No external writes. |
| 9. Commands | Build/TypeScript/diff and focused lint records below; existing global lint failure distinguished. |
| 10. Handoff | Implementation log, scripts, font manifest/hashes, screenshots and final verification log retained in the plan and NEXT_STEPS. |

## Commands and baseline

- npm run build: successful, 118 static pages. Initial in-repo build and subsequent isolated builds succeeded.
- Build-following tsc --noEmit: successful. Final isolated snapshot also typechecks.
- npm run lint: exit 2, same pre-existing missing eslint-plugin-prettier. This is not a global lint pass.
- Focused next/core-web-vitals and next/typescript: all 34 changed/new TS/TSX files, 0 errors, one pre-existing PostCard img warning. Collection uses --no-renames plus untracked new files. [lint.json](../baseline/plan03/lint.json)
- git diff --check and node --check for all Plan 03 CJS tools: successful.
- Exact build snapshot preservation check covers source/styles/public files, metadata/static-param declarations and unchanged API/data/DB/dependency areas. [preservation.json](../baseline/plan03/preservation.json)
- Regression: 54/54 with browser page errors 0 and AI requests 0. [regression.json](../baseline/plan03/regression.json)
- Design matrix: **49/49 PASS**, page/hydration errors 0, automatic AI requests 0. [design-checks.json](../baseline/plan03/design-checks.json). All 28 theme×page×primary-viewport cases, six additional project cases, six boundary sweeps, and nine behavior/state checks passed.

## Font and contrast measurements

- Official Pretendard v1.3.9, unmodified variable WOFF2 subsets; OFL 1.1 and source recorded in public/fonts/pretendard. [Official source](https://github.com/orioncactus/pretendard/tree/v1.3.9).
- 92 compressed WOFF2 files: 2,957,724 bytes (~2.82 MiB) total. Home requested 14 subsets: 368,384 bytes (~360 KiB), not all 92. Per-file SHA-256/bytes: [fonts.json](../baseline/plan03/fonts.json).
- Local Unicode-range CSS: 55,485 bytes; gzip 13,662 bytes. font-display: swap, Korean fallback and no runtime font-CDN request.
- Actual sampled text minimum contrast: 4.88:1. Normal text/placeholder/status/selected-filter/code/table samples exceed 4.5; large text exceeds 3.
- Search input boundary: light 3.67:1, dark 4.13:1. Focus versus page surface: light 5.47:1, dark 7.54:1.
- Card separators/skeleton shapes are decorative, not sole control affordances. Disabled pagination is excluded from active-text requirements; labels and semantic state remain. Status meaning is always also expressed in text.

## Diagnostic history and retained limitations

- Initial production/dev output collision produced main-app.js 404/hydration absence on dynamic pages. Tests were stopped; all production QA moved to isolated source snapshots without changing Next configuration or stopping the user's 3000 process.
- Early networkidle0 navigation timeouts involved external article images. The design harness now waits for DOM, hydrated theme, actual writing cards/fonts and bounded network quiet with up to two in-flight resources. Application runtime exceptions are still failures.
- 200% text enlargement exposed an overflowing WebSocket metric label. Implementation corrected dt word wrapping and small-screen metric minimum widths before final verification. The final 200% check passes.
- An early harness added an unapproved universal 0.1 layout-shift gate and flagged Writing mobile (~0.12017). The approved plan requests font/layout-shift inspection, not an all-page performance redesign. Source attribution identifies the list moving as asynchronous sidebar tags appear. Blocking all Pretendard requests still yields ~0.12017, demonstrating this is not a font-swap regression. The gate was corrected to retain the measurement instead of silently claiming zero shift. [Controlled font-blocked observation](../baseline/plan03/writing-font-blocked-shift.json). Sidebar loading stability remains a Writing/performance follow-up.
- The previous unknown-project server NoFallbackError log remains; HTTP 404, Korean recovery page and browser behavior are correct. No new runtime page/hydration errors were observed in the isolated production tests.
- Plan 03 is the common foundation, not a completed page-specific redesign. No career text rewrite, commit, push or deployment was performed.

## Final verification — 2026-09-29

Verdict: **PASS** for the approved implementation in the isolated local production environment. The complete approved plan, implementation log, baseline b213173 diff, file list, steps and ten criteria were reviewed. Verification changed only documentation and test/evidence files, not implementation code. The global lint exception is limited to the unchanged missing plugin and supported by all 34 changed/new TS/TSX passing focused rules.

Visual review covered mobile and desktop light/dark Home, Work, Project, Resume, Writing, article and 404, additional project states, narrow boundaries, enlarged text, code/table and loading/error/empty states. Existing text and images were retained. The sampled contrast minimum is 4.88:1; no page overflow or inaccessible primary control was found. First theme paint and keyboard navigation passed, including category/pagination and reverse Tab.

### Existing development-server recovery

The original port-3000 process initially remained running pending approval. A read-only check found HTTP 500 due to an absent .next/server/vendor-chunks/tailwind-merge.js in the mixed dev/build cache; the isolated production build did not have this error.

On 2026-09-29 the user explicitly approved restarting it (“재시작해줘”). The exact project directory and next-dev parent process were checked before graceful SIGTERM. After port 3000 was released, npm run dev -- -p 3000 started successfully. No source, configuration, dependency or environment-variable value was changed, and no cache directory was deleted.

Recovery verification passed: Home, Work, Writing, Resume and representative Project return HTTP 200 and hydrate the theme control; Writing loads actual article cards; theme toggle persists after reload; browser page errors are empty. [Recovery report](../baseline/plan03/dev-server-recovery.json), [recovered screen](../baseline/plan03/dev-server-recovered.png). Source/styles/public still match the fully verified production snapshot, and git diff --check passes. The 3000 development server is left running; the task-owned 3101 verification server is stopped after QA. No recovery blocker remains.
