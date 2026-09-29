# 02. Information Architecture and Content Model

Status: Verified

Approved: 2026-09-29 (Asia/Seoul)

## Goal

기존 경력·프로젝트·글 내용을 보존하면서 참고 사이트의 페이지 구조에 맞춰 탐색 경로와 콘텐츠 책임을 분리한다. 실제 접근 가능한 프로젝트 목록·상세·이력서·글 목록을 연결하고, 이후 디자인 시스템 및 페이지별 UI 개선의 기반을 만든다.

한국어 UI만 제공하고 AI 기능은 화면에서 완전히 제외한다. 경력 내용 재정리는 전체 UI 개선이 끝난 뒤 별도 작업으로 진행한다.

## References

- `doc/projects-reorganization/plan/00-current-project-audit.md`
- `doc/projects-reorganization/plan/01-production-security-and-schema-alignment.md`
- `doc/projects-reorganization/NEXT_STEPS.md`
- `doc/portfolio-reference/README.md`
- `doc/portfolio-reference/01-route-map.md`
- `doc/portfolio-reference/02-page-templates.md`
- `doc/portfolio-reference/04-implementation-notes.md`
- `src/data/careerData.ts`
- `src/app/ClientPage.tsx`
- `src/app/career/CareerPage.tsx`
- `src/app/blog/BlogListPage.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/lib/repositories/blogRepository.ts`
- `src/components/domain/home/ProjectShowcase/index.tsx`

참고 문서의 구현 제안 `/work/[slug]` 대신 실제 참고 사이트의 `/project/[slug]`를 사용한다. 참고 사이트의 개인 정보, 성과 수치, 영어 콘텐츠는 복제하지 않는다.

## Current State

- Plan 00과 Plan 01은 `Verified`다. 사용자 결정으로 운영 배포·운영 애플리케이션 검증은 후속 작업의 선행 조건에서 제외됐다.
- 현재 공개 페이지는 `/`, `/career`, `/blog`, `/blog/[slug]`다.
- `careerData.ts` 한 파일이 개인 정보, 경력 지표, 성장 과정, 프로젝트 4개, 역량 및 관련 타입을 소유한다.
- 프로젝트 ID는 `realtime-support`, `snn-cms`, `erp-groupware`, `legal-platform`이다. 앞의 두 프로젝트에 `featured: true`가 지정돼 있지만 현재 홈은 4개 모두 표시한다.
- 홈 프로젝트 카드는 모달을 열고, 경력 페이지는 프로젝트별 상세를 포함한 타임라인을 표시한다.
- 글은 Supabase `velog`에서 읽는다. 글 목록은 검색·카테고리·태그·페이지네이션을 지원하며 상세 URL은 `/blog/[slug]`다.
- 내비게이션은 Home, Blog, Careers로 구성돼 있다. 공통 레이아웃에서 `ChatBot`을 렌더링한다.
- 홈 FAQ/질문 컴포넌트는 코드에 남아 있지만 현재 `ClientPage`에는 연결돼 있지 않다.
- sitemap, robots, 목록 탐색 링크와 metadata는 기존 경로를 사용한다.
- 전체 lint는 `eslint-plugin-prettier` 누락으로 종료하는 승인된 기준선이 있다. Plan 01의 빌드·TypeScript·로컬 smoke는 통과했다.

## Decisions

### User Decisions

- 참고 사이트와 동일한 경로 구조를 사용하되 AI는 이번 UI에서 완전히 제외한다.
- 경력·프로젝트는 코드 파일 기반으로 관리하고 데이터 책임을 분리한다. 글은 기존 Supabase 데이터를 사용한다.
- 한국어만 지원한다. 언어 전환이나 영문 콘텐츠 복제는 도입하지 않는다.
- AI 메뉴, 질문 버튼, 플로팅 챗봇, 홈 질문 영역 및 관련 UI를 제거한다. `/ask`는 만들지 않는다.
- AI 기능 재검토는 Plan 06으로 미루고 기존 서버 코드와 DB 데이터는 보존한다.
- 기존 경력·프로젝트의 내용, 수치, 상태, 순서와 대표 선정 값을 유지한다. UI 개선 완료 후 경력 내용을 다시 정리한다.
- 운영 배포 및 운영 애플리케이션 검증은 요구하지 않는다.
- 2026-09-29 최종 범위 요약에 사용자가 “좋다 확정하자.”로 승인했다.

