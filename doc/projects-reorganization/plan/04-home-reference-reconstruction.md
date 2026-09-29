# 04. Home Reference Reconstruction

Status: Verified

Approved: 2026-09-29 (Asia/Seoul)

## Goal

홈의 디자인과 구성을 `https://daehanportfolio.vercel.app/`과 최대한 동일하게 재구축하고, 개인 콘텐츠만 성찬홍의 기존 자료로 교체한다. 색상이나 분위기만 참고하는 작업이 아니다. 첫 화면의 구도, 섹션 순서, 카드 형태와 내부 배치, 콘텐츠 폭, 타이포그래피, 여백, 반응형, 헤더·푸터까지 실제 참고 화면을 기준으로 맞춘다.

기존 홈 구조를 보존할 의무는 없다. 다만 경력 사실·프로젝트 원본·글 데이터와 기존 기능/보안 경계는 보존한다. 승인된 예외는 한국어/Pretendard, 기존 브랜드 심볼, AI·언어 UI 제외, 실제 데이터 개수, 없는 자격증 생략, 기존 공개 링크만 사용이다. 이러한 예외 외에 임의로 디자인을 재해석하지 않는다.

## References

- 참고 사이트 Home: `https://daehanportfolio.vercel.app/`
- `doc/portfolio-reference/README.md`
- `doc/portfolio-reference/02-page-templates.md` — Global Layout, Home
- `doc/portfolio-reference/03-design-system.md`
- `doc/portfolio-reference/04-implementation-notes.md` — 구성 요소 및 검증 참고. 일반 제안보다 사용자 결정과 본 계획이 우선한다.
- `doc/projects-reorganization/plan/02-information-architecture-and-content-model.md`
- `doc/projects-reorganization/plan/03-design-system-and-global-shell.md`
- `doc/projects-reorganization/audit/03-design-system-verification.md`
- `src/app/page.tsx`, `src/app/ClientPage.tsx`
- `src/components/domain/home/CareerHighlight/index.tsx`, `ProjectShowcase/index.tsx`, `Section3/index.tsx`
- `src/components/home/BlogContainer.tsx`, `src/components/skeletons/BlogSkeleton.tsx`
- `src/components/layout/SiteLayout/parts/Header.tsx`, `Footer.tsx`
- `src/data/careerData.ts`, `src/data/projects.ts`, `src/types/portfolio.ts`
- `src/app/globals.css`, `src/styles/portfolio-tokens.css`

2026-09-29 실제 참고 페이지를 브라우저와 읽기 전용 DOM/computed style로 확인했다. 예전 문서에 빠진 자격증 목록과 내부 콘텐츠 폭을 발견했다. 구현 직전 같은 viewport의 참고 캡처·측정값을 저장해 기준을 고정한다. 참고 사이트의 개인 문구·자격·성과·연락처를 본인의 것으로 복사하지 않는다.

## Current State

- Plan 00–03은 Verified. Git HEAD 기준은 `b213173`, 브랜치는 `develop`이다. Plan 03 구현·문서·증거는 아직 미커밋 상태이므로 이를 작업 시작 기준으로 보존한다.
- Plan 03은 공통 테마·글꼴·shell과 접근성을 검증한 것이며, 참고 홈과 시각적으로 동일하다는 판정이 아니다. 기존 카드와 섹션 구조를 유지하는 당시 제약은 본 계획의 홈 재구성 범위에서 대체된다.
- 현재 홈은 큰 소개 박스 안의 이름/소개/소속/통계, 프로젝트 4개, 이미지 글 카드 12개 순서다. 참고의 역량·성장 과정·독립 성과 지표·기술/학력·마무리 영역이 없다.
- `ProjectShowcase`는 Home과 `/work`가 공유한다. `PostCard`도 다른 페이지가 사용한다. 홈 개선을 위해 공유 카드의 다른 소비자까지 재설계하지 않는다.
- `BlogContainer`는 `getRecentPosts(12)`를 호출하고 기존 DTO로 매핑해 Section3에 전달한다. 홈 Suspense는 이미지 카드 6개의 BlogSkeleton을 사용한다.
- 원본 자료에 개인 정보, 경력 지표 4개, 성장 단계 4개, 역량 4개, 프로젝트 4개, 학력 1개가 있다. 자격증 자료는 없다.
- 현재 `.portfolio-container`는 좌우 padding을 포함해 최대 72rem이다. 데스크톱 내부 폭은 1,072px인 반면, 참고 본문은 내부 콘텐츠가 최대 1,152px이고 section gutter가 별도다.
- 1,280px viewport에서 참고 Hero H1은 84px/line-height 0.98/weight 600, 소개는 28px/1.3이며 Hero 내부 최대 폭은 896px이다. 일반 본문 내부 최대 폭은 1,152px이다. 참고 프로젝트 카드는 2열, gap 16px, radius 28px, padding 40px, 별도 테두리 없는 muted surface다.
- 참고의 일반 데스크톱 section padding은 160px이고 Hero는 상단 176px/하단 160px이다. 첫 역량 영역 상단 등 예외가 있으므로 모든 섹션에 같은 padding을 기계적으로 적용하지 않는다. 모바일 수치는 실제 해당 viewport에서 별도 확인한다.
- 공통 헤더·푸터도 아직 참고와 차이가 있다. 푸터 링크가 가로로 나열되고 그룹 제목/세로 목록 구조가 없다.

