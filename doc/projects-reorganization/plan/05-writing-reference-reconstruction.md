# 05. Writing Reference Reconstruction

Status: Verified

Approved: 2026-09-30 (Asia/Seoul)

## Goal

`/writing`을 레퍼런스의 대형 2행 제목, 넓은 여백, 이미지 없는 구분선형 글 목록으로 재구성한다. 본인 콘텐츠와 기존 탐색 기능은 유지하고 홈의 타이포·모션과 연결한다.

## References

- https://daehanportfolio.vercel.app/writing — 실제 desktop/mobile 확인 완료, 개인 콘텐츠·언어 UI는 복사하지 않음.
- `doc/portfolio-reference/README.md`
- `doc/portfolio-reference/02-page-templates.md` — Writing
- `doc/portfolio-reference/03-design-system.md`
- `src/app/writing/page.tsx`, `src/app/writing/WritingListPage.tsx`
- `src/components/domain/blog/PostCard.tsx`, `src/components/ui/Pagination.tsx`
- `src/components/domain/home/SectionEntrance.tsx`
- `src/types/blog.ts`, `src/actions/blog.ts`, `src/lib/repositories/blogRepository.ts`

## Current State

Plan 00–04 Verified. 작업 시작 HEAD는 `98f3e65`, 작업 트리는 깨끗하다. 현재 목록은 97개 글을 최신순 9개씩 조회하며 썸네일 카드와 검색/카테고리/태그 사이드바를 제공한다. 카테고리는 첫 태그에서 추출하지만 기존 조회는 해당 태그 포함 조건이다. 이를 이번에 재정의하지 않는다. 기존 글 상세 및 SEO는 유지한다.

## Decisions

### User Decisions

- 레퍼런스 UI 도입, 상단 검색+접이식 필터, 아래 문구, 순차 등장 모션 승인.
- 권장안을 모두 채택하고 계획 저장·실행·검증까지 연속 진행하도록 명시적으로 요청했다. 스킬 단계는 분리하되 재승인을 요구하지 않는다.

### Approved Recommendations

- eyebrow `Writing`; H1 `새롭게 배우고.` / `배움의 과정을 기록합니다.`; 설명 `웹 개발부터 AI까지, 새롭게 익힌 개념과 직접 적용해 본 경험을 정리합니다.`
- desktop 제목 64px, mobile 36px 기준 반응형; 글 제목 24px/mobile 21px, 요약 18px/mobile 16px. 본문 최대 내부 폭 1280px로 현재 홈과 연결한다. 레퍼런스 대비 확대는 승인된 가독성 예외다.
- 글 행은 제목/최대 2줄 요약, 첫 태그(없으면 글), 화살표. 모바일 보조 정보는 아래로 이동. 썸네일·날짜는 목록에서 숨기되 데이터는 유지한다.
- 검색창은 항상 표시하고 카테고리/태그는 기본 접힌 필터 패널에서 제공. 활성 조건은 패널 밖에도 표시하며 전체 초기화 제공. 태그 전체 목록 접근 가능, 모바일 줄바꿈. 페이지당 9개/정렬 유지.
- 필터 변경은 다른 조건 유지, page만 1로 초기화. 기존 URL 쿼리 및 브라우저 뒤로가기 유지.
- 제목/설명 fade-up, 첫 성공 목록만 위→아래 stagger. 비동기 첫 로딩 완료 뒤 작동하며 검색/필터/page 변경 후에는 재등장하지 않는다. 로딩·빈·오류 상태에는 모션 없음. reduced-motion/focus 시 즉시 읽을 수 있다.
- 현재 공통 shell/Pretendard/light·dark 유지. 글 상세 재설계·언어 전환 제외.

## Scope

Writing 상단, 탐색 영역, 목록, 일치하는 skeleton, 빈/오류·재시도 UI, 접근성, 반응형, 순차 모션. 글 데이터/API 호출/링크 fallback/SEO는 재사용한다. 조회 결과 없는 동안 총 0개라고 잘못 알리지 않으며, 오래된 결과를 새 조건의 결과로 표시하지 않는다. 필터 메타데이터 loading/error는 별도로 표시한다.

## Non-Goals

