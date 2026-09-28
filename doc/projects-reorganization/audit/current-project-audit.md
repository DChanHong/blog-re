# Current Project Audit

- 실행일: 2026-09-28 (Asia/Seoul)
- 대상 저장소: `blog-re` `develop`
- 운영 사이트: `https://blog.dev-hong.it.kr`
- 기준 plan: `doc/projects-reorganization/plan/00-current-project-audit.md`
- 상태: 구현 완료, 검증 대기

## 1. Executive Summary

현재 프로젝트는 Next.js 15 App Router, React 19, Tailwind CSS 4, Supabase를 중심으로 Home, Blog, Career, Chatbot을 제공한다. Blog 97건과 Career 콘텐츠, 동적 metadata, JSON-LD, sitemap, robots, SSG/ISR 기반은 개편 후에도 재사용할 가치가 있다.

반면 목표 포트폴리오와는 정보 구조와 시각 언어가 크게 다르다. 현재의 gradient/neon/복합 효과, floating footer, 홈·경력·블로그 UI는 전면 교체 대상이다. 가장 먼저 처리해야 할 것은 디자인이 아니라 운영 DB 노출과 공개 변경 API다.

### Critical Findings

1. **운영 DB 민감 테이블 노출**: anon key로 `chatbot_conversations` 8건과 `chatbot_settings` 1건의 count 조회가 가능했다. 본문, IP, User-Agent는 조회하지 않았지만 현재 익명 읽기 가능성 자체가 Critical이다.
2. **무인증 운영 DB 변경 API**: `GET /api/velog/crawl`은 인증·권한 검사 없이 crawl, backfill, refresh를 수행하며 service role로 운영 DB를 변경할 수 있다.
3. **기타 공개 변경/외부 호출 API**: `POST /api/chatbot/faqs`는 인증 없이 hit를 증가시키고, `GET /api/velog/test-detail`은 운영에서 외부 crawler를 실행한다.
4. **Migration drift**: 운영에는 `chatbot_settings`가 있지만 migration에 없고, migration에 있는 `chatbot_faq_log`는 운영에 없다. 대화 테이블을 공개 차단한다는 migration 의도와 실제 anon 동작도 다르다.
5. **품질 기준선 불안정**: `npm run lint`는 `eslint-plugin-prettier` 누락으로 시작 전 실패한다. 빌드는 완료되지만 동일 ESLint 경고를 출력한다.
6. **홈 hydration 오류와 시맨틱 누락**: 운영 홈의 desktop/mobile에서 React minified error `#418`이 재현됐고 `h1`이 없다. Blog 목록도 `h1`이 없다.

## 2. Scope and Method

- 저장소의 page/API route, layout, 컴포넌트, repository/service/action/fetcher, migration, dependency를 정적 분석했다.
- 운영 사이트에 최소한의 GET 요청만 보내 status, TTFB, metadata, 공개 API를 확인했다.
- 운영 Supabase는 schema metadata, table count, anon 가시성만 읽기 전용으로 확인했다.
- `chatbot_conversations`의 message, IP, User-Agent 값은 열람하지 않았다.
- DB 직접 연결 URL/관리 API credential이 없어 운영의 정확한 policy·index 이름은 `pg_catalog`에서 조회하지 못했다. 이 항목은 migration 정의와 anon 실행 결과를 분리해 기록했다.

## 3. Repository and Route Inventory

### Public Pages

| Route | Rendering / data | Current role | Decision |
|---|---|---|---|
| `/` | Static/ISR, server page + client home sections + recent posts | Career, projects, recent blog 합성 | **교체**: 참고 포트폴리오의 텍스트 중심 Home로 재구성 |
| `/blog` | Supabase 목록, search/filter/pagination | Blog index | **교체**: 정보 구조는 유지하고 목표 list template으로 재작성 |
| `/blog/[slug]` | SSG + 1일 revalidate, Supabase 본문 | Blog article | **개선**: route/콘텐츠는 유지, 레이아웃·타이포그래피·관련 탐색은 재작성 |
| `/career` | Static `careerData.ts` | 경력/프로젝 상세 | **교체**: 콘텐츠는 보존하고 Work/Resume 구조로 분리 |
| `/api-docs` | Static Swagger UI | 개발용 API 문서 | **제거/내부화**: 운영 public UI 필요성이 낮음 |
| `/robots.txt` | Metadata route | crawler 규칙 | **개선** |
| `/sitemap.xml` | Dynamic metadata route, 1일 revalidate | 페이지/97개 Blog URL 제공 | **유지** |
| `/_not-found` | Next.js not-found | 404 | **개선**: 개편 디자인 반영 |

