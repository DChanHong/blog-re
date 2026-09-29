# Plan 04 — Home Reference Verification

Date: 2026-09-29 (Asia/Seoul)

Verdict: **PASS — approved Home and shared shell scope**

Retention note (2026-09-29): 사용자가 화면 형태를 확인한 뒤 중복 산출물 정리를 승인했다. 아래는 검증 당시의 기록이며, 제거한 중간 캡처·상태 캡처·빌드 로그/경로는 커밋 `5b71b15`에서 복구할 수 있다. 현재 보관 범위는 [보관 안내](../baseline/README.md)를 따른다.

## Scope and method

`portfolio-execute` completed the approved implementation before `portfolio-verify` began. Verification reviewed the complete Plan 04, its implementation log, all 11 source-file deltas against the execution-start snapshot, and the acceptance criteria below. No application code was edited during verification. Earlier uncommitted Plan 03 work was not attributed to Plan 04 or reverted.

- Reference: <https://daehanportfolio.vercel.app/>, observed on the date above.
- Browser: Codex in-app browser, actual reference and local production pages.
- Primary viewports: 1440×900 and 390×844, light and dark. The browser reserves a 15px scrollbar: captured content widths are 1425 and 375px.
- Production QA: task-owned port 3101, isolated source/build snapshot; user's development server on 3000 was not stopped or built over.
- State fixture/capture sink: loopback-only 3102, actual Home/BlogContainer/Section3/Skeleton/Footer rendered with a mocked recent-post read. No DB writes or application test routes.
- Final `final-*` screenshots supersede intermediate `result-*` screenshots. Reference full-page light capture contains the sticky header at its captured scroll position; dark capture and measured header geometry independently establish the header position/size.

## Visual comparison, independent of functional checks

| Item | Reference and result comparison | Result |
| --- | --- | --- |
| Structure | Centered Hero → numbered capabilities → sunken path → outcomes/projects → sunken credentials area → text writing → centered closing CTA → grouped footer | PASS with approved personal-content mappings |
| Main width | Desktop inner 1152px; separate 40px section gutter; Hero inner 896px. Mobile 24px gutter | PASS |
| Header | 65px desktop / 57px mobile including border; max-width 1152 including 32/20px padding; centered desktop navigation, direct mobile links | PASS; existing four-dot brand, Korean labels, no AI control |
| Hero | H1 84px/600/.98/-0.04em desktop and 44px/1.02 mobile; intro 28/21px; padding 176/160 desktop, 96/112 mobile; CTA margin 44, affiliation margin 64 | PASS; original text retained, natural line wraps differ |
| Section rhythm | General padding 160px desktop / 112px mobile; capabilities top 0; writing bottom 0; heading block margin 80/56 | PASS |
| Headings | 64px desktop / 36px mobile, writing desktop 48px; two-tone headings, closing heading all primary ink | PASS |
| Capabilities | Four columns desktop, two intermediate, one mobile; gap 16, radius 28, padding 32, number/title gap 56 | PASS |
| Path | Top rules, year/title/description hierarchy, 4/2/1 grid | PASS; approved four real steps replace reference five |
| Outcomes | Four independent links, large 48/36px values and captions; project grid starts 128/96px below | PASS; metric dates/scopes retained |
| Projects | Two columns ≥768px, one below; gap 16, radius 28, padding 40/32; status → title → summary → two metrics → link. Centered whole-list link | PASS; no icon, colored strip or tech badges |
| Toolkit/education | Text-only two-column desktop / stacked mobile area, approved existing technology groups and one education record | PASS; no invented certification list |
| Writing | Two separator-based rows, title/intro/existing first tag/arrow, no thumbnails; Korean whole-list link retained | PASS |
| Closing/footer | Centered large title, pill/text CTA pair; footer introduction/site/external groups, lower divider/copyright row | PASS; existing GitHub/Velog only |
| Colors/accessibility | Reference surface hierarchy and heading secondary colors; small card text uses accessible `--ink-muted`; footer labels remain 13px rather than reference 11px | Documented accessibility adjustment permitted by plan |