글 상세/홈/헤더/푸터 변경, 글 편집·재수집, DB 쓰기, 배포, 커밋·push, AI 복원, 전역 lint 수리, 새 의존성.

## Route and Navigation Changes

None. `/writing`, `page/category/tag/search`, `/blog/[slug]`, exact `/blog` 308 및 쿼리 보존. slug 없는 글은 기존 원문 URL fallback 유지.

## Data and Database Changes

None. DTO/API/repository/Supabase 스키마·데이터 보존. 공개 읽기만 사용한다.

## SEO Changes

None. 기존 title/description/canonical/OG/Twitter/JSON-LD/sitemap/robots 유지. H1은 승인 문구 하나이며 서버 HTML에 존재한다.

## File Changes

- Update `src/app/writing/page.tsx`: hero/행 skeleton 연결, SEO 보존.
- Update `src/app/writing/WritingListPage.tsx`: 탐색 UI와 행 목록/상태/초회 모션.
- Create `src/app/writing/writing.module.css`: 페이지 한정 스타일.
- Create `src/app/writing/WritingSkeleton.tsx`: 재사용 행 skeleton.
- Create `src/app/writing/WritingEntrance.tsx`: 첫 목록 순차 모션 및 감소 설정/focus 지원.
- Retain shared PostCard/Pagination/SectionEntrance, data/API/SEO/global styles.
- Create `doc/projects-reorganization/audit/05-writing-reference-verification.md` 및 `baseline/plan05/` 검증 증거, 필요 시 `audit/05-*.cjs` 읽기 전용 검사 스크립트.
- Update 본 plan과 `doc/projects-reorganization/NEXT_STEPS.md` 상태 기록.

## Implementation Steps

1. 승인 계획/선행 Verified/Git 기준을 확인하고 기존 화면·SEO 및 보존 대상 해시를 저장한다.
2. Writing 한정 hero/목록/skeleton/CSS를 구성한다.
3. 상단 검색·접이식 필터·활성 조건/초기화와 기존 쿼리 연결을 구현한다.
4. 첫 데이터 등장 모션과 즉시 결과 갱신, 모든 상태/키보드/reduced-motion을 구현한다.
5. focused lint/tsc 및 브라우저 확인 후 Implemented - Pending Verification 기록.
6. 별도 portfolio-verify 단계에서 실제 diff/수용 기준과 아래 검증을 수행한다. 실패하면 검증 단계는 코드 수정 없이 실패를 기록하고 사용자 승인된 연속 실행 범위에서 execute 단계로 돌아와 수정 후 재검증한다.

## Validation

- `git diff --check`, `npx tsc --noEmit --incremental false`, `npm run lint`, `npm run build`.
- build는 개발 서버와 분리된 임시 소스 스냅샷에서 수행한다. 공개 폰트 fetch와 기존 공개 글 읽기 외 네트워크 쓰기 없음.
- 전역 lint 기존 `eslint-plugin-prettier` 누락은 기록하고 변경된 모든 TS/TSX를 scoped Next/TypeScript ESLint로 검사하여 새 오류/경고가 없어야 한다.
- 실제 desktop1440/mobile390 양 테마 캡처와 참고 비교. 320/640/768/1024 경계와 200% 확대 등가 reflow 확인. 제목/행/여백/가독성, 가로 overflow 점검.
- 실제 public 글 읽기로 검색/필터/페이지 링크/뒤로가기/초기화/상세/redirect 확인. 외부 DB 쓰기 없이 browser interception fixture로 loading/0/1/9개/error/retry/meta failure/slug fallback/긴 제목·태그를 확인한다.
- 키보드 필터·검색·행 focus, H1/main 단일성, 모션 순서와 필터 갱신 시 모션 없음, reduced-motion 확인.
- 변경 전후 metadata/canonical/OG/Twitter/JSON-LD/sitemap/robots, 보존 대상 파일 해시 비교. `/`, `/work`, `/resume`, 대표 `/blog/[slug]` smoke.

## Acceptance Criteria