### API Routes

인증 로직이 없는 endpoint는 모두 public으로 판정했다.

| Endpoint | Method | Input / effect | Auth / limit | Decision and risk |
|---|---|---|---|---|
| `/api-docs/v1` | GET | OpenAPI JSON | 없음 | **내부화**; 공개 attack surface 문서화 |
| `/api/blog/categories` | GET | category 목록 | 없음 | **개선**; Blog API와 중복 정리 |
| `/api/blog/posts` | GET | page, limit, category, tag, search, sort | 없음 | **유지/개선**; validation·limit 상한 필요 |
| `/api/blog/tags` | GET | tag 목록 | 없음 | **개선**; Velog API와 중복 정리 |
| `/api/chatbot/ask` | POST | question, OpenAI 호출, 대화 저장 | IP rate limit, 인증 없음 | **개선**; payload 상한, abuse 방지, 보관 정책 필요 |
| `/api/chatbot/categories` | GET | FAQ category | 없음 | **유지/통합** |
| `/api/chatbot/faqs` | GET | category별 FAQ | 없음 | **유지/통합** |
| `/api/chatbot/faqs` | POST | `faqId` hit 증가 | 없음 | **교체**; 무인증 운영 데이터 변경 |
| `/api/velog/crawl` | GET | dry/crawl/backfill/refresh, DB 쓰기 | 없음 | **즉시 내부화**; Critical, GET으로 변경까지 수행 |
| `/api/velog/posts` | GET | recent 또는 tag any/all | 없음 | **통합**; `/api/blog/posts`와 중복 |
| `/api/velog/tags` | GET | tag 목록 | 없음 | **통합**; `/api/blog/tags`와 중복 |
| `/api/velog/test-detail` | GET | 고정 Velog URL crawler 실행 | 없음 | **제거**; 운영 test endpoint |

### Global Layout and Navigation

- `src/app/layout.tsx`: Geist/Geist Mono, global metadata/JSON-LD, React Query provider, Web Vitals, `SiteLayout`, global Chatbot을 조합한다.
- `SiteLayout`: fixed header/mini navbar, blue gradient background, floating fixed footer를 모든 page에 공통 적용한다.
- Home: `ClientPage` → `CareerHighlight`, `ProjectShowcase`; server `BlogContainer` → `Section3`. `FaqContainer`/`Section2`는 현재 Home에서 렌더링되지 않는다.
- Blog: server route에서 메타데이터/SSG를 만들고 client 목록 상호작용은 React Query로 API를 소비한다.
- Career: `src/data/careerData.ts`의 정적 데이터를 세로 타임라인/카드로 렌더링한다.
- Chatbot: global client UI, Zustand 상태, React Query, Swiper FAQ, OpenAI/Supabase API를 조합한다.

### Dependencies and Removal Candidates

- 실제 사용: `framer-motion`, `swiper`, `three`, `@tsparticles/*`, `zustand`, `@tanstack/react-query`.
- 목표 디자인에서는 particle, WebGL dotted surface, neon motion이 필수가 아니다. 관련 컴포넌트가 실제 route에서 제거된 뒤 `three`, `@tsparticles/*`, 일부 `framer-motion`을 **제거 후보**로 재평가한다.
- `Section1`, `Section4`, `FaqContainer`, `MobileNav`, `dotted-surface`, `sparkles` 계열은 미사용 또는 유령 UI 후보다. 즉시 삭제하지 말고 레이아웃 교체 plan에서 import graph를 다시 확인한다.
- 루트 Next.js workspace를 `/Users/hong/package-lock.json`로 잘못 추론하는 경고가 lint/build/dev 모두에서 발생한다.

