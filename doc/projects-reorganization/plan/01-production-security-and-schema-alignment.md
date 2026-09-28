# 01. Production Security and Schema Alignment

Status: Implemented - Pending Verification

## Goal

디자인 개편 전에 운영 Supabase의 민감 테이블 노출을 즉시 차단하고, 무인증으로 운영 데이터를 변경하거나 외부 crawler를 실행하는 route를 제거한다.

운영 schema와 repository migration의 drift를 비파괴적 canonical schema로 정렬하고, 익명·service-role 접근 경계와 핵심 행 수 보존을 자동 검증할 수 있는 회귀 절차를 만든다.

## References

- `doc/projects-reorganization/plan/00-current-project-audit.md`
- `doc/projects-reorganization/audit/current-project-audit.md`
- `migrations/chatbot.sql`
- `migrations/velog.sql`
- `src/lib/db/supabaseServer.ts`
- `src/lib/db/supabase.ts`
- `src/lib/repositories/chatbotRepository.ts`
- `src/lib/services/chatbotService.ts`
- `src/lib/services/velogService.ts`
- `src/app/api/chatbot/faqs/route.ts`
- `src/app/api/velog/crawl/route.ts`
- `src/app/api/velog/test-detail/route.ts`
- `src/app/api-docs/page.tsx`
- `src/app/api-docs/v1/route.ts`
- `src/lib/swagger/specs/v1.ts`
- `src/app/robots.ts`
- `package.json`

## Current State

- Plan 00은 `Verified`이며 이 plan의 필수 선행 조건을 충족한다.
- 운영 Supabase에 `velog` 97건, `chatbot_faq` 15건, `chatbot_rate_limit` 6건, `chatbot_conversations` 8건, `chatbot_settings` 1건이 존재한다.
- anon key로 `chatbot_conversations` 8건과 `chatbot_settings` 1건의 count 조회가 가능했다. 실제 message, IP, User-Agent 값은 열람하지 않았다.
- `chatbot_rate_limit`은 anon에서 0건으로 보였지만 exact policy/grant는 DB 직접 접근 없이 확정할 수 없었다.
- `migrations/chatbot.sql`에는 운영 `chatbot_settings`와 FAQ의 `category`, `sorting`, `hit`가 없다.
- migration에 있는 `chatbot_faq_log`는 운영에 없고, FAQ hit route는 이 테이블을 사용하지 않는다.
- `saveConversation`, `getConversationsByThread`, `getConversationStats`는 민감 테이블에 anon server client로 접근한다.
- `getActiveChatbotSettings`, rate-limit 읽기/쓰기는 service-role client를 사용한다.
- `GET /api/velog/crawl`은 인증 없이 crawl, detail backfill, refresh, 운영 DB 쓰기를 수행한다.
- `GET /api/velog/test-detail`은 운영에서 고정 URL의 외부 crawler를 실행한다.
- `POST /api/chatbot/faqs`는 인증 없이 `hit`를 변경한다.
- `/api-docs`, `/api-docs/v1`이 운영에 공개돼 있고, Swagger UI는 `swagger-ui-dist`에 의존한다.
- `npm run lint`는 검증된 기존 baseline에서 `eslint-plugin-prettier` 누락으로 실패한다. 누락 plugin을 임시 설치하면 기존 문제 978건이 드러나며 이 plan은 전체 lint 청산을 범위에 포함하지 않는다.

## Decisions

### User Decisions

