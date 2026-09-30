# 00. Current Project Audit

Status: Verified

## Goal

포트폴리오 전면 개편 전에 현재 저장소, 운영 사이트, 운영 Supabase의 실제 상태를 하나의 기준 문서로 확정한다.

감사 결과는 각 요소를 `유지 / 개선 / 교체 / 제거`로 판정하고, 근거·위험·의존성을 기록하여 후속 개편 plan의 순서를 결정하는 기준으로 사용한다.

## References

- `doc/portfolio-reference/README.md`
- `doc/portfolio-reference/01-route-map.md`
- `doc/portfolio-reference/02-page-templates.md`
- `doc/portfolio-reference/03-design-system.md`
- `doc/portfolio-reference/04-implementation-notes.md`
- `doc/performance/01_ttfb_improvement.md`
- `package.json`
- `src/app/`
- `src/components/`
- `src/lib/`
- `src/actions/`
- `src/fetchers/`
- `src/store/`
- `src/data/careerData.ts`
- `src/types/`
- `migrations/`
- 운영 사이트 `https://blog.dev-hong.it.kr`
- 운영 Supabase의 실제 schema metadata

## Current State

현재 확인된 주요 구조는 다음과 같다.

- Next.js 15 App Router와 React 19 사용
- Tailwind CSS 4 사용
- 공개 페이지는 Home, Blog 목록, Blog 상세, Career 중심
- API Docs 페이지와 Blog, Velog crawler, Chatbot API route 존재
- Blog 콘텐츠는 Supabase `velog` 테이블과 Velog crawler를 통해 관리
- Career 콘텐츠는 `src/data/careerData.ts`의 정적 데이터로 관리
- Chatbot은 FAQ, rate limit, FAQ log, conversation log 및 설정 저장소를 사용
- 공통 SEO metadata, JSON-LD, sitemap, robots 구현 존재
- 현재 UI는 gradient, neon, fixed floating footer와 복합 시각 효과 중심
- 목표 UI는 `doc/portfolio-reference/`의 텍스트 중심 포트폴리오 구조
- migration SQL과 실제 운영 Supabase schema가 다를 가능성이 있어 운영 schema 확인 필요

## Decisions

### User Decisions

- 운영 Supabase를 감사 대상에 포함한다.
- 운영 사이트를 감사 대상에 포함한다.
- 모든 API route의 공개 노출, 인증, 필요성, 보안 위험을 확인한다.
- 감사 결과에 후속 개편 plan 순서를 포함한다.
- plan, audit report, baseline 이미지를 별도 디렉터리로 관리한다.

### Approved Recommendations

- 운영 DB에서는 schema, constraints, indexes, RLS policies 및 aggregate row count를 확인한다.
- Chatbot conversation body, IP, User-Agent 실제 값은 열람하지 않는다.
- 각 감사 항목을 `유지 / 개선 / 교체 / 제거` 중 하나로 판정한다.
- Home, Blog 목록, Blog 상세 대표 1개, Career 화면만 desktop/mobile baseline 이미지로 보관한다.
- 현재 lint, build, local smoke test 실패는 수정하지 않고 기준선으로 기록한다.
- 감사 단계에서는 코드, DB, SEO, route를 변경하지 않는다.

### Verification Clarifications

- 이 plan은 수정 plan이 아닌 baseline audit이므로 필수 명령을 모두 실행하되, 명시적으로 수정 금지된 기존 실패는 결과를 정확히 기록했다면 audit 검증의 단독 실패 사유로 보지 않는다.
- 운영 DB의 `pg_catalog` 직접 조회 credential이 없으면 migration 정의, PostgREST schema metadata, service-role/anon 실행 결과, 접근 실패 증거를 분리해 기록하고 exact policy/index definition은 보안·schema plan의 차단 조건으로 이전한다.
- loading, empty, error는 운영 데이터를 변경하거나 인위적으로 외부 장애를 만들지 않고, 안전한 실행 검색과 source branch 분석을 병행해 기록한다.

## Scope

### Repository Inventory

- 전체 page 및 API route 목록
- global layout, header, footer, navigation 구조
- Home, Blog, Career, Chatbot 컴포넌트 구조
- server/client component 경계
- dependencies 및 주요 UI 라이브러리 사용 현황
- 중복, 미사용, 폐기 후보 파일과 패키지