## 4. Data Flow

### Blog

1. `NEXT_PUBLIC_BLOG_URL` Velog page를 crawler가 조회한다.
2. `velogService` → `velogRepository` → service-role Supabase client가 `velog`에 upsert/backfill/refresh한다.
3. 읽기는 `velogRepository`/`blogRepository` → service → server component 또는 API route로 전달된다.
4. Blog list client는 `actions/blog.ts`의 React Query hook과 fetcher를 통해 `/api/blog/*`를 소비한다.
5. Blog detail은 `generateStaticParams`, dynamic metadata, JSON-LD, 1일 revalidate를 사용한다.

**판정**: 콘텐츠·slug·SSG/ISR 기반은 **유지**, 중복 API와 crawler 운영 방식은 **개선/교체**.

### Career and Projects

`src/data/careerData.ts` → Career/Home domain component → static page로 흐른다. 배포 없이 수정해야 하는 운영 요구가 확정되기 전에는 DB 이전 실익이 낮다.

**판정**: 데이터 모델과 콘텐츠는 **유지/개선**, 렌더링 구조는 **교체**. DB 이전은 관리 UI/CMS 요구가 있을 때만 별도 plan으로 결정한다.

### Chatbot

1. `ChatBot`/`ChatBox` → Zustand + React Query action → `/api/chatbot/*`.
2. FAQ 읽기는 `chatbot_faq`, hit 증가는 service-role repository를 사용한다.
3. AI 질문은 IP rate-limit 확인 → OpenAI 호출 → `chatbot_conversations` 로그 저장 순서다.
4. repository는 migration에 없는 `chatbot_settings`를 참조한다.

**판정**: 기능 존치 여부를 다시 결정해야 한다. 유지한다면 DB 정책·보관 정책·API abuse 방지를 먼저 **교체**한다.

## 5. Production Supabase Audit

### Actual Tables and Aggregate Counts

| Table | Rows | Actual columns observed from schema metadata | Anon count visibility | Decision |
|---|---:|---|---:|---|
| `velog` | 97 | `id`, `title`, `img_src`, `created_at`, `tags`, `detail_link`, `intro`, `inserted_at`, `slug`, `content_html`, `content_text`, `source_url`, `detail_crawled_at`, `detail_crawl_error` | 97 | **유지**; public content |
| `chatbot_faq` | 15 | `id`, `question`, `answer`, `created_at`, `category`, `sorting`, `hit` | 15 | **유지/개선**; migration 누락 column 반영 필요 |
| `chatbot_rate_limit` | 6 | `id`, `ip`, `window_started_at`, `call_count`, `limit_threshold`, `limited_until`, `created_at` | 0 | **유지/강화** |
| `chatbot_conversations` | 8 | `id`, `thread_id`, `user_message`, `assistant_message`, `ip`, `user_agent`, `created_at` | **8** | **즉시 차단**; Critical |
| `chatbot_settings` | 1 | `id`, `assistant_id`, `thread_id`, `created_at`, `deleted_at` | **1** | **즉시 차단/재설계**; Critical |
| `chatbot_faq_log` | 없음 | migration에만 정의 | 해당 없음 | **제거 또는 migration 재작성** |

### Constraints, Indexes, and RLS Evidence

- 실제 schema metadata에서 각 테이블의 UUID primary key와 column nullability/type을 확인했다.
- `migrations/velog.sql`은 `velog_tags_gin`, RLS, anon select policy `velog_read_anon`을 정의한다.
- `migrations/chatbot.sql`은 `chatbot_faq_read_anon`, conversations의 `thread_id`, `created_at`, `ip` btree index를 정의한다.
- migration은 `chatbot_rate_limit`, `chatbot_faq_log`, `chatbot_conversations`에 RLS만 켜고 public policy를 만들지 않는다.
- 그러나 실제 anon 요청에서 conversations/settings count가 보였으므로 운영 policy/grant는 migration 의도와 다르다.
- 정확한 운영 index/policy 이름과 definition은 보안 조치 plan에서 DB 직접 연결로 `pg_indexes`, `pg_policies`, `pg_class.relrowsecurity`, grants를 재확인한다.