The approved exceptions are Korean/Pretendard, retained brand, no AI/locale controls, actual item counts, absent certifications and existing public links. Content length changes section heights: no content was shortened, duplicated, clipped or fabricated to force equal page height. Long project metrics may naturally wrap on mobile. Reference reveal delays were not reproduced: the complete server-rendered text is immediately visible; hover changes remain restrained. Decorative separator rules are not interactive control boundaries.

Primary evidence:

- [Reference desktop light](../baseline/plan04/reference-light-desktop.jpg), [dark](../baseline/plan04/reference-dark-desktop.jpg)
- [Reference mobile light](../baseline/plan04/reference-light-mobile.jpg), [dark](../baseline/plan04/reference-dark-mobile.jpg)
- [Final desktop light](../baseline/plan04/final-light-desktop.jpg), [dark](../baseline/plan04/final-dark-desktop.jpg)
- [Final mobile light](../baseline/plan04/final-light-mobile.jpg), [dark](../baseline/plan04/final-dark-mobile.jpg)
- [Final first screen](../baseline/plan04/final-light-desktop-top.jpg), [mobile first screen](../baseline/plan04/final-light-mobile-top.jpg)
- [Computed styles and browser observations](../baseline/plan04/browser-checks.json)

## Acceptance criteria

| Criterion | Evidence and verdict |
| --- | --- |
| 1. Approved order | Seven semantic Home sections and footer; order asserted in HTTP report. PASS |
| 2. Visual reconstruction | Actual matched-viewport comparison above, computed dimensions and full-page captures; old boxed Hero/image grid absent. PASS |
| 3. Original content mapping | 4 capabilities, 4 steps, 4 metrics, all 4 projects in order, maximum 2 recent articles. PASS |
| 4. Facts preserved | All `src/data`, types, service/repository/API, ProjectShowcase and PostCard source hashes unchanged. `출시 보류` remains explicit. PASS |
| 5. Exceptions only | Reference identity/new mail/locale/AI controls absent; accessibility and static-reveal differences explicitly recorded above. PASS |
| 6. Shared shell regression | 9 paths × 2 themes × 2 primary sizes: Work, four projects, Resume, Writing, representative article and `/ask` 404. Single main, correct active navigation, no horizontal overflow. Search/tag/page query and legacy resume fragment work. PASS |
| 7. States/accessibility | Real-component 0/1/2/error/loading fixtures in both themes; Korean distinct empty/error messages and whole-list link; loading status/decorative rows. Skip link reaches `main-content`; keyboard focus is 2px accent outline with 3px offset. 320/768/1024 widths and 200% controlled zoom have no page overflow. PASS within method below |
| 8. Routes/SEO/security | 308 redirects/query, unknown project and protected routes 404, FAQ mutation 405; metadata/JSON-LD/sitemap/robots and source contracts preserved. No API/DB/deployment changes. PASS |
| 9. Commands | Isolated build, post-build TypeScript, diff and all changed TSX focused lint pass; unchanged global lint failure separately recorded. PASS under approved baseline exception |
| 10. Separate verdict | Implementation handed off as Pending Verification; this independent functional/visual audit issues PASS. Does not assert whole-site redesign completion. PASS |

## Browser details and limits