## Decisions

### User Decisions

- 디자인과 구성 모두 참고 사이트와 동일하게 가져가고 내용만 본인 것으로 바꾼다.
- 기존 화면을 전면 재구성해도 된다.
- 한국어 전용, Pretendard, 기존 브랜드 심볼, 라이트·다크 및 system/saved theme 동작을 유지한다.
- AI UI는 완전히 제외하며 기존 AI 관련 경력·글 원문은 그대로 둔다.
- 경력 사실·성과·프로젝트 내용 정리는 전체 UI 작업 이후다.
- 자료 없는 자격증은 생략하고 성장 과정은 기존 4개로 배치한다.
- 계획 요약의 범위·콘텐츠 매핑·검증 기준을 사용자가 “확정”으로 최종 승인했다.

### Approved Recommendations

- 이번 단위는 Home 재구성과 필요한 공통 헤더·푸터 보정이다. 다른 페이지의 본문 재설계는 후속 계획으로 분리한다.
- Hero CTA는 `프로젝트 보기` → `/work`, `이력서 보기` → `/resume`이다.
- 홈 프로젝트 4개는 기존 순서를 유지한다. `featured` 원본을 바꾸거나 true인 2개만 남기지 않는다.
- 최근 글은 이미지 없는 최신 2개로 표시하고 `/writing` 전체 보기와 기존 글 상세 링크를 제공한다.
- 하단 안내는 대형 문구와 GitHub·Velog 링크로 구성한다. 새 Email/LinkedIn/지역 공개나 연락 폼은 추가하지 않는다.
- 홈 전용 프로젝트 카드와 글 표현을 분리해 다른 페이지의 카드 구조를 보존한다.
- 기능 정상 여부와 참고 디자인 일치 여부를 별도 검증한다. 둘 중 하나만 통과해서는 완료가 아니다.

## Scope

### Home Composition and Content Mapping

순서는 아래 표를 따른다. 데이터는 기존 export를 참조하고 별도 경력 복사본을 만들지 않는다. 섹션명·탐색 문구는 한국어 UI 문구로 구성하되 새로운 경력 주장이나 성과를 작성하지 않는다.