### Schema Drift

- 운영에만 존재: `chatbot_settings`, FAQ의 `category`, `sorting`, `hit`.
- migration에만 존재: `chatbot_faq_log`.
- 의도와 다른 실행 결과: conversations/settings의 anon 읽기.
- 인덱스·policy·grant의 운영 원본을 재현할 canonical migration이 없다.

## 6. Production Runtime Baseline

### HTTP and TTFB

단일 요청 기준이며 CDN/cache 상태에 따라 변할 수 있다.

| Route | Status | TTFB | Size / note |
|---|---:|---:|---|
| `/` | 200 | 0.094s | 78,076 B |
| `/blog` | 200 | 0.382s | 57,464 B |
| 대표 `/blog/[slug]` | 200 | 0.346s | 85,035 B |
| `/career` | 200 | 0.059s | 212,843 B |
| `/api-docs` | 200 | 0.093s | 18,672 B |
| 미존재 route | 404 | 0.267s | not-found 정상 |
| `/api/blog/posts?page=1&limit=1` | 200 | 1.349s | 응답은 42,409 B로 limit=1 대비 크므 |
| `/api/velog/posts?recent=true&limit=1` | 200 | 0.988s | 42,217 B |
| `/api/velog/tags` | 200 | 0.857s | 507 B |
| `/api/chatbot/faqs` | 200 | 0.899s | 5,154 B |
| `/api-docs/v1` | 200 | 0.285s | OpenAPI JSON 6,804 B |

별도 첫 요청에서 categories/tags API가 약 2.3초 TTFB를 보였다. 현재 `doc/performance/01_ttfb_improvement.md`의 DB/API 호출 최적화 문제는 유효하다.

### Rendering and Browser Findings

| Page | Desktop overflow | Mobile overflow | Browser error | Semantic finding |
|---|---|---|---|---|
| Home | 없음 | 없음 | React minified `#418` | `h1` 0개 |
| Blog list | 없음 | 없음 | 없음 | `h1` 0개 |
| Blog detail | 없음 | 없음 | 없음 | `h1` 1개 |
| Career | 없음 | 없음 | 없음 | `h1` 1개 |

Home의 `#418`은 server/client text mismatch 계열 hydration 문제로 보이며 후속 layout plan에서 development 모드 stack으로 원인을 확정한다.

### Baseline Images

| Page | Desktop | Mobile |
|---|---|---|
| Home | `baseline/home-desktop.webp` (1440×4090) | `baseline/home-mobile.webp` (390×9065) |
| Blog list | `baseline/blog-list-desktop.webp` (1440×1796) | `baseline/blog-list-mobile.webp` (390×5461) |
| Blog detail | `baseline/blog-detail-desktop.webp` (1440×13207) | `baseline/blog-detail-mobile.webp` (390×844, viewport capture) |
| Career | `baseline/career-desktop.webp` (1440×6896) | `baseline/career-mobile.webp` (390×11949) |

Blog detail mobile은 문서 높이 16,811px로 Chrome 전체 페이지 WebP 생성 한계를 넘어 첫 viewport를 기준선으로 저장했다.

## 7. SEO Audit

| Page | Title / canonical | Robots | Structured data | Finding |
|---|---|---|---|---|
| Home | `성찬홍 | 프론트엔드 엔지니어` / root | index, follow | WebSite, Organization, Person, BreadcrumbList | 기반 **유지**, 설명·키워드·h1 개선 |
| Blog list | 고유 title / `/blog` | index, follow | CollectionPage, Organization, Person, BreadcrumbList | **개선**; h1 누락 |
| Blog detail | 게시물 title / slug URL | index, follow | Article, Person, ImageObject, Organization, BreadcrumbList | dynamic metadata **유지** |
| Career | 고유 title / `/career` | index, follow | WebPage, Organization, Person, BreadcrumbList | Work/Resume 분리 시 redirect/canonical 계획 필요 |
| API Docs | dev docs title / `/api-docs` | noindex, nofollow | 없음 | noindex는 적절, route는 내부화 후 제거 |
| 404 | global title, canonical 없음 | noindex | 없음 | 정상 |