### Approved Recommendations and Implementation Details

- 상단 메뉴는 `프로젝트`, `글`, `이력서`로 구성하고 로고/이름으로 홈에 이동한다.
- 기존 `/career`는 `/resume`, 정확한 `/blog` 목록 경로는 `/writing`으로 영구 리다이렉트한다. 글 상세 경로와 글 목록 query는 보존한다.
- 프로젝트 ID를 그대로 slug로 사용하고 Home, Work, 상세 페이지가 동일 레코드를 참조한다.
- 이번 단계는 실제 동작하는 경로·콘텐츠 연결과 필요한 기본 UI까지 구현한다. 최종 색상·타이포그래피·카드·공통 shell 디자인은 후속 계획에서 다룬다.
- 브랜드명, 기술명 및 기존 경력 내용 속 영문 고유 표현은 보존한다. 내비게이션·섹션 제목·버튼·접근성 안내 등 UI 문구를 한국어로 제공한다.

## Scope

### Content Ownership

- 공통 콘텐츠 타입을 `src/types/portfolio.ts`로 분리한다.
- `src/data/careerData.ts`에는 개인 정보, 경력 지표, 성장 과정 및 역량을 유지한다.
- `src/data/projects.ts`에 기존 프로젝트 4개와 slug 조회를 위한 함수를 둔다. 중복 레코드나 페이지별 복사본을 만들지 않는다.
- 원본 필드값을 보존하고 ID→slug 등 파생값만 추가한다. 상세 내용이 없는 섹션은 숨기며 새 성과·회고·프로젝트 분류를 만들어 넣지 않는다.
- 기존 `VelogPostDto`와 글 API 계약을 유지한다. 별도 글 저장소나 CMS는 도입하지 않는다.

### Functional Pages

- Home: 기존 소개와 프로젝트·글을 유지하며 프로젝트 클릭은 상세 경로, 전체 보기 링크는 새 목록 경로로 연결한다. 이번 단계에서 프로젝트 수나 대표 선정을 바꾸지 않는다.
- Work: 기존 4개 프로젝트를 현재 순서로 보여주고 각 상세로 연결한다. 참고 사이트의 client/independent/purpose 분류는 현재 콘텐츠에 강제하지 않는다.
- Project: 기존 배경, 담당 범위, 지표, 문제/접근/결과, 기술, 성과, 회고, scope note를 데이터 존재 여부에 따라 표시한다. 목록 복귀 및 기존 순서 기준 이전/다음 탐색을 제공한다.
- Resume: 개인 정보, 경력 요약, 역량, 학력 및 프로젝트 요약 링크를 제공한다. 긴 프로젝트 사례는 상세 페이지가 담당하며 원문 데이터는 보존한다.
- Writing: 기존 목록 기능과 데이터를 새 경로에 연결한다. `/blog/[slug]` 상세에서 목록 복귀 링크를 `/writing`으로 바꾼다.
- AI: 루트 layout의 ChatBot import/render를 해제하고 현재 렌더링 경로에서 모든 AI 진입점과 FAQ 자동 조회를 제거한다. 기존의 비활성 AI 컴포넌트·store·서버 코드는 재검토를 위해 남겨도 되지만 페이지에서 import/mount하지 않는다.

### Basic UI States

- 기존 컴포넌트를 재사용하며 새 목록·상세·내비게이션은 390px와 1440px에서 읽고 탐색할 수 있어야 한다.
- 프로젝트 링크는 실제 링크로 제공하고 키보드 focus가 보여야 한다. 현재 메뉴 표시와 접근성 이름은 한국어로 제공한다.
- 유효하지 않은 프로젝트 slug는 not-found로 처리한다. 빈 선택 섹션을 억지로 채우지 않는다.
- Writing의 loading/empty/error 상태를 이동 과정에서 보존한다. 새로 도입하거나 경로 이동으로 손상되는 상태는 한국어 안내를 제공한다. 기존 비관련 UX 문제는 별도 기록한다.
- 새 애니메이션은 도입하지 않는다. 불필요한 UI 라이브러리 및 테스트 프레임워크 추가는 하지 않는다.