- P0 운영 RLS 차단을 먼저 적용하고 같은 plan에서 code와 migration을 정렬한다.
- 기존 Blog, FAQ, rate-limit, conversation, settings 데이터는 모두 보존한다.
- `velog`, `chatbot_faq`만 익명 읽기를 허용한다.
- `chatbot_conversations`, `chatbot_settings`, `chatbot_rate_limit`은 service role만 접근한다.
- 운영에 없는 `chatbot_faq_log`는 새로 생성하지 않는다.
- conversation 저장은 유지하되 모든 저장·조회·통계를 service-role client로 전환한다.
- 대화 보관 기간, 익명화, Chatbot 존치 여부는 `06-ask-chatbot-decision-and-implementation.md`로 미룬다.
- crawler는 중요도가 낮으므로 관리자 인증을 새로 만들지 않고 공개 route를 완전히 비활성화한다.
- `POST /api/chatbot/faqs`와 FAQ hit 증가 기능을 제거한다.
- `/api-docs`, `/api-docs/v1`을 공개 route에서 제거하고 OpenAPI spec 소스는 내부 참고용으로 보존한다.
- 운영 DB 적용을 위해 실행 전 `DATABASE_URL`을 로컬 환경에만 제공하고 커밋하지 않는다.
- 코드 변경은 agent가 Vercel CLI로 직접 배포하지 않는다. 사용자가 GitHub에 push해 Vercel 배포를 완료한 후 운영 route를 검증한다.
- 보안 롤백은 민감 테이블을 다시 공개하지 않는 roll-forward 원칙을 사용한다.
- 운영 적용 전후의 policy, grant, index, row count, route 결과를 별도 보안 검증 문서에 남긴다.
- 보안 회귀 스크립트를 `npm run verify:security`로 실행할 수 있게 한다.
- OpenAI Assistants API 종료로 인한 `/api/chatbot/ask` 404는 이 plan에서 Responses API로 재설계하지 않는다. 이 plan은 rate-limit/settings/conversation의 service-role 경계와 저장소 전환까지만 검증하고, Chatbot 응답 기능 복구는 `06-ask-chatbot-decision-and-implementation.md`로 이관한다.

### Approved Recommendations

- forward migration과 신규 환경용 canonical migration을 모두 관리한다.
- forward migration은 transaction, `ON_ERROR_STOP`, `IF EXISTS`/`IF NOT EXISTS`, policy normalization을 사용해 재실행 가능하게 작성한다.
- sensitive table의 anon/authenticated grant를 명시적으로 revoke하고, 해당 table의 기존 policy를 정규화한 뒤 service-role-only 경계를 보장한다.
- public content table은 anon/authenticated `SELECT`만 허용하고 write grant/policy를 허용하지 않는다.
- `chatbot_settings`의 활성 행을 하나로 제한하는 partial unique index를 사용한다.
- `chatbot_rate_limit(ip, window_started_at DESC)`, FAQ 정렬, Velog tags GIN, 기존 conversation index를 보장한다.
- 예상하지 못한 환경에 `chatbot_faq_log`가 있으면 삭제하지 않고 service-role-only로 잠그다.
- 검증 스크립트는 row body, credential, message, IP, User-Agent를 출력하지 않고 status/count 비교만 수행한다.
- Plan 00에 기록된 전체 lint 실패는 이 plan에서 수정하지 않는다. 필수 명령을 실행하고 baseline보다 악화되지 않았음을 기록하며, 변경 파일은 build·TypeScript·보안 회귀 스크립트로 집중 검증한다.

## Scope

### Production Security Hotfix

- `DATABASE_URL` 존재 및 운영 DB identity를 secret 출력 없이 preflight한다.
- 적용 전 table row count, RLS flag, policy, grants, indexes를 aggregate/metadata로 snapshot한다.
- production forward migration을 transaction으로 적용한다.
- anon으로 public content는 읽고 sensitive table은 읽거나 쓸 수 없음을 즉시 확인한다.
- service role이 기존 행 수와 서버 기능에 필요한 읽기/쓰기를 유지함을 확인한다.

### Canonical Schema

- 운영에 존재하는 FAQ column과 `chatbot_settings`를 `migrations/chatbot.sql`에 반영한다.
- 신규 환경에서도 동일한 RLS, grants, policies, constraints, indexes가 생성되게 한다.
- `chatbot_faq_log`는 canonical 신규 schema에서 제외한다.
- 운영용 forward migration은 테이블/행을 삭제하지 않는다.

### Application Security Boundary