- Open Graph `website/article` 구분과 Twitter `summary_large_image`가 적용돼 있다.
- `sitemap.xml`은 핵심 page와 Blog slug를 포함하고 200으로 응답한다.
- `robots.txt`는 `/api/`, `/api-docs`, admin/login/test, 일반 query string을 차단하고 `/blog?page=`를 허용한다. Robots는 보안 수단이 아니므로 API 인증 대체가 될 수 없다.
- 새 route를 `/work`, `/project/[slug]`, `/resume`, `/writing`, `/ask`로 도입할 경우 기존 `/career`, `/blog`, `/blog/[slug]`의 보존 또는 301 redirect/canonical 전략을 SEO plan에서 확정한다.

## 8. Quality Baseline

### Lint

- 명령: `npm run lint`
- 결과: **실패**
- 원인: ESLint 설정이 `eslint-plugin-prettier`를 참조하지만 dependency에 설치되지 않음.
- 영향: 실제 lint rule/type 문제를 아직 판단할 수 없음.

### Production Build

- 명령: `npm run build`
- sandbox 첫 실행: Google Fonts DNS 차단으로 실패.
- network 허용 재실행: **성공**, 113 static pages 생성.
- 경고: `eslint-plugin-prettier` 로드 실패, 다중 lockfile로 workspace root 오추론.
- 주요 bundle: shared first load 102kB, Home 125kB, Blog list 118kB, Blog detail 106kB, Career 103kB.

### Local Development Smoke Test

- sandbox에서는 `0.0.0.0:3000` bind `EPERM`으로 실패, 권한 허용 후 실행 성공.
- 3000은 기존 process가 사용 중이어서 3002로 실행됨.
- 냉간 컴파일 포함: `/` 200/6.57s, `/blog` 200/3.31s, 대표 detail 200/2.05s, `/career` 200/0.76s, `/api-docs` 200/1.06s, Blog API 200/1.13s, missing route 404/0.65s.
- runtime 오류는 없었고 Supabase 연결도 정상이었다.

## 9. Keep / Improve / Replace / Remove Matrix

| Area | Decision | Reason / dependency |
|---|---|---|
| Next.js App Router, React, TypeScript | **유지** | 목표 route/SEO/SSG 구현에 적합 |
| Tailwind CSS 4 | **유지** | 새 design token과 responsive layout에 재사용 |
| Supabase Blog content 97건 | **유지** | 기존 URL·SEO 자산 |
| Blog repository/service 계층 | **개선** | Blog/Velog 중복 API, 과대 응답, validation 정리 |
| Static Career data | **유지/개선** | CMS 요구 전까지 DB 이전 불필요 |
| Metadata, JSON-LD, sitemap, robots | **개선** | 기반은 좋으나 새 IA·h1·redirect 반영 필요 |
| Global header/footer/navigation | **교체** | 참고 포트폴리 IA와 시각 언어로 전환 |
| Home/Career/Blog list UI | **교체** | gradient/neon/card 중심에서 텍스트/편집 중심으로 변경 |
| Blog detail UI | **개선** | 콘텐츠/route 보존, typography/navigation 재작성 |
| Chatbot | **보류 후 교체** | 브랜드 필요성과 보안/비용/개인정보 재판단 |
| Anonymous crawler/test/mutation APIs | **제거/내부화** | 운영 오용 가능성 |
| API Docs public page | **제거/내부화** | 운영 사용자 가치가 낮고 노출만 증가 |
| Particles/WebGL/neon effect stack | **제거 후보** | 목표 디자인에 불필요, bundle/hydration 복잡도 |
| Old/unused home sections and mobile nav | **제거 후보** | 현재 import graph에서 미사용 후보 |
| Current migrations | **교체** | 운영 schema/policy와 drift, canonical 재현 불가 |
| Lint/tooling configuration | **개선** | 현재 quality gate가 실행되지 않음 |