| 순서 | 시각 구조 | 콘텐츠와 링크 |
| --- | --- | --- |
| 1 | 중앙 정렬 Hero: 작은 이름, 대형 직무 H1, 소개, primary/text CTA, 작은 소속 줄 | `personalInfoData`의 name/position/introduction/company/period. CTA는 `/work`, `/resume`. 이름을 H1으로 둔 현재 소개 박스는 대체 |
| 2 | 큰 2단계 명도 제목과 소개, 01–04 번호 카드 | `capabilitiesData`의 기존 순서·title·description. 참고는 업무 절차지만 본인은 기존 역량으로 대응하며 절차 경력을 새로 주장하지 않음 |
| 3 | sunken 배경의 경력 흐름 | `growthSteps` 4개 year/title/description. desktop 4열, mobile 세로 배치. 참고의 5번째 단계를 가짜로 추가하지 않음 |
| 4 | 큰 지표 4개, 프로젝트 카드 4개, 전체 보기 | `careerMetrics` 값/label/caption 보존. `약 3년`은 `/resume`, `80여 개`·`6,455건+`·`19종`은 `/project/realtime-support`. 프로젝트는 원래 순서와 상세 URL 유지 |
| 5 | 기술·학력의 텍스트 중심 2열 | 기존 역량 4개 title/technologies를 기술 그룹으로 재사용, personalInfoData university/degree/gpa. 자격증 목록 및 없는 학위·기관·시점은 생성하지 않음 |
| 6 | 구분선과 제목·요약·보조 정보·화살표 중심 글 행 2개 | 기존 recent 정렬의 처음 2개. 제목/intro/기존 태그를 사용하고 없는 카테고리는 만들지 않음. 썸네일과 언어 전환 제외 |
| 7 | 넓은 여백, 대형 마무리 문구, 링크 2개 | 예: `더 알아보기`와 기존 GitHub·Velog. 취업 가능 여부나 연락 응답 보장 등 새로운 사실은 작성하지 않음 |
| 8 | 소개 / 사이트 메뉴 / 외부 링크 그룹 및 하단 안내 | 기존 이름·직무·한국어 내부 메뉴·GitHub·Velog. 저작권 표시를 둘 경우 현재 연도와 본인 이름 사용, 참고 소유자/AI 안내는 복제하지 않음 |

- Hero의 기존 영문 직무 등 고유 표현은 유지할 수 있다. 원본 소개를 임의로 축약·윤문하지 않고 폭과 줄바꿈으로 조정한다.
- 프로젝트 카드는 참고의 label → title → summary → 지표 2개 → 상세 링크 구조를 따른다. label에는 사실과 무관한 Client/Independent 분류를 발명하지 말고 기존 상태를 텍스트로 사용한다. 특히 `출시 보류`는 홈에서도 명확히 남긴다.
- 카드 제목/summary와 첫 지표 2개는 기존 값을 사용한다. 현재 색상 막대·큰 아이콘·기술 배지·중복 subtitle/period 등 참고와 다른 카드 장식/정보 블록은 홈에서 제거할 수 있다. 원본 필드와 상세·이력서 표시는 삭제하지 않는다.
- 성과 지표의 집계 시점 및 scope 의미를 보존한다. 디자인을 맞추려고 수치나 단위를 바꾸거나 모든 프로젝트가 운영 중인 것처럼 표현하지 않는다.

### Visual Fidelity and Responsive Behavior

- 구현 전 참고의 Home 전체와 각 섹션, Header/Footer를 같은 viewport에서 관찰·측정한다. 기준 캡처와 측정 기록에 날짜·viewport·theme을 남긴다.
- 참고의 내부 폭/외곽 gutter 구분을 정확하게 적용한다. 홈/헤더/푸터 정렬 보정을 위해 좁게 범위가 지정된 container를 사용할 수 있다. 다른 페이지까지 전역 72rem 규칙을 무조건 교체하지 않는다.
- typography size/weight/letter-spacing, 두 명도의 제목, 카드 radius/padding/gap/surface, 구분선, 버튼 형태, 섹션별 여백과 배경 전환을 실제 참고와 맞춘다. 기존 디자인 토큰에 이름이 있다는 이유만으로 시각 일치로 간주하지 않는다.
- desktop 역량 4열·성과 4열·프로젝트 2열, 기술/학력 2열을 따른다. 중간 viewport와 mobile은 참고의 실제 열 전환을 따른다. 성장 과정만 실제 4개 데이터에 맞춘다.
- 한국어 글꼴 특성으로 제목 줄바꿈과 line-height를 최소 보정할 수 있다. 고정 높이/과도한 축소/내용 잘라내기로 임의의 픽셀 일치를 만들지 않는다.
- hover surface/화살표 이동 및 reveal은 참고 수준으로 절제한다. 새로운 장식, 그라데이션, 추가 아이콘, 과한 그림자·모션을 만들지 않는다. reduced-motion에서는 즉시 읽을 수 있어야 한다.
- 참고와 같은 색상 계층을 사용하되 기존 접근성 대비 기준도 유지한다. 두 기준이 충돌하면 조용히 임의 변경하거나 통과 처리하지 말고 차이와 이유를 검증 기록에 명시한다.

### Global Shell

