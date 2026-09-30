# 03. Design System and Global Shell

Status: Verified

Approved: 2026-09-29 (Asia/Seoul)

## Goal

참고 사이트의 중립적인 배경, 파란 강조색, 정돈된 글꼴·여백을 기반으로 모든 공개 화면이 공유하는 디자인 시스템과 레이아웃을 만든다. 라이트·다크 테마와 한국어용 글꼴을 적용하고, 기존 부유형 메뉴·푸터를 일관된 상단 헤더와 문서 흐름의 하단 푸터로 교체한다.

이번 결과는 페이지별 전면 redesign의 기반이다. 기존 화면의 콘텐츠·섹션 순서·카드 구성은 유지하되 공통 폭, typography, 색상과 접근성을 정렬한다. 홈 섹션 재배치나 프로젝트 카드 전면 개편을 완료했다고 간주하지 않는다.

## References

- `doc/projects-reorganization/plan/02-information-architecture-and-content-model.md`
- `doc/projects-reorganization/audit/02-information-architecture-verification.md`
- `doc/projects-reorganization/NEXT_STEPS.md`
- `doc/portfolio-reference/README.md`
- `doc/portfolio-reference/03-design-system.md`
- `doc/portfolio-reference/02-page-templates.md` — Global Layout 절
- `doc/portfolio-reference/04-implementation-notes.md` — Shared Components, Build Order, Adaptation 및 Validation 절
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/components/layout/SiteLayout/index.tsx`
- `src/components/layout/SiteLayout/parts/Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, `index.ts`
- `src/components/layout/PageContainer.tsx`, `src/components/ui/mini-navbar.tsx`
- `src/components/ui/Buttons/section-4-cta-button.tsx`, `src/components/ui/Pagination.tsx`
- `src/app/ClientPage.tsx`, `src/app/work/page.tsx`, `src/app/project/[slug]/page.tsx`
- `src/app/resume/page.tsx`, `src/app/resume/ResumePage.tsx`
- `src/app/writing/page.tsx`, `src/app/writing/WritingListPage.tsx`
- `src/app/blog/[slug]/page.tsx`, `src/app/not-found.tsx`
- `styles/velog.css`, `src/data/careerData.ts`, `src/data/projects.ts`, `package.json`
- [Pretendard 공식 저장소](https://github.com/orioncactus/pretendard) — 글꼴 배포 파일 및 라이선스 출처

참고 문서는 구조·시각 기준이다. 사이트 소유자의 이름·심볼·연락처·경력이나 AI/언어 UI는 복제하지 않는다. 2026-09-28 조사 자료를 기준으로 하며, 실제 구현 직전 주요 참고 화면을 확인해도 사용자 승인 범위를 자동 변경하지 않는다.

## Current State

- Plan 00–02는 `Verified`. 현재 기준 커밋은 `b213173`이며 Plan 02 구현 커밋은 `60330c9`다. 계획 작성 전 작업 트리는 깨끗했다.
- 공개 경로와 한국어 메뉴, 프로젝트 4개 및 경력·글 연결은 완료됐다. AI UI와 자동 Chatbot 요청은 제거됐고 서버 코드는 보존돼 있다.
- Root는 Geist/Geist Mono를 로드하지만 `globals.css`의 body는 Arial을 직접 지정한다. Pretendard 로컬 자산은 없다.
- `next-themes`는 이미 설치돼 있으나 활성 ThemeProvider/테마 버튼은 없다. 대부분의 화면은 고정된 흰 배경과 slate/blue 색상이다.
- SiteLayout과 PageContainer가 각각 그라데이션 배경·높이·여백을 소유한다. Home은 최대 1800px, Resume은 1540/1440px, 일반 페이지는 max-w-7xl로 폭이 서로 다르다.
- `Header`는 mini-navbar를 사용한다. 부유형 pill 메뉴, 모바일 펼침 상태, 미사용 side-nav 연결이 남아 있다.
- Footer는 화면 하단에 fixed로 떠 있는 GitHub/Velog 링크이며 콘텐츠 일부를 가린다.
- 글 본문의 `pre`는 어두운 배경에 상속된 어두운 글자가 적용될 수 있다. 상태 UI와 404도 별도 고정 색상·애니메이션을 사용한다.
- 기존 전체 lint는 `eslint-plugin-prettier` 누락으로 종료한다. Plan 02 build/TypeScript/로컬 검증은 통과했고 변경 TS/TSX 32개 Next 규칙 점검은 오류 0, 기존 PostCard 이미지 경고 1이었다.

## Decisions

### User Decisions

- 라이트·다크 모두 지원한다. 시스템 설정을 기본으로 따르고 사용자가 선택한 테마는 저장한다.
- 한글·영문은 Pretendard로 통일하고 코드 블록은 별도 고정폭 글꼴을 유지한다.
- 한국어 전용, AI 제외, 기존 경력·프로젝트 내용 유지, 운영 배포/검증 제외라는 기존 결정을 유지한다.
- 최종 범위 요약에 사용자가 2026-09-29 “좋다”로 승인했다.

### Approved Recommendations

- 참고 사이트의 중립 배경·파란 강조색·넓은 여백을 따른다. 최대 콘텐츠 폭 72rem, 긴 본문 약 40rem을 사용한다.
- 상단에 고정되는 공통 헤더를 두고 기존 심볼·성찬홍 이름, 프로젝트·글·이력서, 테마 버튼을 제공한다.
- 모바일에서도 세 메뉴를 직접 노출한다. 좁은 화면에서는 이름만 숨기고 심볼·메뉴·테마 버튼을 유지한다.
- 일반 하단 푸터로 교체한다. 기존 GitHub·Velog만 외부 링크로 제공하고 새 연락처를 추가하지 않는다.
- 공통 버튼·링크·포커스, 본문 바로가기, 동작 줄이기 설정을 지원한다.
- 모든 기존 공개 화면과 loading/empty/error/404가 두 테마에서 읽히도록 색상을 정리한다. 코드 블록 대비도 이번 범위다.
- 개별 페이지의 섹션 재배치·카드 구조 전면 개편은 별도 후속 계획으로 분리한다.

### Constrained Implementation Details

- 기존 Tailwind 4와 설치된 `next-themes`를 활용한다. 참고 사이트의 Tailwind 3 설정을 그대로 복사하거나 프레임워크를 교체하지 않는다.
- header는 `sticky top-0` 방식으로 스크롤 시 상단에 남되 문서 흐름에서 높이를 확보한다. 기존 pill의 top-6 부유 배치와 이중 top padding을 제거한다.
- 이름은 400px 미만에서 숨긴다. 320px에서도 세 메뉴와 테마 버튼이 한 줄에 들어가도록 간격·컨트롤 폭을 조정하며 본문 전체 가로 스크롤이나 햄버거 메뉴를 새로 만들지 않는다.
- 푸터의 이름·직무는 기존 개인 데이터에서 참조한다. 지역·Email·LinkedIn·AI 안내 등 신규 공개 정보는 추가하지 않는다. 내부 메뉴는 기존 세 경로를 사용한다.
- Pretendard는 공식 배포본의 버전과 라이선스를 기록해 자체 호스팅한다. 가변/서브셋 WOFF2로 필요한 글자만 내려받을 수 있게 하고 `font-display: swap` 및 한글 시스템 fallback을 둔다. 코드용 Geist Mono는 유지할 수 있으며 미사용 Geist Sans는 제거한다.

## Scope

### Design Tokens and Typography

- CSS custom property로 ink, secondary/tertiary text, surface/raised/sunken/muted, border, accent, focus, semantic status, code 배경·글자색을 정의하고 Tailwind theme에 연결한다.
- 라이트 기준: ink `#1d1d1f`, secondary `#45454a`, tertiary `#6e6e73`, surface `#fdfdfc`, raised `#fff`, sunken `#f7f7f5`, muted `#f0f0ee`, accent `#0066cc`.
- 다크 기준: ink `#f5f5f7`, secondary `#d1d1d6`, tertiary `#a1a1a6`, surface `#0a0a0b`, raised `#161618`, sunken `#111113`, muted `#1c1c1f`, accent `#4da3ff`.
- 약한 보조색은 작은 본문에 무조건 사용하지 않는다. 본문·기능 안내·폼 문구는 배경 대비 4.5:1, 큰 글자와 UI 경계/focus는 3:1을 목표로 실제 조합을 검증한다. 비활성 장식은 구분해 기록한다.
- 제목 scale은 참고 문서의 2.25/3/4/5.25rem 등을 토큰으로 정의하되 현재 모든 h1에 최대 display를 강제하지 않는다. 한국어 줄바꿈·line-height를 조정해 clipping을 막는다. 본문 기본은 1rem 안팎, 보조 UI는 0.8125rem 이상을 기준으로 정리한다.
- radius 10/14/20/28px 및 pill, 얇은 테두리, 절제된 shadow를 공통화한다. 반짝임·네온과 blue gradient를 중립 surface로 정리하되 프로젝트별 상태 의미는 텍스트로 보존한다.
- 공통 container의 최대 폭은 padding을 포함한 72rem, 기본 gutter는 모바일 24px/큰 화면 40px이며 320px에서는 overflow 방지를 위해 16px까지 줄일 수 있다. 글 상세 본문은 약 40rem으로 제한한다.
- 공통 section spacing 토큰은 모바일 112px/데스크톱 160px를 기준으로 준비하되 폼·상태·세부 패널에 일괄 강제하지 않는다. Home 내부 섹션 리듬의 전면 재배치는 후속 작업이다.

### Theme Behavior

- `<html>`의 단일 theme 상태를 기준으로 전체 활성 UI가 변경된다. 선택값이 없으면 시스템 테마를 따르며 시스템 변경에도 반응한다.
- 버튼은 현재 effective theme의 반대 테마로 전환하고 사용자 선택을 `localStorage.theme`에 저장한다. 저장 후에는 시스템 변경보다 사용자의 선택이 우선한다. 새 시스템 복귀 설정 화면은 만들지 않는다.
- 첫 표시에서 잘못된 테마가 번쩍이는 현상과 hydration mismatch를 방지한다. SSR 단계에서도 버튼 공간을 확보하고 mount 전에는 불안정한 아이콘/접근성 문구를 출력하지 않는다.
- 버튼 이름은 “다크 모드로 전환” / “라이트 모드로 전환”처럼 한국어로 제공한다. 저장소 차단·글꼴 로드 실패 시에도 내용과 탐색이 동작해야 한다.
- 네이티브 폼에도 적절한 color-scheme을 적용한다. 이미지 자체를 반전시키거나 글 본문 HTML/저장 데이터를 재작성하지 않는다.

### Global Shell and Shared Controls

- 한 개의 공통 header/nav, 한 개의 main 영역, 문서 흐름의 footer를 제공한다. Root/SiteLayout에서 main을 소유하면 각 페이지의 기존 main을 section/div 등으로 바꿔 중첩하지 않는다. main은 `id="main-content"` 및 focus 가능한 대상이 된다.
- “본문으로 바로가기” 링크는 키보드 focus 시 보이고 header에 가려지지 않은 main으로 이동한다.
- header의 inner container를 본문 폭에 정렬한다. 데스크톱 높이 약 65px, 모바일 약 57px를 기본값으로 삼고 글자 확대 시 잘리지 않게 한다. 현재 메뉴 표시, 홈 접근성 이름, 상세에서 상위 메뉴 활성 상태는 유지한다.
- 세 메뉴의 href와 텍스트는 기존 결정 그대로다. 기존 심볼의 형태는 유지하고 새 로고 제작은 하지 않는다.
- footer는 짧은 화면에서도 문서 하단에 위치하며 내용 위에 떠 있지 않는다. 이름/직무, 내부 메뉴, GitHub·Velog 링크를 담고 과도한 발광 효과는 제거한다.
- 공통 버튼/텍스트 링크는 의미에 맞는 button/a를 사용한다. 링크에 button role을 억지로 부여하지 않는다. hover, focus-visible, disabled 상태를 두 테마에 제공한다.
- 외부 링크는 기존 주소를 유지하고 새 탭이면 적절한 rel을 유지한다. 개인 데이터의 email을 새 footer에 자동 노출하지 않는다.
- 미사용 side-nav state/props와 교체 후 사용되지 않는 mini-navbar/MobileNav는 참조 검색 후 정리할 수 있다. AI 비활성 코드는 정리 대상으로 확대하지 않는다.

### Existing Page Adaptation

- Home, Work, Project, Resume, Writing, Blog detail, not-found를 공통 폭·색상·폰트에 연결한다. 모든 공개 프로젝트 상세가 적용 대상이며 첫 프로젝트만 처리하지 않는다.
- 기존 data-driven 문구, 수치, featured/status/순서와 항목 수, 섹션 순서는 유지한다. 표면 색상/글자색/공통 여백 조정 외 카드 유형·정보 구조를 새로 설계하지 않는다.
- 모든 active career/home/project 컴포넌트, PostCard, pagination, 검색/필터, skeleton, alert/empty 상태의 고정 라이트 색상을 교체한다.
- 글 본문 heading/link/표/인용문/inline code/pre의 대비와 focus를 테마에 맞춘다. pre와 표의 내부 가로 스크롤은 허용하되 페이지 전체 overflow는 금지한다. 본문 이미지·텍스트·링크 데이터는 보존한다.
- Resume의 기존 fragment ID와 sticky section nav는 보존하고 새 header 아래로 target이 드러나도록 scroll offset을 조정한다.
- 불필요한 신규 진입 애니메이션은 도입하지 않는다. 기존 reveal/hover/404/skeleton 애니메이션은 reduced-motion에서 정지·최소화한다. 특히 observer를 기다리느라 내용이 투명하게 남지 않아야 한다.

## Non-Goals

- Home의 Hero/섹션 순서, 업무 방식 카드 등 신규 콘텐츠나 전체 페이지 템플릿 재구성
- Work 필터/새 분류, 프로젝트 카드 전면 개편, 이력서 내용 재작성
- AI UI/응답 복구, Chatbot API·데이터 삭제, 언어 전환
- 새 연락처 공개, 신규 로고·이미지·프로젝트 썸네일 생성
- URL/redirect/API 계약/DB schema 변경, migration 또는 운영 데이터 쓰기
- canonical/metadata/JSON-LD 내용의 전략적 개편, sitemap/robots 정책 변경
- 전체 lint/format 청소, 패키지 업그레이드, 새 UI·테스트 프레임워크, CI 구축
- Vercel 배포, 운영 도메인/DB 검증

## Route and Navigation Changes

경로 변경: None. Plan 02의 `/`, `/work`, `/project/[slug]`, `/resume`, `/writing`, `/blog/[slug]`를 유지한다. `/career`와 exact `/blog`의 308/query 보존 및 `/ask` 404를 유지한다.

공개 동작 변경은 inline 모바일 메뉴, 일반 footer, theme 버튼과 skip link에 한정한다. header/footer 메뉴는 프로젝트·글·이력서이며 로고/이름은 홈으로 이동한다. Resume fragment와 글 검색/필터/page query는 보존한다.

## Data and Database Changes

DB 변경: None. 경력·프로젝트 데이터, Blog DTO/API, 기존 public 글 읽기 및 Plan 01 보안 경계를 유지한다. 글꼴 자산과 브라우저의 비민감 theme 선호 저장만 추가한다. 새 서버 저장소/동의 서비스/사용자 식별자는 만들지 않는다.

실행 전후 `careerData.ts`, `projects.ts`의 레코드를 비교하고 재사용된 footer 이름/직무/외부 링크도 기존 값과 일치하는지 확인한다. 본문 스타일 변경을 위해 Supabase 콘텐츠를 덮어쓰지 않는다.

## SEO Changes

SEO 정보 변경: None. 기존 title/description/canonical/OG/Twitter/JSON-LD/sitemap/robots/도메인과 이미지 자산을 유지한다. semantic header/nav/main/footer, skip target, heading의 올바른 포함 관계만 조정한다. theme 또는 hydration 처리가 서버 HTML 콘텐츠·metadata를 감추지 않아야 한다. `lang="ko"` 유지.

## File Changes

### Create

- `src/styles/portfolio-tokens.css` — light/dark 색상·크기·간격 공통 토큰
- `src/styles/pretendard.css`, `public/fonts/pretendard/` — 공식 글꼴, subset 선언, 라이선스 및 출처/버전 기록. 세부 파일명은 선택한 공식 배포본에 따른다.
- `src/components/providers/ThemeProvider.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/components/ui/PrimaryButton.tsx`, `src/components/ui/TextLink.tsx` — 실제 공통 사용처를 가진 기본 컨트롤
- `doc/projects-reorganization/audit/03-design-system-verification.md`
- `doc/projects-reorganization/baseline/plan03/` — 두 테마·반응형·상태/접근성 점검 결과와 이미지
- 필요 시 위 audit 디렉터리의 Plan 03 전용 검증 스크립트. 기존 Puppeteer/Cheerio/TypeScript 활용.

### Update

- `src/app/layout.tsx`, `src/app/globals.css`
- `src/components/layout/SiteLayout/index.tsx`, `src/components/layout/PageContainer.tsx`
- `src/components/layout/SiteLayout/parts/Header.tsx`, `Footer.tsx`, `index.ts`
- `src/components/ui/Buttons/section-4-cta-button.tsx`, `src/components/ui/Pagination.tsx`
- `src/app/ClientPage.tsx`, `src/app/work/page.tsx`, `src/app/project/[slug]/page.tsx`
- `src/app/resume/page.tsx`, `src/app/resume/ResumePage.tsx`
- `src/app/writing/page.tsx`, `src/app/writing/WritingListPage.tsx`
- `src/app/blog/[slug]/page.tsx`, `src/app/not-found.tsx`
- `src/components/domain/home/CareerHighlight/index.tsx`, `ProjectShowcase/index.tsx`, `Section3/index.tsx`
- `src/components/domain/career/PersonalInfoHeader.tsx`, `CareerSummary.tsx`, `CareerSectionNav.tsx`, `ProjectTimeline.tsx`, `TechStack.tsx`
- `src/components/domain/project/ProjectDetails.tsx`
- `src/components/domain/blog/PostCard.tsx`, `PostCardSkeleton.tsx`
- `src/components/skeletons/BlogSkeleton.tsx`, `styles/velog.css`
- `src/hooks/useElementObserve.ts` — reduced-motion에서 내용이 숨겨진 채 남지 않도록 필요한 변경만 한다. 다른 이용자에 대한 영향도 확인한다.
- 본 plan과 `doc/projects-reorganization/NEXT_STEPS.md` — 상태와 인계 기록

### Remove After Reference Check

- `src/components/ui/mini-navbar.tsx` — 새로운 Header로 대체하고 이용자가 없어진 경우 제거
- `src/components/layout/SiteLayout/parts/MobileNav.tsx` — inline 모바일 메뉴로 통합하고 이용자가 없어진 경우 제거
- 기존 CTA 파일은 모든 이용자를 공통 컨트롤로 옮기고 링크 보존을 확인한 경우에만 제거한다. 미이행 이용자가 있으면 얇은 wrapper로 유지해도 된다.

### Retain

- 경력/프로젝트/Blog 데이터와 타입, repository/service/action/API, migration, Plan 01 보호 경계
- `/career`, `/blog` redirect, sitemap/robots, SEO 생성 로직
- public 이미지, 기존 글 HTML, 비활성 AI 코드
- `package.json`/lockfile의 의존 버전. 기존 `next-themes`를 사용하므로 신규 의존성은 필요하지 않다.
- 비활성 Home Section1/2/4 등의 전면 정리는 하지 않는다. 공유 부품 참조 유지에 필요한 추적 수정은 구현 로그에 기록한다.

## Implementation Steps

1. Plan 02 Verified, 본 plan Approved, Git/AGENTS와 대상 구현을 확인한다. 사용자 변경을 보전하고 현재 두 viewport·데이터·SEO 기준을 확보한다.
2. 공식 Pretendard 배포와 라이선스를 확인하고 버전 고정 로컬 font 자산·fallback을 도입한다. 비밀 정보는 읽지 않는다.
3. Tailwind 4에 맞는 디자인 토큰과 ThemeProvider를 도입하고 초기 theme/저장/변경/hydration을 확인한다.
4. sticky Header, inline 모바일 메뉴, ThemeToggle, main/skip link, 일반 Footer로 교체한다. 미사용 state/props·기존 nav는 참조 확인 후 정리한다.
5. PageContainer와 Home/Resume의 개별 width/top offset을 공통화한다. 제목과 fragment target이 header에 가려지지 않게 한다.
6. 공통 컨트롤을 만들고 기존 CTA/링크/폼에 의미를 보존하며 적용한다.
7. 모든 활성 공개 화면과 상태 UI를 theme token으로 이행한다. 기존 데이터·항목 수·페이지 구성을 바꾸지 않는다.
8. 글 CSS의 코드/표/인용문 가독성과 reduced-motion을 개선한다. 저장된 본문은 변경하지 않는다.
9. 아래 명령·로컬 회귀·시각/동작/대비 검증을 수행하고 증거와 기존 실패를 audit에 남긴다.
10. 구현 파일과 요구사항을 대조한다. 본 plan을 `Implemented - Pending Verification`으로 바꾸고 구현 로그/NEXT_STEPS를 갱신해 별도 `$portfolio-verify`에 인계한다.

## Validation

### Commands

```bash
git diff --check
npm run lint
npm run build
npx tsc --noEmit
npm run start -- -p 3101
```

- TypeScript는 build 후 실행한다. 3101이 사용 중이면 사용자 프로세스를 중단하지 말고 빈 포트를 선택한다.
- 전체 lint를 반드시 실행해 기존 plugin 누락과 비교한다. 누락이 지속되면 변경/이동한 모든 TS/TSX를 `--no-renames`로 수집해 Next core-web-vitals/typescript 점검을 병기하고 새 오류는 수정한다. CSS/font/검증 스크립트도 구문·실제 출력·참조를 검사한다.
- 기존 Plan 02 검증의 의미는 유지해 재사용한다. 이전 mobile-menu DOM 전제는 inline 메뉴의 가시성·focus·현재 위치 검사로 바꾼다. 기존 테스트 통과를 위한 숨겨진 구형 메뉴는 남기지 않는다. Plan 02의 역사적 증거는 덮어쓰지 않고 Plan 03에 출력한다.
- `verify:security`, migration, DB catalog 조회, Vercel/운영 경로 검사는 하지 않는다. 허용 네트워크 작업은 공개 참고 자료/공식 font 확보와 기존 public 글 읽기로 한정한다.

### Visual and Behavior Matrix

- Home, Work, 대표 Project, Resume, Writing, 대표 Blog detail, 404를 390×844·1440×900의 light/dark 양쪽에서 확인한다. 나머지 Project 3개도 테마의 본문/상태/선택 섹션을 확인한다.
- 320px, 768px, 1024px에서 header/nav/footer/container 경계, 메뉴 잘림/줄바꿈, 가로 overflow를 추가 확인한다. 200% zoom에서도 주요 조작과 문장에 접근할 수 있어야 한다.
- root/html/viewport의 가로 overflow는 없어야 한다. 표/pre 내부 scroll은 허용한다. header/footer가 본문·링크·앵커·skip target을 조작 불가능하게 가리지 않아야 한다.
- 저장값 없는 light/dark 시스템 설정, 시스템 변경, 수동 전환, route 이동, reload 순으로 실효 theme을 확인한다. 저장값이 임의로 되돌아가지 않고 초기 flash/hydration 경고/console error가 없어야 한다. localStorage 제한 상황에도 조작 가능해야 한다.
- Pretendard 읽기 성공과 실제 computed font, font 실패 시 한글 지원 fallback, 코드 monospace, layout shift/글자 잘림을 확인한다. 폰트 버전·출처·라이선스·압축 후 크기를 audit에 기록한다.
- keyboard Tab/Shift+Tab/Enter/Space, skip link, theme button, 세 메뉴, project link, 검색/필터/pagination을 조작한다. focus 표시, 적절한 aria 이름, 현재 위치, single main을 확인한다.
- reduced-motion에서 reveal 내용이 표시된 채 유지되고 404의 bounce/pulse, skeleton pulse, 과도한 transform/smooth scroll이 중단·최소화되는지 확인한다. 미디어 쿼리 정의만으로 통과시키지 않는다.
- light/dark의 일반 문구/약한 글자/링크/상태/placeholder/error/code/표/선택 필터의 실제 색을 측정하고 정한 대비 기준과 비교한다. 상태는 색만으로 전달하지 않는다.
- Writing loading·empty·error·retry, 본문 없는 상태, unknown project는 안전한 브라우저 응답 fixture 등으로 재현한다. 외부 기록을 편집해 상태를 만들지 않는다.

### Regression and Preservation

- `/`, `/work`, 프로젝트 4개, `/resume`, `/writing`, 기존 article의 200, unknown project와 `/ask` 404, 두 exact 308과 query/fragment 보존.
- Home/Work/Resume에서 프로젝트 이동, 앞뒤 상세 링크, article에서 목록 복귀, 검색/tag/category/page 값 보존을 확인한다.
- Plan 01에서 제거한 crawler/test/docs route의 404와 FAQ POST 405를 로컬에서만 확인한다. AI 버튼/언어 전환이 없고 탐색 중에도 Chatbot 자동 요청은 0건이어야 한다.
- career/project 원본 export의 실행 전후 일치, 4개 순서/상태/featured 보존, 글 본문·slug/API 계약 미변경.
- canonical/title/description/OG/Twitter/JSON-LD, sitemap의 기존 article과 프로젝트 4개, robots의 API 보호를 확인하고 theme 처리로 인한 누락이 없는지 확인한다.

## Acceptance Criteria

1. 공통 토큰과 Pretendard가 모든 공개 UI에 적용되고, code는 monospace이며 font 실패 시에도 문장을 읽을 수 있다.
2. light/dark가 모든 페이지와 loading/empty/error/404에서 일관되고, system fallback·수동 선택 저장·초기 렌더링이 동작한다.
3. header는 참고 구조를 따르며 기존 심볼/이름, 세 한국어 메뉴, theme button을 제공한다. 좁은 화면에서도 inline으로 조작 가능하다.
4. footer는 문서 흐름에 있고 화면 위에 떠 있지 않다. 기존 GitHub/Velog와 내부 메뉴가 동작하며 새 연락처를 공개하지 않는다.
5. container 최대 72rem, 긴 본문 약 40rem, 공통 gutter로 정렬된다. desktop/mobile/zoom에서 페이지 가로 overflow·중첩 main·가려진 주요 조작이 없다.
6. focus/skip/keyboard와 reduced-motion이 동작하고 본문·코드·상태의 대비 기준을 충족한다.
7. 경력/프로젝트/글 데이터, 섹션 순서·항목 수, URL/redirect/query/fragment, SEO와 Plan 01 보호 경계를 보존한다.
8. AI UI·언어 전환을 추가하지 않으며 Chatbot 자동 요청은 0건이다. 새 DB 작업·API 기능·프레임워크 의존·운영 작업이 없다.
9. build/TypeScript/diff와 변경 범위 검사가 성공하며 전체 lint는 기존 기준선과의 비교를 정확히 기록한다.
10. 구현 로그, 시각/동작/대비 증거와 검증 절차를 저장해 별도 `$portfolio-verify`에서 판정할 수 있다.

## Risks and Rollback

- 고정 색상이 많으므로 외곽만 dark로 변하는 구현은 불가하다. 모든 활성 소비자와 상태를 열거해 이행한다. 비활성 UI/AI까지 전면 변경할 필요는 없다.
- global main/container 변경은 이중 여백, nested main, Resume anchor 위치 오류를 유발할 수 있다. 기존 페이지 wrapper를 함께 점검한다.
- 좁은 header에 메뉴를 배치하므로 320px와 zoom 검증이 필수다. 읽기 어려운 글자 축소나 가로 scroll로 해결하지 않는다.
- 외부 font 확보에 실패하면 임의로 다른 font로 확정 변경하지 말고 제한을 보고한다. 라이선스가 없는 자산은 도입하지 않는다.
- 글의 inline style이 테마와 맞지 않으면 한정된 표시 CSS로 보정하고 저장 HTML은 변경하지 않는다. 링크/이미지/코드 의미를 훼손하는 일괄 치환은 금지한다.
- 문제 발생 시 본 plan의 font/provider/styles/layout/consumer 변경만 선택적으로 되돌린다. Plan 01/02, 사용자의 다른 변경과 DB 데이터를 되돌리지 않는다.
- 로컬 Verified는 운영 반영을 보증하지 않는다. 사용자가 처음 시각 확인할 시점은 본 plan과 후속 Home 개선이 완료된 때로 예상하되, 다음 계획을 자동 구현하지 않는다.

## Follow-Up Plans

- Plan 03 Verified 후 Home의 Hero·섹션 구성과 대표 콘텐츠 표현을 별도 plan으로 인터뷰/승인한다.
- Work/Project, Resume, Writing/Blog의 페이지별 시각 개선은 각각 범위를 한정한 후속 plan으로 진행한다.
- 전체 UI 개선 후 경력·성과 문구를 별도 작업으로 정리한다. 현재 단계에서 내용을 다시 쓰지 않는다.
- AI 재검토와 전체 lint/성능 등 품질 개선은 기존 후속 후보로 유지한다. 미작성 plan 번호는 해당 시점의 다음 번호를 사용하며 본 plan 승인은 그 구현 권한을 포함하지 않는다.

## Implementation Log — 2026-09-29

- 기준 커밋 b213173. 계획의 생성·변경·보존 파일 및 1–10 단계를 대조했다. Pretendard 1.3.9 공식 가변 WOFF2 92개(2,957,724 bytes), OFL 및 출처, CSS Unicode range를 자체 호스팅으로 도입했다.
- 공통 색상·radius·간격·font 토큰, next-themes Provider/Toggle, sticky inline Header, single main/skip link, 문서 흐름 Footer, PrimaryButton/TextLink를 적용했다. 사용처가 사라진 mini-navbar/MobileNav만 삭제했으며 Git 기준 커밋에서 복구 가능하다. 비활성 AI 코드는 보존했다.
- 활성 페이지·카드·지표·검색·필터·skeleton·error·404와 글 본문/코드/표를 테마 토큰에 연결했다. 기존 카드/섹션 내용·순서와 데이터는 유지했다. 확대 시 긴 영문 지표의 줄바꿈과 최소 열 너비를 보정했다.
- build, build 이후 TypeScript, diff 검사 통과. 전체 lint는 기존 prettier plugin 누락으로 종료 2. 변경 TS/TSX 34개 Next 규칙 점검은 오류 0, 기존 PostCard img 경고 1. 초기 기능 회귀 54/54, 라이트 주요 화면과 다크 모바일, 테마 초기 표시/저장, 실제 font/fallback 및 본문 없음 fixture 집중 검사를 수행했다.
- 사용자 개발 서버 3000과 production 출력 충돌(main-app.js 404)을 확인해 개발 서버를 종료하지 않고 임시 소스 스냅샷의 별도 .next에서 npm run build/start/tsc를 실행하는 검증 도구를 추가했다. 프로젝트 설정·의존성·환경변수 값은 변경하지 않았다. 환경 파일은 내용을 읽거나 복사하지 않고 로컬 symlink로 참조한다.
- Plan 02 이미지/결과를 변경 전 기준으로 사용하고, Plan 03 전용 회귀/디자인/보존/폰트/분리 빌드 검사 및 결과를 audit와 baseline/plan03에 추가했다. 외부 이미지의 network-idle 지연은 실제 UI/폰트 준비 조건으로 검사를 보완했다. 실패·수정 기록은 최종 audit에 남긴다.
- 경력·프로젝트/글 DTO·API·SEO·DB·패키지 및 운영 범위는 변경하지 않았다. 배포/운영 검증/커밋은 하지 않았다. 사용자의 일괄 진행 요청에 따라 다음 단계는 동일 계획의 portfolio-verify이며 후속 페이지 계획은 시작하지 않는다.

## Verification Log — 2026-09-29

- Verdict: PASS — 승인된 구현의 분리 로컬 production 검증. portfolio-verify에서 전체 계획·구현 로그·실제 diff·10개 수용 기준을 대조했다. 검증 단계에서 구현 코드를 수정하지 않았다.
- build 118개 정적 페이지 생성 성공, 이후 tsc/diff/검사 스크립트 구문 점검 성공. 전체 lint 종료 2는 기존 plugin 누락과 동일하며 변경/신규 TS/TSX 34개 Next 규칙 오류 0, 기존 img 경고 1로 기준선 예외를 확인했다.
- 기능/경로/콘텐츠/SEO 회귀 54/54, 디자인/테마/반응형/키보드/오류/폰트/대비 49/49 통과. 실제 검증 소스 스냅샷과 현재 src/styles/public의 byte 일치 및 metadata/data/API/DB/의존성 보존도 확인했다. 자동 AI 요청 및 production 브라우저 page/hydration 오류 0.
- 모든 주요 페이지의 두 테마·390/1440px, 320/768/1024 경계와 200% 확대, 추가 프로젝트 3개, 코드/표/상태와 실제 한글 font/fallback을 확인했다. 실제 문구 최소 대비 4.88:1.
- [상세 감사 및 제한 사항](../audit/03-design-system-verification.md), [디자인 검사 결과](../baseline/plan03/design-checks.json), [기능 회귀](../baseline/plan03/regression.json). Writing 비동기 태그 로딩의 기존 화면 이동은 폰트 차단 대조로 구분해 후속 대상으로 기록했다.
- 초기 dev/build 캐시 충돌 이후 production 검증은 완전히 분리했다. 이후 사용자의 “재시작해줘” 승인에 따라 기존 3000 개발 서버를 정상 종료하고 재시작했다. Home/Work/Writing/Resume/대표 Project 5개 200, 글 목록 실제 로딩, 테마 전환·새로고침 유지 및 브라우저 page 오류 0을 확인해 개발 환경 복구까지 완료했다. [복구 근거](../baseline/plan03/dev-server-recovery.json).
- 운영 배포/DB 작업/커밋 없음. 다음 승인된 구현 계획은 없으며 Home 페이지 개선의 별도 인터뷰·승인이 다음 단계다.