### Data and Database Inventory

- Supabase client 및 service role 사용 위치
- repository, service, action, fetcher 데이터 흐름
- 운영 Supabase table, column, type, constraint, index, foreign key
- RLS 활성화 여부와 policy
- table별 aggregate row count
- migration SQL과 운영 schema의 차이
- 정적 Career 데이터와 DB 이전 가능성
- Blog crawler와 저장 데이터 구조
- Chatbot FAQ, rate limit, logs, conversations, settings 구조

### Runtime and Deployment Inventory

- 운영 사이트에서 접근 가능한 route
- desktop/mobile rendering
- 주요 route HTTP status
- loading, empty, error, not-found 동작
- browser console error
- 운영 결과와 repository code의 차이

### API Audit

- endpoint, method, input, output
- public/internal 목적
- authentication 및 authorization
- validation 및 rate limit
- 운영 필요성
- 외부 오용 가능성
- 유지, 내부화, 교체, 제거 판정
- Swagger API Docs 유지 필요성

### SEO Audit

- page별 title과 description
- canonical URL
- Open Graph 및 Twitter metadata
- JSON-LD
- sitemap
- robots
- dynamic Blog metadata
- old/new route 변경 시 redirect 필요 후보

### Quality Baseline

- lint
- production build
- local development smoke test
- 주요 페이지 desktop/mobile overflow
- 기본 accessibility 구조
- 현재 performance 및 TTFB 관련 상태

## Non-Goals

- 실제 layout 또는 component 수정
- design token 적용
- route 변경 또는 redirect 추가
- SEO metadata 수정
- DB migration 작성 또는 실행
- 운영 DB schema/data 변경
- API 제거 또는 인증 방식 변경
- 성능 문제 수정
- 참고 포트폴리오 콘텐츠, 브랜딩, 수치 복사
- 후속 plan의 구현

## Route and Navigation Changes

None. 이번 plan은 현재 route와 navigation을 기록하고 후속 변경 후보만 제안한다.

## Data and Database Changes

None. 운영 Supabase는 직접 연결해 읽기 전용으로 조사한다.

허용된 조회 범위:

- schema metadata
- table 및 column 정의
- constraints 및 indexes
- RLS와 policies
- aggregate row count
- public Blog 데이터의 구조 검증에 필요한 최소 조회

금지된 조회 및 작업:

- Chatbot conversation message body 조회
- IP 및 User-Agent 실제 값 조회
- insert, update, delete
- alter, drop, truncate
- migration 적용

## SEO Changes

None. 현재 SEO 출력과 코드 구성을 기록하고 후속 변경 후보만 제안한다.

## File Changes

### Create

- `doc/projects-reorganization/audit/current-project-audit.md`
- `doc/projects-reorganization/baseline/home-desktop.webp`
- `doc/projects-reorganization/baseline/home-mobile.webp`
- `doc/projects-reorganization/baseline/blog-list-desktop.webp`
- `doc/projects-reorganization/baseline/blog-list-mobile.webp`
- `doc/projects-reorganization/baseline/blog-detail-desktop.webp`
- `doc/projects-reorganization/baseline/blog-detail-mobile.webp`
- `doc/projects-reorganization/baseline/career-desktop.webp`
- `doc/projects-reorganization/baseline/career-mobile.webp`

### Update

- `doc/projects-reorganization/plan/00-current-project-audit.md`
  - 실행 완료 후 status와 implementation log 추가
- `.codex/skills/portfolio-verify/SKILL.md`
  - baseline audit의 명시적 recorded-failure 검증 규칙 추가

### Source Code

None. `src/`, `migrations/`, configuration 및 dependency 파일은 수정하지 않는다.

## Implementation Steps