1. 승인된 hero 문구, 이미지 없는 행 목록, 레퍼런스 구조와 홈에 맞는 확대 타이포가 desktop/mobile 양 테마에서 확인된다.
2. 검색+접이식 카테고리/태그 필터+활성 조건/전체 초기화+기존 페이지네이션이 작동하며 모든 글을 탐색할 수 있다.
3. 데이터·정렬·page size·query·상세/fallback·redirect·SEO·공통 shell 보존이 증거로 확인된다.
4. 첫 목록은 순차 등장, 검색/필터/page 이후 즉시 표시. reduced-motion/focus 지원.
5. loading/empty/error/retry/meta loading/error, 긴 글과 좁은 화면, 접근성과 reflow에 새로운 결함이 없다.
6. diff/type/scoped lint/build 통과, 전역 lint 기존 실패만 예외. 실제 시각·기능 검사와 독립된 최종 검증 기록이 있다.

## Risks and Rollback

글 97개와 긴 한글 때문에 참고 2개 화면과 전체 높이는 달라진다. 승인된 탐색 UI/폰트 크기/폭 외 임의 장식은 추가하지 않는다. 데이터가 늦게 오는 경우 모션은 첫 성공 렌더를 기준으로 실행한다. 원복은 Writing 변경분만 되돌리며 DB/다른 사용자 작업은 건드리지 않는다.

## Follow-Up Plans

글 상세 및 Work/Resume 개편은 별도 승인 계획. 이번 범위에 포함하지 않는다.

## Implementation Log — 2026-09-30

- Writing 한정 TSX 4개/CSS 1개 구현. 기존 HeroEntrance/Pagination/API/query hooks를 재사용하고 shared 파일은 수정하지 않았다.
- 검색/접이식 전체 카테고리·태그/활성 조건/초기화, 9개 행 목록과 상태별 skeleton/오류 재시도, 첫 성공 데이터 모션을 연결했다.
- `npx tsc --noEmit --incremental false`, scoped Next/TypeScript lint(4 TSX, 오류·경고 0), `git diff --check` 통과.
- 실제 1440/390/320px에서 9행, 승인 문구, 가로 overflow 없음 확인. 초기 캡처에서 발견한 보조 제목 토큰을 기존 home-heading-secondary로 수정했다.
- 구현 단계 완료. 다음 별도 portfolio-verify 단계에서 전체 수용 기준, 분리 build, 시각·기능·상태·SEO 보존을 검사한다.

## Correction Handoff — 2026-09-30

검증 1차 FAIL: WritingEntrance focus 처리에서 Motion.stop 뒤 예약된 스타일 갱신이 중간 투명도를 복구함. 같은 수용 기준 4를 충족하도록 종료를 최종 상태로 완료시키는 보정만 승인 범위 내 수행하고 재검증한다. 범위/제품 결정 변경 없음.

## Correction Implementation Log — 2026-09-30

- `WritingEntrance.tsx`에서 stop 대신 complete를 호출하고 최종 opacity/transform을 명시했다. focus/reduced-motion/query cleanup에서 예약된 프레임도 최종값으로 종료된다.
- focused 상태/모션 검사 18개, scoped lint 4 TSX, TypeScript/diff 통과. 모션 중 focus 후 2 rAF 시점의 9행 opacity 1 확인.
- 별도 verify 단계로 다시 인계한다. 최종 소스의 분리 build/전체 browser 검증을 재실행한다.

## Verification Log — 2026-09-30

- 최종 portfolio-verify 판정 PASS. focus 중간 투명도 문제를 execute 단계에서 보정한 후 전체 browser 62/62 재검증.
- 최종 분리 build 120페이지, checkout/post-build tsc, scoped lint(4 TSX 오류·경고 0), diff 통과. 전역 lint는 기존 prettier plugin 누락만 유지.
- Writing 5개 외 src 변경 없음, 최종 빌드와 소스 일치. 실제 글/쿼리/상세/SEO 보존, 양 테마 시각·상태·모션·좁은 화면 확인.
- 근거 및 제한: `doc/projects-reorganization/audit/05-writing-reference-verification.md`, `doc/projects-reorganization/baseline/plan05/`.
- 승인된 연속 계획→구현→검증 완료. 커밋·push·배포·DB 쓰기 없음. 다음 승인된 계획 없음.