- sensitive Chatbot repository 함수를 service-role client로 전환한다.
- FAQ public read는 anon client를 유지한다.
- FAQ hit mutation route, service, repository code를 제거한다.
- crawler/test route를 제거하되 재설계 가능성을 위해 internal crawler service/util code는 삭제하지 않는다.
- API Docs public UI/JSON route를 제거하고 internal OpenAPI spec은 유지·정리한다.
- 공개 route 제거로 미사용이 되는 Swagger UI dependency/type declaration을 제거한다.

### Security Regression

- local/production base URL에서 제거 route status를 검증한다.
- Supabase anon/service-role 경계와 적용 전 row count 보존을 검증한다.
- 검증 스크립트는 읽기 전용이며 민감한 row body를 요청하거나 출력하지 않는다.

## Non-Goals

- 포트폴리오 layout, design token, navigation, page UI 개편
- Blog/Career/Project 콘텐츠 모델 개편
- Chatbot UI 개편 또는 Chatbot 존치 여부 결정
- conversation 데이터 삭제, 익명화, 보관 기간 migration
- crawler 대체 관리 UI, scheduler, webhook, secret 인증 구현
- FAQ hit 대체 analytics
- Blog/Velog API 통합 및 payload/TTFB 최적화
- 전체 lint/Prettier 청산, CI 구축, 상위 lockfile 정리
- Vercel CLI 직접 배포
- OpenAI assistant/thread 생명주기 재설계
- 데이터 삭제, table drop, truncate, 민감 테이블의 public policy 복구

## Route and Navigation Changes

### Remove

- `GET /api/velog/crawl` → route 제거 후 404
- `GET /api/velog/test-detail` → route 제거 후 404
- `POST /api/chatbot/faqs` → handler 제거 후 405
- `GET /api-docs` → page 제거 후 404
- `GET /api-docs/v1` → route 제거 후 404

### Preserve

- `GET /api/chatbot/faqs`
- `GET /api/chatbot/categories`
- `POST /api/chatbot/ask`
- Blog page/API route와 기존 public page route
- 내부 참고용 `src/lib/swagger/specs/v1.ts`

### Navigation

- Header/navigation에 API Docs link가 없으므로 사용자 navigation 변경은 없다.

## Data and Database Changes

### Production Prerequisite

- 실행 전 사용자가 운영 DB connection URL을 `DATABASE_URL`로 local `.env`에 제공한다.
- `DATABASE_URL`은 Git, 문서, 콘솔 출력, verification artifact에 포함하지 않는다.
- URL이 없거나 운영 DB identity를 확인할 수 없으면 production migration 적용을 중단한다.

### Preserve

- 모든 기존 table과 row
- Blog 97건, FAQ 15건, rate-limit 6건, conversations 8건, settings 1건의 적용 전 row count
- `velog` public read
- `chatbot_faq` public read
- service-role Chatbot rate-limit, conversation, settings 읽기/쓰기

### Canonical Columns

- `chatbot_faq`: `id`, `question`, `answer`, `category`, `sorting`, `hit`, `created_at`
- `chatbot_rate_limit`: 현재 운영 column 보존
- `chatbot_conversations`: 현재 운영 column 보존
- `chatbot_settings`: `id`, `assistant_id`, `thread_id`, `created_at`, `deleted_at`
- `velog`: 현재 migration 및 운영 column 보존

### RLS and Grants

- `velog`, `chatbot_faq`: RLS enable, anon/authenticated `SELECT` policy/grant만 허용, public write revoke
- `chatbot_rate_limit`, `chatbot_conversations`, `chatbot_settings`: RLS enable, anon/authenticated 모든 table privilege revoke, public policy 제거
- `chatbot_faq_log`: 존재할 때만 RLS enable, anon/authenticated privilege revoke, public policy 제거; table은 drop하지 않음
- service role의 필요한 CRUD privilege를 명시적으로 보장

### Constraints and Indexes