- Header의 높이·좌우 정렬·메뉴 간격·active underline·theme control을 참고와 대조해 보정한다. 기존 브랜드 심볼/성찬홍 이름과 세 한국어 메뉴를 유지한다.
- AI control 및 그 빈자리는 만들지 않는다. mobile에서 이름을 숨기는 기존 규칙과 직접 노출 메뉴, skip link/단일 main/키보드 접근성을 유지한다.
- Footer는 참고의 그룹 레이아웃과 여백/구분선/타이포를 적용하고 링크 내용을 기존 값으로 교체한다. 바닥에 fixed로 띄우지 않는다.
- 공통 shell 변경은 모든 페이지에 반영되므로 타 페이지 smoke/overflow/테마 회귀를 검사한다. 해당 페이지 본문은 이번 재설계 대상으로 확대하지 않는다.

### Blog States and Accessibility

- 기존 `getRecentPosts` 호출 인자만 2로 줄이고 DTO·정렬·원본 데이터를 유지한다. 홈 외 목록 pagination/filter를 변경하지 않는다.
- Suspense skeleton은 최종 텍스트 행 2개 형태로 맞춘다. 로딩 중에도 헤더·다른 홈 섹션은 보이고 큰 레이아웃 이동을 줄인다.
- 글 0개·1개와 조회 실패를 처리한다. 0개에는 한국어 빈 안내/전체 글 링크, 실패에는 별도 한국어 실패 안내/전체 글 링크를 제공한다. 실패를 성공한 빈 목록으로 잘못 알리지 않는다. fake 글로 두 칸을 채우지 않는다.
- 글 상세 URL 생성/slug fallback은 기존 동작을 재사용한다. 썸네일을 안 보인다는 이유로 저장 이미지나 글 본문을 삭제하지 않는다.
- semantic heading(H1 1개), section/list/definition list, 실제 anchor, 명확한 focus, 색상 외 상태 표현을 유지한다. skeleton·장식은 보조 기술에 불필요한 항목으로 읽히지 않게 한다.

## Non-Goals

- Work/Project/Resume/Writing/Blog 본문 템플릿의 전면 재설계
- 경력 문구·성과·상태·프로젝트 순서/featured 재작성, 새 자격증·연락처·지역 공개
- AI UI/API 복구, 언어 전환, 새로운 공개 route/필터/콘텐츠 분류
- DB migration/쓰기/재수집, API 계약 변경, 저장 글 편집
- SEO 전략 변경, 전역 의존성 업그레이드, 전체 lint/format 정리
- Vercel 배포, 운영 서비스/DB 검증, 승인 없는 commit/push

## Route and Navigation Changes

경로 변경: None. `/`, `/work`, `/project/[slug]`, `/resume`, `/writing`, `/blog/[slug]` 유지. `/career` 및 exact `/blog`의 308/query 보존, `/ask` 404를 유지한다.

홈의 위 표 CTA/지표 링크와 글 2개 노출만 변경한다. 기존 GitHub·Velog 값만 사용하고 외부 새 창 링크에는 적절한 rel을 유지한다. 검색·태그·페이지 query 및 이력서 fragment 동작은 변경하지 않는다.

## Data and Database Changes

DB 변경: None. 기존 public 글 읽기 외 외부 데이터 작업은 없다. 경력·프로젝트 export, Blog DTO·repository/service/API·migration·AI 서버 코드 및 Plan 01 보호 경계를 유지한다.

- 홈 표현을 위한 링크 매핑/기존 필드 조합만 presentation 계층에 둔다. 원본을 복사한 별도 경력 레코드나 새 CMS를 만들지 않는다.
- `careerData.ts`, `projects.ts` 전체와 프로젝트 4개 ID/순서/status/featured/수치를 실행 전후 비교한다.
- 홈 화면에서 안 쓰는 항목도 원본에서 지우지 않는다. 최근 글 조회 수 변경은 데이터 삭제가 아니다.

## SEO Changes

metadata 정책 변경: None. title/description/canonical/OG/Twitter/JSON-LD/sitemap/robots를 유지한다. `lang="ko"`, 서버 HTML의 이름·소개·프로젝트 링크·의미 있는 본문을 유지한다. 새 H1은 기존 직무로 구성하고 이름은 별도 소개 텍스트로 노출한다. client-only mount를 기다려야 전체 홈을 읽는 구조를 만들지 않는다.

## File Changes

### Create