## Non-Goals

- 기존 경력 소개, 사실, 성과 수치, 역할, 회고 및 프로젝트 공개 상태 재작성
- 최종 디자인 시스템, 전면적인 Home/Work/Resume/Writing 시각 디자인 완성
- 참고 사이트의 프로젝트 수, 분류, 개인 정보 및 EN/KO 전환 복제
- AI 응답 복구, Responses API 이전, AI 서버/API 삭제, FAQ·대화 데이터 삭제
- DB schema 변경, migration 재적용, 운영 데이터 쓰기
- 글 본문 편집·번역·재수집, crawler 복구, 관리자 CMS 개발
- 전체 lint/format 정리, CI 구축, 상위 lockfile 정리
- Vercel 배포, 운영 도메인 route 확인, 운영 DB 재검증

## Route and Navigation Changes

| 경로 | 역할 / 처리 |
| --- | --- |
| `/` | 기존 콘텐츠 기반 소개와 프로젝트·글 요약 |
| `/work` | 프로젝트 4개 목록 |
| `/project/[slug]` | 동일 프로젝트 데이터 기반 상세 |
| `/resume` | 경력·역량·학력 및 프로젝트 요약 링크 |
| `/writing` | 기존 글 목록과 검색·필터·페이지네이션 |
| `/blog/[slug]` | 기존 글 상세 주소 보존 |
| `/career` | `/resume`으로 308 영구 리다이렉트 |
| `/blog` | `/writing`으로 308 영구 리다이렉트, query 보존 |
| `/ask` | 생성하지 않으며 404 유지 |

- `/blog/:path*` 같은 포괄적 리다이렉트로 글 상세를 가로채지 않는다.
- 검색·필터·페이지네이션과 홈/모바일/상세 복귀 링크를 새 목록 URL로 맞춘다. 링크 생성 시 기존 query 값의 인코딩을 보존한다.
- `/career#<project-id>` 같은 외부 fragment 링크를 위해 Resume에 기존 섹션 ID와 프로젝트 ID를 가진 요약/링크 위치를 유지한다. 브라우저 fragment는 서버에서 읽거나 slug redirect로 해석하지 않는다.
- AI 관련 navigation, CTA, footer 안내와 언어 전환은 표시하지 않는다. 이력의 AI 경험에 관한 문장은 경력 원문이므로 삭제하지 않는다.

## Data and Database Changes

DB 변경: None. 기존 `velog`와 Chatbot 데이터 및 Plan 01 보안 경계를 유지한다.

- `CareerProject`, 경력 관련 interface/type을 공통 타입 파일로 옮기고 프로젝트 배열을 별도 파일로 이동한다.
- 프로젝트 식별자, 4개 레코드의 순서, 모든 원본 값 및 `featured` 값을 유지한다. slug는 기존 ID로부터 결정한다.
- 타입 이동에 따른 모든 소비자 import를 갱신한다. 필요하면 이행용 re-export를 두되 데이터 자체를 복제하지 않는다.
- 홈·프로젝트·이력서 UI는 분리된 동일 데이터 원본을 사용한다. article slug, 본문, API 응답 형태는 변경하지 않는다.
- 콘텐츠 보존은 실행 전 레코드와 실행 후 레코드의 비교로 확인하며 운영 DB 조회·변경은 요구하지 않는다.

## SEO Changes

- 신규 `/work`, `/project/[slug]`, `/resume`, `/writing`에 한국어 title/description, canonical, Open Graph, Twitter metadata를 제공한다.
- 프로젝트 metadata는 기존 제목·요약에서 생성한다. 이력서 metadata는 기존 경력 내용을 재사용한다.
- breadcrumb 및 기존 WebPage/CollectionPage JSON-LD의 경로를 새 URL과 일치시킨다. article JSON-LD 및 `/blog/[slug]` canonical은 보존한다.
- sitemap에 새 페이지와 프로젝트 4개를 포함하고 리다이렉트 원본 `/career`, `/blog`는 제외한다. 기존 글 상세 목록을 유지한다.
- robots의 `/blog?page=` 관련 규칙을 `/writing?page=`에 맞추며 `/api/` disallow를 유지한다. 기존 query 인덱싱 전략의 전면 개편은 하지 않는다.
- `/ask`를 메뉴·sitemap·SEO 출력에 추가하지 않는다. 사이트 도메인과 기존 이미지 자산은 유지한다.