- primary key/nullability는 운영 데이터를 손실하지 않는 범위에서 canonical migration으로 정렬
- `chatbot_settings`: `deleted_at IS NULL`인 활성 행 최대 1개 partial unique index
- `chatbot_rate_limit`: `(ip, window_started_at DESC)` index
- `chatbot_conversations`: `thread_id`, `created_at`, `ip` index 보장
- `chatbot_faq`: `(category, sorting, created_at)` index
- `velog`: `tags` GIN index 보장

### Migration Safety

- production forward migration은 `BEGIN`/`COMMIT`과 `psql -v ON_ERROR_STOP=1`로 적용한다.
- active settings가 2개 이상이면 unique index 생성 전 자동 수정하지 않고 중단한다.
- 필수 column이 없거나 nullability/duplicate가 예상과 다르면 자동 삭제·보정하지 않고 중단한다.
- 실패 시 transaction을 rollback하고 preflight 상태를 유지한다.
- 적용 후 문제는 sensitive public access를 복구하지 않고 roll-forward migration/code fix로 해결한다.

## SEO Changes

- public `/api-docs`와 `/api-docs/v1`을 제거하므로 API Docs metadata/noindex 출력도 제거된다.
- `robots.ts`에서 별도 `/api-docs` disallow를 제거하되 `/api/` disallow는 유지한다.
- public portfolio page의 title, description, canonical, Open Graph, Twitter, JSON-LD, sitemap은 변경하지 않는다.
- 제거 route는 redirect하지 않고 404/405를 반환한다.

## File Changes

### Create

- `migrations/20260928_production_security_schema_alignment.sql`
- `scripts/verify-production-security.mjs`
- `doc/projects-reorganization/audit/production-security-verification.md`

### Update

- `migrations/chatbot.sql`
- `migrations/velog.sql`
- `src/lib/repositories/chatbotRepository.ts`
- `src/lib/services/chatbotService.ts`
- `src/app/api/chatbot/faqs/route.ts`
- `src/lib/swagger/specs/v1.ts`
- `src/app/robots.ts`
- `package.json`
- `package-lock.json`
- `.codex/skills/portfolio-verify/SKILL.md`
  - 검증된 baseline에 존재하는 전체 저장소 실패는 필수 명령 실행·비악화·변경 범위 집중 검증으로 판정하는 규칙 추가
- `doc/projects-reorganization/plan/01-production-security-and-schema-alignment.md`
  - 실행 후 status와 implementation log 추가

### Remove

- `src/app/api/velog/crawl/route.ts`
- `src/app/api/velog/test-detail/route.ts`
- `src/app/api-docs/page.tsx`
- `src/app/api-docs/v1/route.ts`
- `src/types/vendor/swagger-ui-dist.d.ts`

### Retain

- `src/lib/services/velogService.ts`
- `src/lib/utils/crawler.ts`
- `src/lib/utils/velogDetailCrawler.ts`
- `src/lib/swagger/specs/v1.ts`
- public Blog/FAQ read routes
- `/api/chatbot/ask`

## Implementation Steps