- `src/components/domain/home/ReferenceHome.tsx` — Hero/역량/성장/성과/기술·학력/하단 안내 조립 및 기존 콘텐츠 참조
- `src/components/domain/home/HomeProjectCard.tsx` — Home 전용 reference 카드
- `src/components/domain/home/home-reference.module.css` — Home 한정 section/typography/grid/반응형/모션
- `doc/projects-reorganization/audit/04-home-reference-verification.md` — 구현 후 별도 검증 기록
- `doc/projects-reorganization/baseline/plan04/` — 실행 전 기준, 참고/구현 캡처, 측정값, 비교표, 회귀 결과
- 필요 시 `doc/projects-reorganization/audit/04-*.cjs` 범위의 검증 보조 도구. 기존 도구/허용된 브라우저 기능을 재사용하고 새 프레임워크는 추가하지 않는다.

### Update

- `src/app/ClientPage.tsx` — 기존 3영역 조립을 ReferenceHome으로 교체하고 글 slot을 정확한 위치로 연결
- `src/app/page.tsx` — 홈 slot/Suspense 연결에 필요한 부분만 변경, metadata/JSON-LD 유지
- `src/components/domain/home/Section3/index.tsx` — 홈 전용 글 2개 텍스트 행/빈 상태
- `src/components/home/BlogContainer.tsx` — 조회 2개/기존 DTO/안전한 조회 실패 UI
- `src/components/skeletons/BlogSkeleton.tsx` — 홈 글 2행 skeleton
- `src/components/layout/SiteLayout/parts/Header.tsx`, `Footer.tsx` — 승인된 reference shell 보정
- `src/app/globals.css` — shell 보정/한정 container 규칙. 다른 본문 layout을 임의 변경하지 않음
- `src/styles/portfolio-tokens.css` — 실제 측정으로 필요한 누락 토큰만 추가. 공통 값 변경은 사용처 영향 검증 필수
- 본 plan, `doc/projects-reorganization/NEXT_STEPS.md` — 상태와 구현·검증 인계 기록

### Retain / Remove Conditions

- `ProjectShowcase/index.tsx`와 공용 `PostCard.tsx`는 기존 소비자 및 화면을 위해 유지한다. 이번 Home 카드 구조를 이 파일들에 강제로 적용하지 않는다.
- `CareerHighlight/index.tsx`는 새 Hero 연결 후 모든 참조가 없어졌음을 확인한 경우에만 제거할 수 있다. 참조가 있으면 유지한다. 무관한 비활성 Section1/2/4까지 청소하지 않는다.
- 데이터/타입/SEO/DB/API/AI/패키지·lockfile, Pretendard 자산은 유지한다. 공통 PrimaryButton/TextLink/ThemeToggle은 기존 것을 우선 재사용한다.

## Implementation Steps

1. Plan 03 Verified 및 본 계획 Approved, AGENTS와 현재 Git 상태를 확인한다. 미커밋 Plan 03/사용자 변경을 보존하고 파일별 현재 기준 및 데이터/SEO 출력을 확보한다.
2. 실제 참고 Home의 light/dark, desktop/mobile 캡처와 주요 치수를 같은 viewport로 기록한다. 참고 개인 콘텐츠와 승인된 예외 목록을 분리한다.
3. 원본 export 기반 콘텐츠 매핑과 링크를 구성하고 ReferenceHome/홈 전용 카드를 만든다. Hero부터 최하단까지 승인된 순서로 조립한다.
4. 기존 소개 박스/홈 프로젝트 장식/이미지 글 그리드를 대체한다. 글 조회 2개, 로딩/빈/실패 상태 및 기존 slug 링크를 연결한다.
5. 실제 reference 치수로 typography/container/section/card/반응형을 조정하고 헤더·푸터의 남은 차이를 보정한다.
6. 각 섹션을 같은 viewport의 참고와 나란히 비교한다. 기능 테스트와 독립적으로 시각 불일치를 찾아 수정하고 허용 예외만 남긴다.
7. 로컬 기능/접근성/콘텐츠/SEO 및 공통 shell의 다른 페이지 회귀를 검사한다. 개발 서버와 분리된 build/tsc를 사용한다.
8. 파일 목록과 수용 기준을 대조하고 구현 로그·증거·제한 사항을 저장한다. 상태를 `Implemented - Pending Verification`으로 변경해 별도 `$portfolio-verify`에 인계한다. 실행 단계에서 Verified를 선언하지 않는다.

## Validation

### Commands and Environment