1. Git 상태와 repository 전체 파일 구조를 기록한다.
2. Next.js page route와 API route를 전부 목록화한다.
3. global layout과 페이지별 component dependency를 추적한다.
4. Blog, Career, Chatbot 데이터 흐름을 repository → service → action/API → UI 순서로 기록한다.
5. migration SQL을 분석한다.
6. 운영 Supabase에 읽기 전용으로 연결해 실제 schema, RLS, index, aggregate count를 확인한다.
7. migration과 운영 schema의 차이를 기록한다.
8. 운영 사이트의 주요 route와 API 노출 상태를 확인한다.
9. Home, Blog 목록, Blog 상세 대표 1개, Career의 desktop/mobile baseline 이미지를 생성한다.
10. 실제 metadata, canonical, Open Graph, JSON-LD, sitemap, robots를 확인한다.
11. `npm run lint`와 `npm run build`를 실행한다.
12. local development server를 실행해 주요 route를 smoke test한다.
13. 기존 오류와 경고를 수정하지 않고 기준선으로 기록한다.
14. 각 항목을 `유지 / 개선 / 교체 / 제거`로 판정한다.
15. 위험도와 의존성을 기준으로 후속 plan 순서를 제안한다.
16. 결과를 `doc/projects-reorganization/audit/current-project-audit.md`에 작성한다.

## Validation

### Repository

```bash
git status --short
npm run lint
npm run build
```

### Runtime

- local development server가 실행되는지 확인
- `/`, `/blog`, 대표 `/blog/[slug]`, `/career`, `/api-docs` 응답 확인
- not-found 동작 확인
- desktop/mobile 화면 확인
- browser console error 기록

### Production

- 운영 route별 HTTP status 확인
- sitemap 및 robots 응답 확인
- HTML metadata와 JSON-LD 확인
- 공개 API 노출 상태 확인

### Database

- 조회가 read-only인지 확인
- migration과 실제 schema 차이 기록
- row count 외 민감 데이터가 결과 문서에 포함되지 않았는지 확인

## Acceptance Criteria

- 모든 page route와 API route가 문서화되어 있다.
- global layout과 페이지별 component 구조가 문서화되어 있다.
- Blog, Career, Chatbot 데이터 흐름이 문서화되어 있다.
- 운영 Supabase의 실제 schema, aggregate counts, 실효 anon 가시성과 확인 가능한 RLS/index 증거가 기록되어 있다. `pg_catalog` 접근이 불가능하면 그 사유와 후속 차단 조건이 기록되어 있다.
- migration SQL과 운영 schema 차이가 기록되어 있다.
- 민감한 Chatbot message, IP, User-Agent 값이 열람 또는 기록되지 않았다.
- 운영 사이트와 local site의 주요 route 상태가 기록되어 있다.
- 주요 화면 4종의 desktop/mobile baseline 이미지가 존재한다.
- SEO 구성과 실제 출력이 기록되어 있다.
- lint, build, smoke test 기준선이 기록되어 있다.
- 모든 주요 항목에 `유지 / 개선 / 교체 / 제거` 판정과 근거가 있다.
- 위험과 의존성을 반영한 후속 plan 순서가 제안되어 있다.
- source code, 운영 DB, route 및 SEO 설정이 변경되지 않았다.

## Risks and Rollback

### Risks

- 운영 DB 접속 정보가 없거나 권한이 부족해 schema 확인이 제한될 수 있다.
- 운영 환경과 현재 branch의 code가 다를 수 있다.
- production API 조사 중 rate limit이 발생할 수 있다.
- baseline 캡처 시 동적 데이터 또는 animation으로 결과가 달라질 수 있다.
- 기존 lint/build 오류가 감사 실행 자체를 방해할 수 있다.

### Mitigation

- credential 값을 출력하거나 문서에 기록하지 않는다.
- 운영 DB query는 metadata 및 aggregate read-only query로 제한한다.
- production API에는 최소 요청만 보낸다.
- baseline은 동일한 viewport와 안정화 대기 조건으로 생성한다.
- 실패한 validation은 원본 출력과 영향 범위를 기록한다.

### Rollback

감사 실행은 source code와 운영 상태를 변경하지 않는다. 생성된 audit report와 baseline 파일만 제거하면 실행 전 상태로 복구할 수 있다.

## Follow-Up Plans

감사 결과에서 의존성과 위험을 평가한 뒤 정확한 순서를 확정한다. 기본 후보는 다음과 같다.

1. Information architecture and route strategy
2. Data ownership and database redesign
3. Design tokens and typography
4. Global layout, navigation, footer, and theme
5. Home
6. Work data model and Work list
7. Project detail
8. Writing list and Blog detail
9. Resume/Career
10. Ask AI
11. SEO migration, redirects, accessibility, and final cleanup

이 목록은 감사 결과에 따라 병합, 분리 또는 순서 변경할 수 있다.