1. Git status, Plan 00 `Verified`, `DATABASE_URL` 존재를 확인한다.
2. 운영 DB identity를 credential 출력 없이 확인하고 expected table 존재 여부를 검증한다.
3. 적용 전 row count, columns, constraints, RLS flags, policies, grants, indexes를 metadata/aggregate로 snapshot한다.
4. 민감한 row body, message, IP, User-Agent, assistant/thread ID, credential을 출력하지 않는다.
5. `migrations/20260928_production_security_schema_alignment.sql`을 비파괴적·transactional·재실행 가능하게 작성한다.
6. migration SQL에 FAQ/settings drift 반영, RLS/grant/policy 정규화, constraints/indexes를 구현한다.
7. 적용 전 SQL을 parse/review하고 active settings count, expected columns, duplicate 조건을 재확인한다.
8. `psql` `ON_ERROR_STOP=1`로 production migration을 한 transaction에서 적용한다.
9. 적용 직후 policy/grant/index와 row count 보존을 조회한다.
10. anon/service-role 회귀로 public read 유지와 sensitive access 차단을 확인한다.
11. `migrations/chatbot.sql`, `migrations/velog.sql`을 운영 결과와 동일한 canonical schema로 정렬한다.
12. conversation 저장/조회/통계 repository를 service-role client로 전환한다.
13. FAQ hit POST handler, service, repository 함수를 제거한다.
14. crawler/test-detail route를 제거하고 internal crawler service/util은 보존한다.
15. API Docs page/JSON route를 제거하고 internal spec에서 제거된 mutation/crawler endpoint를 정리한다.
16. `swagger-ui-dist` dependency와 local type declaration을 제거한다.
17. `robots.ts`를 제거 route에 맞게 정리한다.
18. `scripts/verify-production-security.mjs`와 `npm run verify:security`를 추가한다.
19. 검증 스크립트가 secret/row body를 출력하지 않고 실패 시 nonzero exit를 반환하게 한다.
20. 검증된 기존 lint baseline을 사용할 수 있도록 verifier 규칙을 비악화·집중 검증 조건으로 보완한다.
21. `npm run lint`, `npm run build`, local route smoke, local security script를 실행한다.
22. 적용 전후 결과를 `doc/projects-reorganization/audit/production-security-verification.md`에 민감 값 없이 기록한다.
23. 실행 변경을 커밋하고 사용자에게 GitHub push/Vercel 배포 게이트를 안내한다.
24. 배포 완료 후 production base URL로 제거 route, 존치 route, Blog/Chatbot smoke, security script를 재실행한다.
25. plan status를 `Implemented - Pending Verification`으로 변경하고 적용·배포·검증 로그를 추가한다.

## Validation

### Repository and Migration

```bash
git status --short
git diff --check
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/20260928_production_security_schema_alignment.sql
npm run lint
npm run build
npm run verify:security
```

- SQL이 `BEGIN`/`COMMIT`, RLS enable, grant revoke, policy normalization, index precondition을 포함하는지 review한다.
- migration을 두 번 실행해도 schema/data가 손상되지 않는지 확인한다.
- `npm run lint`는 Plan 00 baseline과 비교한다. 전체 실패 청산은 비범위이지만 변경으로 인해 새 lint 범주가 추가되어서는 안 된다.
- `npm run build`는 exit 0이어야 한다.

### Database Preflight and Postflight

- table별 row count가 적용 전후 일치한다.
- expected columns가 있고 예상하지 못한 null/duplicate가 없다.
- sensitive table의 RLS가 enabled고 anon/authenticated policy/grant가 없다.
- public content table의 anon/authenticated `SELECT` policy/grant만 있다.
- partial unique/composite/GIN/conversation indexes가 존재한다.
- `chatbot_faq_log`는 생성되지 않고, 기존에 있다면 삭제되지 않고 잠긴다.

### Anonymous Boundary

- anon `velog` 조회 성공
- anon `chatbot_faq` 조회 성공
- anon `chatbot_conversations` 조회는 401/403 또는 0건으로 차단
- anon `chatbot_settings` 조회는 401/403 또는 0건으로 차단
- anon `chatbot_rate_limit` 조회는 401/403 또는 0건으로 차단
- anon sensitive table insert/update/delete 불가
- 검증은 row body를 저장·출력하지 않음

### Service Role and Functional Smoke

- service role로 sensitive table의 aggregate count 조회 가능
- `/api/chatbot/ask`의 rate-limit/settings/conversation DB 접근 코드가 service-role client를 사용함
- Assistants API가 2026-08-26 종료되어 실제 답변 smoke는 404/500으로 실패하며, Responses API 이전과 기능 복구는 Plan 06에서 수행
- FAQ GET/category 정상
- Blog page/list/detail 및 Blog API 정상
- Home/Career 기본 smoke 정상
- Chatbot smoke에 사용하는 질문은 민감하지 않은 일반 테스트 문구로 제한

### Route Removal

#### Local

- `GET /api/velog/crawl` → 404
- `POST /api/velog/crawl` → 404
- `GET /api/velog/test-detail` → 404
- `POST /api/chatbot/faqs` → 405
- `GET /api-docs` → 404
- `GET /api-docs/v1` → 404
- `GET /api/chatbot/faqs` → 200

