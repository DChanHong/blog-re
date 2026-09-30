# Plan 06 Resume verification

Date: 2026-09-30

Verdict: PASS (existing global lint dependency failure retained)

## Commit retention — 2026-09-30

사용자 확인 후 검증 이미지와 일회성 JS를 커밋에서 제외하도록 승인받았다. 아래 명령은 당시 실행 기록이다. `06-*.cjs`, 캡처 4장, `build.log`, `build-workspace.json`, `before.json`은 로컬에만 남기고 `.gitignore`로 제외한다. Git에는 최종 검증 문서와 `browser-checks.json`, `extra-checks.json`, `lint.json`, `preservation.json`만 보관한다. 새 checkout에는 로컬 스크립트·캡처·임시 빌드가 제공되지 않는다.

## Scope and evidence

- Reviewed the complete approved plan, implementation log, actual tracked diff and two new application files. Only `src/app/resume/ResumePage.tsx`, `src/app/resume/page.tsx`, `src/app/resume/resume.module.css`, `src/data/resume.ts` changed under src. `baseline/plan06/preservation.json` compares HEAD and current source hashes, and confirms final built source matches the checkout.
- Compared the user's reference screenshots with 1440px and 390px light/dark full-page captures. Single rounded document, title/contact row, identity divider, restrained headings, bullet experience, muted tools block, education and dates reproduce the requested visual structure. Korean text and six experience groups increase page height; personal project and education replace unavailable credentials. Shared header/footer are unchanged.
- Desktop period is right-aligned and mobile period is below title. Four representative screenshots retained; mobile top crops inspected at readable resolution in temporary storage only.

## Acceptance audit

| Requirement | Result / evidence |
| --- | --- |
| Reference document UI | PASS — 1 article, no old metric tiles or sticky career nav; visual inspection of 4 captures |
| Approved wording | PASS — summary, 6 work entries (4/3/2/2/2/1 bullets), 2 personal-project bullets, 4 technology groups, training and education |
| Fact boundaries | PASS — existing npm package, 1-year DB consultation count, synthetic DB test (not notification receipt), SNN admin scope, existing Go server, MSA development QA, KBO under development, training attendance not certification |
| Privacy | PASS — no added phone/address/salary/birthdate; original supporting documents not copied into repo |
| Responsive and accessibility | PASS — 1440/390/320/640/768/1024/720 widths × both themes; no horizontal overflow, single main/H1, keyboard contact focus, no document animation, reduced-motion and no-JS readable |
| Compatibility | PASS — 11 old section/project fragments exist, representative deep anchor is visible after navigation; 6 project links 200, `/career` 308 to `/resume`, mail/profile hrefs preserved |
| SEO | PASS — description/keywords intentionally revised; canonical/title/OG image/robots and JSON-LD construction retained; OG/Twitter/JSON-LD descriptions consistent; sitemap contains Resume |
| Unrelated surfaces | PASS — unchanged source hashes, Home/Work/Writing/project/sitemap/robots HTTP smoke |

## Commands and results

- `npx tsc --noEmit --incremental false`: PASS, repeated at final verification.
- `node doc/projects-reorganization/audit/06-workspace.cjs lint`: PASS, all 3 changed/new TS/TSX files, 0 errors and warnings.
- `npm run lint`: existing exit 2, missing `eslint-plugin-prettier`. Matches Plan 05 baseline; no dependency edits.
- `node doc/projects-reorganization/audit/06-workspace.cjs build`: isolated `npm run build` PASS, 120 pages. Initial sandbox attempt could not fetch Google Geist Mono; allowed-network rerun completed. Existing lint plugin warning remains in build output, build exit 0.
- Post-build `npm exec -- tsc --noEmit --incremental false`: PASS.
- `RESUME_TEST_ORIGIN=http://127.0.0.1:3106 node doc/projects-reorganization/audit/06-browser.cjs`: 51/51 PASS.
- `node doc/projects-reorganization/audit/06-extra.cjs`: 12/12 PASS. Initial script used a nonexistent theme-button label; corrected the test selector to the unchanged actual label, no app change.
- `node doc/projects-reorganization/audit/06-workspace.cjs preserve`: zero out-of-scope changes and build mismatches.
- `git diff --check`: PASS.

## Limitations and handoff

- Current-state operation numbers are sourced from reviewed applications/interviews, not independently remeasured from private production systems.
- 720px covers 1440px-at-200%-equivalent reflow, not native browser zoom.
- Static Resume needs no loading/error/empty data fetching UI. Shared theme persistence also verified.
- The existing port-3001 dev server returned a page without H1 during repeated navigation; final tests used the isolated production build on 3106. No existing server was terminated or restarted. Port 3000 belongs to another project.
- Preview retained at `http://127.0.0.1:3106/resume` for user review. No deployment, commit, push, DB write, source document edits or new dependencies.
- No new follow-up plan is approved. Other pages' career wording remains unchanged by design.