## 10. Risk Register

| Priority | Risk | Impact | Required action |
|---:|---|---|---|
| P0 | anon으로 conversations/settings 읽기 가능 | 개인/운영 정보 노출 | RLS/policy/grant 즉시 수정, anon regression test |
| P0 | public `GET /api/velog/crawl` DB 쓰기 | 데이터 변조, 외부 호출/비용 | route 차단 또는 admin auth + POST/job로 이전 |
| P1 | public FAQ hit mutation/test crawler | 통계 오염, abuse | 서버 이벤트로 통합, test route 제거 |
| P1 | migration drift | 재현/롤백 불가 | production-derived canonical migration 작성 |
| P1 | lint gate 실패 | regression 미탐지 | plugin/config/CI 정상화 |
| P1 | Home hydration error | 신뢰성·성능·접근성 | 원인 컴포넌트 확정 후 layout 교체 전 제거 |
| P2 | Blog API 중복/과대 응답 | TTFB/traffic 증가 | field selection, cache, endpoint 통합 |
| P2 | 홈/Blog list h1 누락 | 시맨틱 SEO/접근성 | 새 page template에 h1 규칙 반영 |
| P2 | 다중 lockfile root 오추론 | build trace/캐시 혼란 | workspace root 설정 또는 상위 lockfile 정리 |

## 11. Recommended Follow-up Plan Order

1. **`01-production-security-and-schema-alignment.md`**  
   conversations/settings anon 차단, 공개 변경/crawler API 내부화, 운영 schema/policy/index 원본 확정, canonical migration 작성. 디자인 작업보다 먼저 실행한다.
2. **`02-information-architecture-and-content-model.md`**  
   목표 route map(Home, Work, Project, Resume, Writing, Ask), 기존 URL 보존/redirect, Career/Project/Blog 콘텐츠 매핑, Chatbot 존치 여부를 확정한다.
3. **`03-design-system-and-global-shell.md`**  
   타이포그래피, color, spacing, responsive breakpoint, header/nav/footer, page container, loading/error/not-found 기반을 교체한다.
4. **`04-home-work-project-pages.md`**  
   Home, Work list, Project detail을 참고 구성에 맞게 구현하고 기존 Career/Project 콘텐츠를 이전한다.
5. **`05-resume-writing-and-blog.md`**  
   Resume, Writing/Blog list, Blog detail을 재구성하고 기존 slug·SSG/ISR·필터·검색을 정리한다.
6. **`06-ask-chatbot-decision-and-implementation.md`**  
   Ask/Chatbot을 유지할지 결정하고, 유지 시 개인정보·비용·rate-limit·관리 경계를 재설계한다.
7. **`07-seo-performance-and-quality-gates.md`**  
   metadata/JSON-LD/canonical/redirect/sitemap/robots, Blog API payload/cache/TTFB, hydration, font, lint/build/test/CI를 완성한다.
8. **`08-final-migration-and-release-verification.md`**  
   데이터 migration, production smoke, visual regression, accessibility, redirects, rollback, 배포 후 모니터링을 수행한다.

## 12. Audit Completion Checklist

- [x] 모든 page/API route 문서화
- [x] global layout·page component 구조 문서화
- [x] Blog·Career·Chatbot 데이터 흐름 문서화
- [x] 운영 Supabase schema/count/anon 가시성 확인
- [x] migration drift 문서화
- [x] 민감한 conversation/IP/User-Agent 값 미열람
- [x] 운영/로컬 route status 확인
- [x] 핵심 화면 4종 desktop/mobile 기준선 저장
- [x] SEO 실제 출력 확인
- [x] lint/build/dev smoke 기준선 기록
- [x] 유지/개선/교체/제거 판정
- [x] 위험·의존성 기반 후속 plan 순서 제안
- [x] source, route, SEO 설정, dependency, 운영 DB 미변경