## Implementation Log

### 2026-09-28

- `doc/projects-reorganization/audit/current-project-audit.md`에 repository, route, component, data flow, API, SEO, runtime, Supabase, 품질 기준선을 통합 기록했다.
- `doc/projects-reorganization/baseline/`에 Home, Blog 목록, Blog 상세, Career의 desktop/mobile WebP 8개를 생성했다.
- 운영 Supabase는 schema metadata, aggregate count, anon 가시성만 읽기 전용으로 확인했고 message, IP, User-Agent 실제 값은 열람하지 않았다.
- 운영 `chatbot_conversations`/`chatbot_settings`의 anon 노출과 무인증 crawler/mutation API를 최우선 위험으로 판정했다.
- 위험도와 의존성을 반영해 보안/schema 정렬을 첫 번째로 하는 8단계 후속 plan 순서를 제안했다.

### Validation Results

- `npm run lint`: 실패. `eslint-plugin-prettier`가 설치되지 않아 lint 시작 전에 중단됐다.
- `npm run build`: network 허용 후 성공. 113개 static page를 생성했고 lint plugin 및 workspace root 경고를 기록했다.
- Local smoke: `/`, `/blog`, 대표 `/blog/[slug]`, `/career`, `/api-docs`, Blog API는 200, 미존재 route는 404를 확인했다.
- Production smoke: 핵심 page, sitemap, robots, 읽기 전용 API의 응답과 metadata를 확인했다. DB를 변경하는 API는 실행하지 않았다.
- Browser baseline: 모든 핵심 화면에서 desktop/mobile 가로 overflow가 없었고 Home에서 React hydration error `#418`을 기록했다.
- Change boundary: `src/`, `migrations/`, configuration, dependencies, route, SEO, 운영 DB를 변경하지 않았다.

### Verification Correction - 2026-09-28

- 누락 dependency를 임시 추가해 lint를 재확인한 결과 기존 소스에 978건의 문제(959 errors, 19 warnings)가 있어 audit 범위에서 수정할 수 없음을 확인했다. 임시 dependency 변경은 완전히 되돌렸다.
- Supabase CLI는 access token 부재로 운영 project metadata 접근이 차단됐고, service-role PostgREST에서 `pg_policies`, `pg_indexes`는 모두 404/`PGRST205`를 반환했다.
- loading, empty, error, not-found 구현을 source branch와 안전한 runtime 결과로 추가 분석했고, 운영 Blog의 미일치 검색 empty UI를 200 응답으로 확인했다.
- `.codex/skills/portfolio-verify/SKILL.md`에 baseline-only plan의 명시적 recorded-failure 예외를 추가해 원래 승인된 감사 범위와 검증 규칙을 정렬했다.

## Verification Log

### 2026-09-28 - Pass

- Acceptance criteria: route, component, data flow, API, SEO, runtime, Supabase, decision matrix, risk, follow-up plan 항목이 audit report에 존재함을 확인했다.
- `npm run lint`: exit 2. `eslint-plugin-prettier` 누락으로 실패했고, baseline-only plan에 승인된 기존 실패 기록과 일치했다.
- `npm run build`: exit 0. 113개 static page 생성과 최종 build 완료를 확인했다. lint plugin 및 workspace root 경고는 기존 baseline과 일치했다.
- Local smoke: `/`, `/blog`, 대표 `/blog/[slug]`, `/career`, `/api-docs`, `/api/blog/posts` 200, 미존재 route 404를 확인했다.
- Visual artifacts: desktop/mobile WebP 8개가 모두 0 byte보다 크고 정상 decoding됨을 확인했다. 운영 핵심 화면에 가로 overflow가 없는 기존 측정과 Home hydration error 기록을 대조했다.
- Runtime states: Blog empty 상태를 운영에서 안전하게 재현했고 loading/error/not-found source branch 분석이 추가됐음을 확인했다.
- Database evidence: schema/count/anon 가시성, migration drift, CLI token 부재, `pg_policies`/`pg_indexes` 404 `PGRST205`, 후속 차단 조건이 분리 기록됐음을 확인했다.
- Change boundary: `src/`, `migrations/`, package/dependency, route, SEO, 운영 DB에 변경이 없고 `git diff --check`가 통과했다.
- Verdict: **Pass**.