```bash
git diff --check
npm run lint
npm run build
npx tsc --noEmit
```

- build 및 이후 tsc는 Plan 03의 분리 스냅샷 방식 등으로 개발 서버와 별도 `.next`를 사용한다. 같은 checkout의 가동 중인 dev 출력과 충돌시키지 않는다. 검증 포트는 비어 있는 로컬 포트를 사용하며 사용자 서버를 임의 종료하지 않는다.
- 전체 lint의 기존 `eslint-plugin-prettier` 누락은 기존 기준선과 비교해 기록한다. 변경/신규 TS/TSX 전부에 scoped Next/TypeScript 규칙 검사를 병기하고 새 오류는 허용하지 않는다.
- diff/type/build와 신규 CSS·스크립트·import 참조를 확인한다. 기존 Plan 03 검사 중 Home 12개/구형 카드 DOM 전제만 새로운 요구에 맞춰 Plan 04에서 교체한다. 과거 증거나 데이터 보호 검사를 덮어쓰거나 완화하지 않는다.
- 운영 배포, `verify:security`, migration/DB catalog 검사, crawler는 실행하지 않는다. 네트워크는 공개 참고 확인과 기존 public 글 읽기에 한정한다.

### Visual Comparison

- 1440×900, 390×844의 light/dark에서 참고와 결과의 첫 화면·각 섹션·전체 흐름을 비교한다. 320/768/1024px 경계 및 200% 확대에서 추가 확인한다.
- reference/result 이미지와 비교표를 저장한다. 비교 항목은 순서, 주요 정렬선/내부 폭, 제목 size/weight/행간, section padding, grid 열 수/gap, card radius/padding/surface, 버튼/선/푸터 구조다.
- 내용·항목 개수·한글 줄바꿈 차이를 제외한 설명되지 않은 구조/스타일 차이가 남으면 시각 검증 실패다. 임의 유사도 점수나 텍스트가 다른 전체 이미지의 raw pixel diff 하나로 통과시키지 않는다.
- 데이터가 적어 생긴 높이 차이는 항목을 복제하거나 빈 박스로 채워 감추지 않는다. 대신 개별 컴포넌트의 치수/정렬과 section 자체 padding을 대조한다.
- 실제 브라우저를 보지 않고 source class 일치만으로 통과시키지 않는다. 캡처가 불가능하면 시각 검증 미완료로 보고한다.

### Behavior, States and Preservation

- Home의 CTA/성과 링크/프로젝트 4개/글 2개/전체 보기/GitHub·Velog가 의도한 목적지로 이동한다. 글 상세 fallback도 보존한다.
- 글 0/1/2개, loading/조회 실패를 안전한 로컬 fixture로 확인하고 외부 DB를 수정하지 않는다. 본문과 skeleton의 가로 overflow/과도한 화면 이동을 확인한다.
- H1 1개, single main, keyboard/skip/focus, hover/reduced-motion, 저장 테마/새로고침/초기 hydration을 점검한다. 기본 본문 대비 4.5:1, 큰 글자 및 의미 있는 UI 경계/focus 3:1 기준을 유지한다.
- `/work`, 프로젝트 4개, `/resume`, `/writing`, 대표 글 상세, 404의 공통 shell을 양 테마/모바일·데스크톱에서 확인한다. 검색/filter/page query와 이력서 fragment가 보존돼야 한다.
- 기존 redirect, unknown project/`/ask` 404, Plan 01의 차단 route를 로컬로 확인한다. AI UI 및 자동 `/api/chatbot/*` 요청은 없어야 한다.
- 경력/프로젝트 원본 동등성, metadata/canonical/OG/Twitter/JSON-LD/sitemap/robots, 글 API 계약을 전후 비교한다. 참고 소유자의 이름·문구·연락처가 혼입되지 않았는지 확인한다.

## Acceptance Criteria