- [Browser observations](../baseline/plan04/browser-checks.json) include 36 shell cases, breakpoint sweeps, theme reload persistence, skip link, writing pagination/tag/search, `/career#realtime-support` → `/resume#realtime-support`, Home CTA, ten state/theme cases and final four Home cases. Final production browser error/warning log was empty.
- Sampled text contrast checks passed: minimum large secondary heading 3.04:1; ordinary small text minimum 4.73:1. Main focus/accent uses the unchanged accessible theme token. Text-only status labels convey state without color dependence.
- Enlargement used a **controlled local fixture with CSS `zoom:2` at 1440×900**, not OS/native browser zoom. Home and Footer remained readable with scrollWidth equal to clientWidth. Actual shared Header was separately tested down to 320px; theme control and navigation were exercised on the real app.
- Reduced-motion inspection combined the unchanged global `prefers-reduced-motion` rules with a controlled fixture disabling animations/transitions. New Home has no delayed reveal or animated skeleton, all seven sections remain opacity 1, and fixture reports zero animations. This is not a claim that the user's OS preference was changed or all browser engines were tested.
- Archived Loading (`../baseline/plan04/final-fixture-dark-loading.jpg`; checkpoint `5b71b15`), Archived error (`../baseline/plan04/final-fixture-light-error.jpg`; checkpoint `5b71b15`), Archived empty (`../baseline/plan04/final-fixture-empty.jpg`; checkpoint `5b71b15`), Archived 200% (`../baseline/plan04/final-fixture-zoom-200.jpg`; checkpoint `5b71b15`). Skeleton has the same frame and two row placeholders as the loaded list; variable article lengths can still change height. No claim of measured zero CLS is made.
- No AI component is mounted or newly imported in the active shell/Home, and the previously verified active client graph is unchanged except display-only Home replacement. Static/DOM inspection establishes no automatic AI caller in this scope; this audit did **not** collect a new browser network trace or invoke AI endpoints.
- This is local verification only. No Vercel or production-service verification, migration, crawler, `verify:security`, commit or push was run.

## Commands and preservation

```text
git diff --check                                              exit 0
npm run lint                                                 exit 2 (existing plugin baseline)
node doc/projects-reorganization/audit/04-workspace.cjs build   exit 0 (npm run build, 118 static pages)
node doc/projects-reorganization/audit/04-workspace.cjs typecheck exit 0 (npm exec -- tsc --noEmit)
node doc/projects-reorganization/audit/04-workspace.cjs lint    exit 0 (8 TSX, 0 errors, 0 warnings)
node doc/projects-reorganization/audit/04-workspace.cjs preserve exit 0
node doc/projects-reorganization/audit/04-http-check.cjs        exit 0 (56 passed, 0 failed)
```

- Final build snapshot: `portfolio-plan04-build-ThEvtB`. Archived Build log (`../baseline/plan04/build.log`; checkpoint `5b71b15`), Archived workspace (`../baseline/plan04/build-workspace.json`; checkpoint `5b71b15`), [lint](../baseline/plan04/lint.json), [HTTP](../baseline/plan04/http.json), [states](../baseline/plan04/states.json), [preservation](../baseline/plan04/preservation.json).
- Production browser/HTTP used the immediately preceding final-source snapshot `portfolio-plan04-build-IhUx7h`; source hashes of both final-source snapshots and working tree agree. Repeated final verification build and post-build tsc passed.
- Entire repository lint stops before analysis because `eslint-plugin-prettier` is missing, exactly as Plan 03. Build reports the same lint warning but exits 0. No dependency/config changes; all eight changed/new TSX files pass focused Next core-web-vitals/TypeScript rules without warnings. This is **not** a repository-wide lint pass.
- Original source snapshot is identified in [before.json](../baseline/plan04/before.json). Plan 04 changes only 11 application files; protected-path violations and build mismatches are both empty. Additional byte comparison of 108 public/style/config/dependency files against the execution-start snapshot found zero mismatches. Existing package scripts have no targeted Home test suite; the local component/HTTP/browser checks supply targeted coverage.
- Existing unknown-project `NoFallbackError` may be logged by Next while correctly returning 404; same Plan 03 baseline, not a new regression.
- Initial restricted-network build could not resolve Google Fonts for the existing Geist dependency; the permitted isolated build succeeded without dependency changes. Early fixture/capture-selector issues were test-harness issues, corrected before final evidence; they did not change app data or relax acceptance criteria.

## Handoff

Home changes are visible at <http://localhost:3000/>: 7 sections, 4 projects, 2 recent articles and new Header/Footer confirmed in the development browser. Plan 03 and Plan 04 remain uncommitted. No next plan is approved; the next candidate is a separately interviewed Work/Project visual reconstruction, then Resume and Writing/Blog. Career content revision stays after the UI work.