## File Changes

### Create

- `src/types/portfolio.ts`
- `src/data/projects.ts`
- `src/app/work/page.tsx`
- `src/app/project/[slug]/page.tsx`
- `src/app/resume/page.tsx`
- `src/app/resume/ResumePage.tsx`
- `src/app/writing/page.tsx`
- `src/app/writing/WritingListPage.tsx`
- `src/components/domain/project/ProjectDetails.tsx` — 기존 상세 표시 로직을 공통화해 재사용
- `doc/projects-reorganization/audit/02-information-architecture-verification.md` — 구현 점검 결과 및 검증 증거

### Update / Move

- `src/data/careerData.ts` — 경력과 프로젝트의 데이터 책임 분리
- `src/app/career/page.tsx`, `src/app/blog/page.tsx` — exact-route 영구 리다이렉트
- `src/app/career/CareerPage.tsx` → `src/app/resume/ResumePage.tsx`
- `src/app/blog/BlogListPage.tsx` → `src/app/writing/WritingListPage.tsx`
- `src/app/layout.tsx` — AI mount 제거
- `src/app/ClientPage.tsx` — 새 페이지 링크와 한국어 UI 문구
- `src/app/blog/[slug]/page.tsx` — 글 목록 복귀 및 breadcrumb
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/components/ui/mini-navbar.tsx` — 메뉴 경로, 한국어 이름, 현재 메뉴 표시
- `src/components/layout/SiteLayout/parts/MobileNav.tsx` — 남아 있는 이전 내비게이션 경로 정리
- `src/components/domain/home/CareerHighlight/index.tsx`
- `src/components/domain/home/ProjectShowcase/index.tsx` — 모달 진입을 상세 링크로 전환
- `src/components/domain/home/Section3/index.tsx` — 글 목록 링크와 한국어 제목
- `src/components/domain/career/CareerSectionNav.tsx`, `src/components/domain/career/ProjectTimeline.tsx`, 기타 기존 경력 타입 소비자 — 책임 분리와 한국어 UI
- `src/components/domain/home/ProjectModal/index.tsx` — 상세 표현 추출 후 미사용 시 제거
- `src/lib/seo/config.ts` — 필요한 UI/metadata 한국어 표기 정렬, 도메인 보존
- `doc/projects-reorganization/NEXT_STEPS.md` 및 본 plan — 구현/검증 인계 기록

### Retain

- 기존 Blog/Velog repository·service·action·API 및 `src/types/blog.ts`의 공개 데이터 계약
- `src/components/ui/Pagination.tsx` — 새 호출부에서 `/writing`을 baseUrl로 전달
- Chatbot API, service/repository, 비활성 컴포넌트·store 및 DB schema
- Plan 01의 route 제거 및 service-role 보안 경계
- 기존 스타일/자산/공통 shell. 필요한 레이아웃 보정 외 최종 redesign은 후속 작업

## Implementation Steps

1. Plan 01 `Verified`, 본 plan `Approved`, Git 상태와 기존 사용자 문서 변경을 확인한다.
2. 기존 경력·프로젝트 데이터와 글 URL/필터 동작을 비교 기준으로 확보한다. 민감 데이터는 읽지 않는다.
3. 타입과 프로젝트 데이터를 분리하고 관련 import를 갱신한다. 원본 내용 및 ID/순서/featured 보존을 대조한다.
4. `/work`와 `/project/[slug]`를 연결하고 기존 모달/타임라인의 표현을 재사용한다. unknown slug의 not-found를 구현한다.
5. 이력서를 `/resume`으로 연결하고 프로젝트 상세 책임을 분리한다. 기존 fragment용 요약 링크 위치를 유지한다.
6. 글 목록을 `/writing`으로 옮기고 검색·필터·페이지네이션을 유지한다. 기존 두 목록 URL의 정확한 308 리다이렉트를 구현한다.
7. Home·desktop/mobile 메뉴·글 상세 복귀 링크를 갱신하고 UI 문구를 한국어로 정리한다.
8. 공통 ChatBot mount와 모든 활성 AI 진입점을 제거한다. 페이지 로드만으로 FAQ/ask 요청이나 AI store 초기화가 일어나지 않게 한다.
9. metadata, breadcrumb/JSON-LD, sitemap, robots를 새 경로와 맞춘다.
10. 아래 로컬 검증과 responsive/keyboard 점검을 실행하고 결과 및 기존 실패를 감사 문서에 기록한다.
11. 본 plan을 `Implemented - Pending Verification`으로 변경해 별도 `$portfolio-verify`에 인계한다. 실행 단계에서 `Verified`를 선언하지 않는다.

## Validation

### Commands

```bash
git diff --check
npm run lint
npm run build
npx tsc --noEmit
npm run start -- -p 3101
```

- build 성공 후 생성된 타입을 포함해 TypeScript를 검사한다. 시작 포트가 사용 중이면 빈 로컬 포트를 사용한다.
- lint는 필수 실행하되 기존 plugin 누락 기준선과 구분한다. 전체 오류를 면제하지 말고 변경 범위의 build/type/동작 검증 결과를 함께 기록한다.
- 네트워크가 필요한 기존 public 글 읽기 외 운영 route 확인·DB catalog 재검증·migration·배포 명령은 실행하지 않는다.
- 기존 `verify:security`는 운영 Supabase 검사를 포함하므로 본 plan의 필수 명령에 추가하지 않는다. 보안 route 보존은 로컬 상태 코드로 확인한다.

### Local Route and Content Checks

- `/`, `/work`, 프로젝트 4개 상세, `/resume`, `/writing`, 기존 글 상세 대표 1개: 200.
- `/career`: 308 → `/resume`; `/blog?page=2&tag=Next.js&search=Next`: 308 → query가 보존된 `/writing`.
- 기존 `/blog/[slug]`가 목록으로 redirect되지 않고 canonical을 유지하는지 확인한다.
- 존재하지 않는 `/project/<slug>`, `/ask`: 404.
- Plan 01 제거 route: GET/POST `/api/velog/crawl`, GET `/api/velog/test-detail`, GET `/api-docs`, GET `/api-docs/v1`은 404; POST `/api/chatbot/faqs`는 405.
- 경력·프로젝트 원본 데이터 비교: 4개 ID/순서/featured 및 모든 기존 필드값 동일. 원본 scope note와 출시 보류 상태가 상세에 보존됨.
- 글 검색, 태그/카테고리 필터, 페이지 이동, query 보존 및 상세 복귀 동작을 확인한다.
- 기존 `/career` fragment 예시를 브라우저에서 따라가 Resume의 대응 위치와 상세 링크를 확인한다.

### UI / SEO Checks

- 390×844 및 1440×900에서 홈·목록·대표 상세·이력서·글 페이지를 점검한다. 가로 overflow, 가려진 링크, keyboard focus, 메뉴 현재 위치를 확인한다.
- 프로젝트 unknown slug, Writing loading/검색 결과 없음/error를 안전한 로컬 수단으로 확인한다. 외부 데이터 변경이나 운영 장애 유발은 하지 않는다.
- 페이지 로드·내비게이션 중 AI 버튼/패널/메뉴가 없고 브라우저에서 `/api/chatbot/*` 자동 요청이 발생하지 않는지 확인한다.
- 한국어 UI와 `lang="ko"`, locale switch 부재를 확인한다. 보존한 기술명/경력 원문은 번역 누락으로 취급하지 않는다.
- 새 route metadata/canonical/OG/Twitter/JSON-LD, sitemap의 새 URL과 기존 article 보존, robots의 writing 규칙 및 `/api/` disallow를 로컬에서 확인한다.
- 시각 자료와 검증 결과는 감사 문서에 연결한다. credentials나 비공개 대화 데이터는 기록하지 않는다.

## Acceptance Criteria

- 신규 경로가 실제 기존 콘텐츠로 연결되고 `/ask`는 생성되지 않는다.
- 메뉴는 프로젝트·글·이력서이며 홈 링크가 제공된다. UI는 한국어 전용이다.
- 경력·프로젝트 타입/데이터 책임이 분리되고 페이지가 동일 프로젝트 원본을 사용한다.
- 기존 경력·프로젝트 내용, ID, 순서, 수치, 상태, 대표 선정 및 글 데이터가 보존된다.
- 프로젝트 카드에서 상세로 이동하며 unknown slug는 404다.
- `/career`, 정확한 `/blog`만 올바르게 308 이동하며 글 목록 query와 기존 article 주소가 유지된다.
- 경력 fragment에 대응하는 Resume 위치가 있고 프로젝트 상세로 접근할 수 있다.
- AI UI 및 자동 Chatbot 데이터 요청이 활성 렌더링 경로에서 제거된다. 기존 AI 서버 코드/DB 데이터는 보존된다.
- 글 목록 기능과 loading/empty/error 동작이 이전 과정에서 손상되지 않는다.
- 새 URL에 맞는 SEO 출력과 sitemap/robots가 제공되고 내부 링크가 불필요하게 이전 경로를 경유하지 않는다.
- 데스크톱·모바일·키보드 검증에서 변경 범위의 탐색을 막는 문제가 없다.
- build, TypeScript, diff 검사가 성공하고 lint 결과가 기존 기준선과 비교되어 기록된다.
- Plan 01 보안 변경이 유지된다. 새 DB migration, 운영 데이터 쓰기, 운영 배포/검증은 수행하지 않는다.
- 구현 로그 및 감사 증거를 남기고 최종 판정은 `$portfolio-verify`에 맡긴다.

## Risks and Rollback

- 광범위한 blog redirect는 글 상세를 깨뜨릴 수 있으므로 exact 목록 경로만 처리한다.
- 타입/데이터 분리 시 누락과 복제를 막기 위해 원본 레코드를 비교한다. 경력 원문 보정은 이번 작업에 섞지 않는다.
- 기존 fragment와 직접 링크를 놓치지 않도록 source 검색과 로컬 브라우저 검증을 함께 수행한다.
- 기존 CSS·컴포넌트에는 기준선 문제가 있을 수 있다. 변경으로 발생한 회귀와 기존 문제를 구분하며 최종 디자인은 후속 계획에서 수행한다.
- 문제 발생 시 본 plan의 코드/문서 변경만 선택적으로 되돌린다. 기존 사용자 변경, Plan 01 보안 조치와 DB 데이터는 보존한다.
- 운영 배포 검증은 완료 조건이 아니며 로컬 통과가 운영 반영을 의미하지 않는다.

## Follow-Up Plans

1. `03-design-system-and-global-shell.md`: 별도 인터뷰/승인 후 공통 디자인 토큰, typography, header/footer 및 반응형 shell 개선.
2. 후속 페이지별 UI 계획: Home, Work/Project, Resume, Writing/Blog 화면을 참고 사이트의 시각 구조에 맞춰 개선. 기존 경력 내용은 계속 유지.
3. UI 개선 완료 후 별도 경력 정리 작업: 소개·성과·프로젝트 내용 재검토. 현재 plan에서 내용을 미리 수정하지 않음.
4. `06-ask-chatbot-decision-and-implementation.md`: 추후 사용자 결정으로 AI 존치/복구 및 데이터 정책 검토. 이번 단계에서 AI 공개 일정이나 복구를 확약하지 않음.
5. `07-seo-performance-and-quality-gates.md`: 전체 lint/format 및 성능 등 기존 후속 품질 과제. 운영 검증은 사용자 요청 없이는 필수 게이트로 복구하지 않음.

다음 계획들은 아직 승인 문서가 아니다. 본 plan 승인으로 다른 계획의 구현까지 승인된 것으로 해석하지 않는다.

## Implementation Log — 2026-09-29

- 구현 커밋: `60330c9 feat: implement portfolio information architecture` (실행 전 기준 `8c03538`).
- 공통 타입/프로젝트 데이터 분리, Work/Project 신규 페이지, Resume/Writing 이동, exact 308, 메뉴/내부 링크/fragment 및 한국어 UI 반영을 완료했다. 기존 프로젝트 모달은 상세 페이지로 대체했다.
- AI mount를 제거하고 기존 비활성 UI·서버·DB를 보존했다. metadata, JSON-LD, sitemap, robots를 새 URL과 정렬했다.
- 계획의 Create/Update/Move/Retain 파일과 구현 단계 1–11을 대조했다. 추가로 `src/lib/seo/jsonLd.ts`의 SearchAction URL, `src/components/home/BlogContainer.tsx`의 기존 slug/source_url 전달, `src/components/domain/blog/PostCard.tsx`의 fallback 한국어 문구, `src/components/domain/home/Section4/index.tsx`의 이동된 데이터 import/상세 링크를 갱신했다. 승인된 링크·한국어·데이터 책임 분리 범위 안의 소비자 수정이며 제품 범위 변경은 없다.
- 원본 데이터 deepEqual, 프로젝트 4개 전체 필드 표시, 로컬 경로/SEO/390px·1440px/키보드/필터/AI 요청 점검을 수행했다. build와 TypeScript는 통과했고 전체 lint는 기존 plugin 누락으로 종료했다. 변경 파일 Next 규칙 점검은 오류 0, 기존 이미지 경고 1이었다.
- [감사 기록](../audit/02-information-architecture-verification.md), [재실행 스크립트](../audit/02-information-architecture-check.cjs), `baseline/plan02/` 결과·시각 자료를 남겼다. 상세 결과와 기존 shell 관찰 사항은 감사 기록을 참조한다.
- DB/API 계약·Plan 01 경계는 유지했으며 운영 배포/DB 재검증/데이터 쓰기는 하지 않았다. 계획 이탈이나 추가 제품 결정은 없다.
- 별도 `$portfolio-verify`에서 본 계획의 최종 판정을 수행해야 한다. 실행 단계에서는 Verified를 선언하지 않으며 Plan 03은 시작하지 않았다.

## Verification Log — 2026-09-29

- Verdict: **PASS**. `$portfolio-verify`로 승인된 수용 기준, 계획 파일 목록/단계 및 `8c03538` 대비 실제 변경을 대조했다. 구현 코드는 수정하지 않았다.
- `npm run build` 종료 0 (118개 정적 페이지), build 이후 `npx tsc --noEmit` 종료 0, `git diff --check` 통과. 로컬 서버 `npm run start -- -p 3101`에서 재검증했다.
- `npm run lint` 종료 2는 승인된 기존 `eslint-plugin-prettier` 누락과 동일하다. 이동 파일을 누락하지 않도록 `git diff --no-renames 8c03538 --name-only --diff-filter=AM`으로 수집한 TS/TSX 32개에 Next core-web-vitals/typescript 규칙을 적용했다. 오류 0, 기존 PostCard 이미지 경고 1. 구현 로그의 30개 점검에 더해 이동된 ResumePage/WritingListPage까지 포함한 최종 점검이다. 새로운 변경 범위 오류가 없으므로 승인 기준선 예외를 적용했다.
- 기본 점검 54개 재실행 통과: 원본 데이터 전체 동등성, 각 프로젝트 전체 필드, 경로/308/query/fragment/404, 보안 route, SEO, 글 기능·상태, desktop/mobile 및 자동 AI 요청 0건.
- 추가 점검 4개 통과: 한국어 404/홈 복귀, reduced-motion 설정에서 모바일 메뉴 Enter/Tab/Escape 및 프로젝트 링크 focus/Enter, Writing 오류 재시도 복구, 반복 query와 한글/특수문자 보존. 실제 2px 파란 focus ring을 계산 스타일과 캡처로 확인했다.
- 390×844 및 1440×900 시각 자료 확인. 기존 고정 footer 겹침·article 대비·기존 애니메이션은 변경 전 코드가 보존된 후속 디자인 사항이며, 이번 범위의 탐색을 막는 회귀는 발견하지 않았다. unknown slug 서버의 NoFallbackError 로그와 정상 404/한국어 복귀 화면을 함께 기록했다.
- 상세 근거: [최종 검증 기록](../audit/02-information-architecture-verification.md#final-verification--2026-09-29), [추가 검사 결과](../baseline/plan02/verification-extra.json).
- 운영 배포, 운영 DB 재검증/쓰기, migration은 수행하지 않았다. 다음으로 승인된 구현 계획은 없다. Plan 03은 별도 인터뷰·작성·승인 후 진행해야 한다.