1. Hero → 역량 → 성장 과정 → 성과/프로젝트 → 기술/학력 → 최근 글 → 마무리 → Footer의 승인된 순서로 Home이 재구성된다.
2. 같은 viewport의 실제 참고 비교에서 디자인·구성 기준을 충족한다. 기존 박스형 Hero/장식 많은 카드/이미지 글 그리드가 Home에 남지 않는다.
3. 원본 기반 역량 4개, 성장 4개, 지표 4개, 프로젝트 4개, 최신 글 최대 2개가 정확하게 연결되며 없는 자격증/성과/경력을 만들지 않는다.
4. 경력 사실·프로젝트 순서/status/featured/수치와 글 원본은 보존된다. `출시 보류`가 운영 성과로 오인되지 않는다.
5. 한국어/Pretendard/기존 심볼/AI·언어 UI 제외/기존 공개 링크만 사용이라는 예외 외 임의의 디자인 변형이 없다.
6. Header/Footer가 reference 구조를 따르고 다른 페이지의 본문·글 기능·앵커·테마를 손상시키지 않는다. 홈 전용 카드 변경은 `/work`와 공용 PostCard에 번지지 않는다.
7. loading/empty/error/소량 글, 모바일/확대/키보드/reduced-motion에서 내용과 조작이 접근 가능하며 페이지 가로 overflow가 없다.
8. 경로/SEO/보안/데이터 회귀가 없고 새 DB/API/배포 작업은 없다.
9. 분리 build/tsc/diff 및 변경 범위 lint가 통과한다. 전역 lint 기준선과 제한 사항은 사실대로 기록한다.
10. 시각 비교 증거와 기능 검사 결과를 각각 남기고 별도 portfolio-verify가 최종 판정한다. 기능 정상만으로 디자인 일치 또는 전체 사이트 redesign 완료를 선언하지 않는다.

## Risks and Rollback

- 한글과 원문 길이가 달라 전체 높이를 픽셀 단위로 같게 만들 수는 없다. 콘텐츠를 변조하지 않고 승인된 예외를 기록하면서 배치/컴포넌트/여백 기준을 맞춘다.
- 참고 사이트는 바뀔 수 있으므로 구현 시점 기준을 기록한다. 새로운 기능/섹션이 나타났다고 자동으로 범위를 확대하지 않는다.
- 공통 container/token 변경은 다른 페이지를 흔들 수 있다. Home/shell 한정 규칙을 우선하고 모든 소비자에 영향이 있는 변경은 회귀 검사한다.
- Plan 03 변경이 미커밋 상태다. HEAD 대비 전체 변경을 Plan 04로 오인하지 않고 시작 시 파일 스냅샷/상태를 기록한다. rollback은 Plan 04 delta만 선택적으로 되돌리며 Plan 03/사용자 변경·DB를 건드리지 않는다.
- 홈 데이터가 reference의 업무 방식/자격과 의미가 다르므로 라벨만 따라 거짓 분류를 만들지 않는다. 승인된 본인 콘텐츠 대응을 유지한다.
- 시각 기준과 사실 보존/접근성이 충돌해 승인된 예외로 해결할 수 없으면 근거를 보고하고 사용자 결정을 받는다. 검증 기준을 조용히 낮추지 않는다.

## Follow-Up Plans

- 본 계획 실행 후 `$portfolio-verify`로 Home reference 일치 및 회귀를 별도 판정한다.
- 이후 Work/Project, Resume, Writing/Blog를 각각 동일한 디자인·구성 충실도 원칙으로 인터뷰·승인한다. 이번 승인으로 다른 페이지 본문 구현을 자동 시작하지 않는다.
- 전체 UI 완료 후 경력 내용과 성과 표현을 별도로 정리한다.
- AI 재검토와 기존 lint/성능 과제는 후속으로 유지한다. 운영 검증·배포는 사용자 요청 없이 완료 조건으로 복구하지 않는다.

## Approval Record — 2026-09-29

- 사용자는 현재 랜딩이 참고와 다름을 지적하고, “디자인도 동일하게”, “구성도 동일하게”, “내용만 내껄로”라는 목표를 명시했다.
- 검토 후 기존 화면 전면 재구성, 데이터 없는 항목 생략/실제 개수 유지에 동의했다.
- Home 및 Header/Footer 범위, 기존 콘텐츠 매핑, 파일 영역, 시각·기능 분리 검증, 데이터/운영 비범위 요약에 “확정”으로 승인했다.
- 이번 단계는 계획 저장만 수행한다. 구현·검증·커밋·배포는 수행하지 않았다.

## Implementation Log — 2026-09-29