#### Production After User Push

- local과 동일한 status 검증
- `robots.txt`에서 `/api/` disallow 유지와 불필요 `/api-docs` rule 제거 확인
- 제거 route가 redirect로 다른 민감 endpoint를 노출하지 않는지 확인

### Security Verification Artifact

- 적용 시간, commit, 대상 환경, 명령, status/count/policy/index 요약을 기록
- credential, connection URL, JWT, assistant/thread ID, message, IP, User-Agent 미기록
- 실패가 있으면 원본 오류의 민감 부분을 제거하고 영향과 차단 단계를 기록

## Acceptance Criteria

- production migration 적용 전후 table row count가 일치한다.
- Blog, FAQ, rate-limit, conversation, settings 기존 데이터가 모두 보존된다.
- `chatbot_conversations`, `chatbot_settings`, `chatbot_rate_limit`을 anon/authenticated로 읽거나 쓸 수 없다.
- `velog`, `chatbot_faq`는 anon/authenticated `SELECT`만 허용한다.
- sensitive table의 운영 RLS flag, policies, grants가 DB catalog 기준으로 문서화된다.
- required constraints/indexes가 운영과 canonical migration에 모두 존재한다.
- `chatbot_faq_log`가 새로 생성되지 않고, 기존 환경에 있다면 삭제되지 않는다.
- conversation 저장·조회·통계가 service-role client를 사용한다.
- rate-limit, settings, conversation repository가 service-role client를 사용하고 운영 RLS 이후 service-role aggregate 접근이 유지된다.
- `/api/chatbot/ask`의 OpenAI 응답 기능은 Assistants API 종료에 따른 Plan 06 이전 대상으로 기록되며, 이 plan의 완료 조건에서는 제외된다.
- `POST /api/chatbot/faqs`가 제거되고 FAQ GET은 유지된다.
- crawler/test-detail API route가 local과 production에서 404를 반환한다.
- API Docs UI/JSON route가 local과 production에서 404를 반환한다.
- internal OpenAPI spec이 존치 endpoint만 기록한다.
- Swagger UI dependency/type declaration이 제거된다.
- `npm run verify:security`가 secret·row body를 출력하지 않고 성공한다.
- `npm run build`가 성공한다.
- `npm run lint`가 실행되고 Plan 00의 기존 baseline보다 악화되지 않음이 기록된다.
- local 핵심 page/API smoke가 성공한다.
- 사용자 push/Vercel 배포 후 production route/security 회귀가 성공한다.
- production verification artifact에 민감한 값이 포함되지 않는다.
- table/row 삭제, truncate, sensitive public policy 복구가 없다.
- Vercel CLI 직접 배포가 없다.

## Risks and Rollback

### Risks

- `DATABASE_URL`이 없거나 오류 환경을 가리키면 production hotfix를 실행할 수 없다.
- policy/grant 정규화가 서버의 anon client 사용 지점을 깨뜨릴 수 있다.
- DB RLS를 먼저 적용하면 code 배포 전까지 conversation 로그 저장이 실패할 수 있다. Chatbot 답변은 저장 실패를 catch하므로 유지되지만 짧은 로그 결손 가능성이 있다.
- 사용자 push/Vercel 배포가 지연되면 public crawler route가 운영에 남는다.
- active settings가 복수면 partial unique index 생성이 실패한다.
- 상위 lockfile 경고와 lint baseline 실패가 계속된다.
- 운영 사이트가 현재 branch와 다른 commit이면 route 검증 결과가 엇갈릴 수 있다.

### Mitigation

- DB host/database identity와 expected table을 preflight하고 secret은 출력하지 않는다.
- migration 전 repository의 sensitive anon client 지점을 모두 목록화하고 service-role 전환 code를 먼저 준비한다.
- production hotfix를 적용한 뒤 즉시 anon/service-role 회귀를 실행한다.
- active settings/data precondition이 다르면 자동 수정 대신 migration을 중단한다.
- 사용자 push 후 production commit/deployment 식별자를 기록하고 route 검증을 실행한다.
- 검증 script에서 expected count는 적용 전 snapshot과만 비교하고 row body를 읽지 않는다.

### Rollback

- SQL 적용 중 실패는 transaction rollback으로 적용 전 상태를 유지한다.
- 적용 후에는 sensitive table의 anon/authenticated 권한을 다시 열지 않는다.
- Chatbot 서버 기능이 깨지면 service-role repository/code를 roll-forward한다.
- 제거 route가 필요하다면 동일한 public 무인증 route를 복구하지 않고 별도 인증된 관리 plan을 작성한다.
- source rollback은 DB 보안 경계를 유지할 수 있는 commit로만 허용한다.
- 수동 복구가 필요하면 적용 전 metadata snapshot을 참고하되 민감 public policy/grant는 복구 대상에서 제외한다.

## Follow-Up Plans

1. `02-information-architecture-and-content-model.md`
   - Home, Work, Project, Resume, Writing, Ask route/content ownership을 확정한다.
2. `03-design-system-and-global-shell.md`
   - typography, color, spacing, header/navigation/footer, global state UI를 재설계한다.
3. `06-ask-chatbot-decision-and-implementation.md`
   - Chatbot 존치, conversation 수집·익명화·보관 기간, OpenAI assistant/thread 생명주기를 결정한다.
4. `07-seo-performance-and-quality-gates.md`
   - 전체 lint/format/CI, lockfile root, API payload/TTFB, SEO 이전을 완성한다.

## Implementation Log

### 2026-09-29

- 운영 Supabase identity와 필수 5개 테이블을 확인하고, 민감 row body 없이 적용 전 row count/RLS/policy/grant/index/column metadata를 snapshot했다.
- production forward migration을 transaction으로 적용했으며 동일 migration의 두 번째 실행도 성공했다.
- 적용 전후 행 수는 `velog=97`, `chatbot_faq=15`, `chatbot_rate_limit=6`, `chatbot_conversations=8`, `chatbot_settings=1`로 일치했다.
- public 테이블은 anon/authenticated SELECT만, sensitive 테이블은 service role만 접근하도록 정규화하고 필수 index를 생성했다.
- canonical Chatbot/Velog schema를 운영 결과에 맞췄고 `chatbot_faq_log`는 생성하지 않았다.
- conversation 저장/조회/통계를 service-role client로 전환하고 FAQ hit mutation의 route/service/repository/client 호출부를 제거했다.
- crawler/test route와 API Docs UI/JSON route를 제거하고 internal OpenAPI spec, robots, Swagger dependency를 정리했다.
- 기존 사용자 작업인 detail crawler service/repository 코드는 보존하고 공개 crawler route만 계획대로 제거했다.
- 보안 회귀 스크립트와 `npm run verify:security`를 추가하고 verifier의 기존 repository-wide baseline 비악화 규칙을 보완했다.
- OpenAI 공식 문서에서 Assistants API가 2026-08-26 종료됐음을 확인했다. 사용자 승인에 따라 Responses API 이전과 Chatbot 응답 복구는 Plan 06으로 이관했다.

### Focused Checks

- production migration: 2회 연속 성공
- postflight catalog/row counts 및 anon/service-role regression: 성공
- `git diff --check`, `npx tsc --noEmit`: 성공
- `npm run lint`: 기존 baseline과 동일하게 `eslint-plugin-prettier` 누락으로 exit 2
- `npm run build`: 성공, 111개 static page 생성
- local `npm run verify:security`: 성공
- local core page/API smoke: Home, Blog, Career, robots, Chatbot categories, Velog posts 모두 200
- local route removal: crawler/test/API Docs 404, FAQ POST 405, FAQ GET 200
- Chatbot answer smoke: Assistants API 종료로 500; 승인된 결정에 따라 Plan 06으로 이관
- production application route smoke: 사용자 GitHub push 및 Vercel 배포 후 검증 필요