- 사용자 요청에 따라 `portfolio-execute`로 본 계획만 구현했다. 실행 전 Plan 03 미커밋 상태를 `baseline/plan04/before.json`과 분리 소스 스냅샷에 보존했다.
- 신규 `ReferenceHome.tsx`, `HomeProjectCard.tsx`, `home-reference.module.css`로 승인된 7개 홈 영역과 원본 데이터 연결을 구성했다. `ClientPage.tsx`는 서버에서 읽을 수 있는 조립 컴포넌트가 됐다.
- `Section3/index.tsx`, `BlogContainer.tsx`, `BlogSkeleton.tsx`를 이미지 없는 최근 글 2행 및 loading/empty/error 상태로 변경했다. DTO와 기존 링크 fallback은 유지했다.
- `Header.tsx`, `Footer.tsx`, `globals.css`, `portfolio-tokens.css`에서 홈/공통 shell 범위만 보정했다. 총 앱 소스 delta는 11개 파일이다.
- `page.tsx`의 기존 slot/Suspense 및 SEO 연결은 이미 새 컴포넌트와 호환되어 수정하지 않았다. 구형 CareerHighlight는 삭제가 선택 사항이므로 보존했다. 공유 ProjectShowcase/PostCard 및 다른 페이지 본문은 변경하지 않았다.
- 실제 참고 1440×900/390×844 양 테마를 측정·캡처했다. 본문 내부 폭 1152, Hero 896, desktop H1 84, section 160, project radius 28/padding 40/gap 16 등 실측을 반영했다. 한글/실제 자료 개수에 따른 높이 차이는 보존했다.
- 대비 기준과 충돌하는 작은 보조 텍스트는 기존 접근 가능한 muted 색상을 사용하고, 푸터 작은 라벨은 기존 13px 기준을 유지했다. 참고의 약한 색상/11px과의 차이를 최종 비교표에 명시한다. 별도 reveal 지연은 넣지 않아 서버 본문과 reduced-motion에서 즉시 읽힌다.
- 구현 중 분리 production build, TypeScript, 변경 TSX 8개 focused lint(오류·경고 0), HTTP/상태 검사 56개가 통과했다. 전체 lint의 기존 `eslint-plugin-prettier` 누락은 동일하며 해결 범위에 포함하지 않았다.
- 320/768/1024 경계, 주요 9개 경로 × 양 테마 × desktop/mobile의 overflow 및 shell, 저장 테마, 글 검색/태그/페이지, 이전 경로 fragment를 확인했다. 상세 증거와 최종 재검사는 별도 verification에 넘긴다.
- 검증 도구는 `audit/04-workspace.cjs`, `04-http-check.cjs`, `04-local-evidence.cjs`에 한정했다. 외부 DB 쓰기·배포·커밋·push는 하지 않았다.
- 사용자가 실행과 검증을 함께 요청했으므로 동일 턴에서 `portfolio-verify`를 별도 단계로 이어간다. 이 구현 로그 자체는 최종 통과 판정이 아니다.

## Verification Log — 2026-09-29

- 별도 `portfolio-verify` 판정: **PASS**. 승인 범위·시작 스냅샷 대비 실제 11개 소스 delta·구현 로그·수용 기준 10개를 검토했다. 검증 단계에서는 앱 코드를 변경하지 않았다.
- 실제 참고 및 결과의 desktop/mobile × light/dark 시각 비교, 320/768/1024 경계, 제어된 200% 확대/모션 제거, 상태·키보드·테마·다른 경로 shell 회귀를 확인했다. 접근성 색상/라벨 크기 보정과 테스트 방법의 한계를 숨기지 않고 기록했다.
- 분리 build(118 정적 페이지), post-build tsc, diff, 변경 TSX 8개 scoped lint 통과. HTTP/상태 검사 56/56 통과. 전체 lint는 기존 prettier plugin 누락(exit 2) 그대로이며 전역 통과로 보고하지 않는다.
- 데이터·API·공유 카드·타입의 변경 없음, 최종 build/source 일치, public/styles/config/dependency 108개 파일 보존 확인. 개발 서버 3000에도 변경 반영을 확인했다.
- 상세 비교표/증거/명령/제한: `doc/projects-reorganization/audit/04-home-reference-verification.md` 및 `baseline/plan04/`.
- 이번 판정은 Home과 공통 shell에 한정한다. 다른 페이지 본문, 운영 검증, 경력 재정리, AI 복원은 하지 않았다. 커밋·push·배포도 하지 않았다. 다음 승인된 계획은 없다.
