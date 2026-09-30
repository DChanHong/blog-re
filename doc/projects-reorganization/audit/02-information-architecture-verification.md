# Plan 02 — Implementation and Verification

Date: 2026-09-29 (Asia/Seoul)

Status: Verified

앞부분은 `$portfolio-execute`의 구현 시점 기록이며, 마지막 Final Verification 절에 `$portfolio-verify` 최종 판정을 추가했다. 운영 배포·운영 애플리케이션·DB 재검증은 사용자 결정에 따라 범위에서 제외했다.

## Basis and Implementation

- 승인 계획: [Plan 02](../plan/02-information-architecture-and-content-model.md)
- 실행 전 기준: `8c03538` (Plan 00/01 Verified, Plan 02 Approved)
- 구현 커밋: `60330c9 feat: implement portfolio information architecture`
- 본 문서와 재실행 가능한 점검 스크립트는 위 구현 커밋 이후 추가한 인계 자료다.
- 프로젝트 타입·데이터 분리, 신규 목록/상세/이력서/글 경로, 이전 목록의 exact redirect, 한국어 메뉴, AI mount 제거 및 SEO 경로 정렬을 구현했다.
- 기존 프로젝트 모달은 상세 페이지로 대체하고 삭제했다. 기존 버전은 Git 이력에 남아 있다. AI 비활성 컴포넌트·store·서버 코드는 유지했다.

## Requirement Evidence

| 계획 요구사항 | 구현 및 로컬 점검 근거 |
| --- | --- |
| 타입·데이터 책임 분리, 내용 보존 | `src/types/portfolio.ts`, `src/data/projects.ts`, `src/data/careerData.ts`. 실행 전 export 전체와 실행 후 합성 export를 deepEqual 비교. 4개 ID/순서/featured와 모든 기존 값 동일. |
| 동일 원본을 쓰는 Home/Work/Project/Resume | 소비자 import 확인. Home/Work의 상세 링크 4개와 순서 확인. 각 상세의 모든 문자열 필드가 실제 HTML에 포함되는지 확인(지표, 역할, 상태, scope note 포함). |
| 새 경로와 글 상세 유지 | `/`, `/work`, `/resume`, `/writing`, 프로젝트 4개, 기존 글 상세 대표 1개 200. `/ask`와 존재하지 않는 프로젝트 404. |
| exact redirect, query/fragment 보존 | `/career` → `/resume` 308. `/blog`와 복합 query → `/writing` 308, query 값 동일. 기존 article은 200/canonical 유지. `/career#realtime-support`가 Resume 대응 위치 및 상세 링크로 연결됨. |
| 메뉴·한국어 UI·키보드 | 390×844, 1440×900에서 메뉴 현재 위치, 홈 링크, 모바일 메뉴 이름/닫힘/inert, 프로젝트 링크 focus-visible 및 Enter 이동 확인. `lang=ko`, 언어 전환 부재. 기존 기술명/이력 문구 유지. |
| Writing 기능·상태 | 페이지 2 이동, 카테고리 선택, 태그 선택/해제, 검색 제출, 복합 필터 query 보존, article 목록 복귀 점검. 존재하지 않는 검색어로 empty, 브라우저의 로컬 응답 대체로 loading/error 확인. 외부 데이터 쓰기 없음. |
| AI UI·자동 요청 제거 | 루트 ChatBot import/mount 제거, 활성 페이지 import 확인. 점검한 모든 페이지에서 AI 패널/메뉴 없음. 브라우저 `/api/chatbot/*` 요청 0건. AI 경험을 서술한 원문은 유지. |
| SEO | 9개 대표 경로의 title/description/canonical/OG/Twitter/lang/breadcrumb 및 해당 JSON-LD 타입 확인. sitemap 프로젝트 4개와 기존 article 97개, 이전 목록·ask 제외. robots writing query 규칙과 API disallow 확인. |
| Plan 01 경계·DB/API 계약 유지 | 제거된 crawler/test/docs 경로 404, FAQ POST 405. 기준 커밋 대비 API, repository/service, `src/types/blog.ts`, migrations, package/lockfile 변경 없음. 운영 DB 검사·migration·배포 미실행. |
| 구현 인계 | 본 감사 기록, 재실행 스크립트, screenshots/checks.json, Plan 상태 및 NEXT_STEPS 갱신. 별도 최종 검증 대기. |

## Commands and Results

2026-09-29, 구현 커밋 `60330c9` 소스 기준:

| 명령 / 점검 | 결과 |
| --- | --- |
| `npm run lint` | 종료 2. 기존 `eslint-plugin-prettier` 누락으로 설정 로딩 실패. 전체 lint 통과로 간주하지 않음. |
| 변경된 TS/TSX에 Next core-web-vitals/typescript 규칙만 별도 적용 | 30개 파일, 오류 0, 기존 PostCard `<img>` 경고 1. 누락된 prettier 설정을 대체하는 최종 검증이 아닌 보완 점검. |
| `npm run build` | 종료 0, 118개 정적 페이지 생성. plugin 누락과 상위 lockfile 경고는 기준선으로 기록. |
| `npx tsc --noEmit` (build 이후) | 종료 0. |
| `npm run start -- -p 3101` | 로컬 production 모드 서버 정상 시작. |
| `node doc/projects-reorganization/audit/02-information-architecture-check.cjs` | HTTP/콘텐츠/SEO/브라우저 54개 점검 통과, 브라우저 pageErrors 0, 자동 AI 요청 0. |
| `git diff --check` | 통과. |

빌드와 브라우저 점검은 기존 public 글 읽기를 이용한다. 운영 도메인을 호출하거나 DB catalog/보안 스크립트를 재실행하지 않았다. FAQ POST는 로컬 405 확인만 수행했다.

## Reproduction and Artifacts

저장소 루트에서 build/start 후 [점검 스크립트](02-information-architecture-check.cjs)를 실행한다. 기존 의존성인 Puppeteer Core, Cheerio, TypeScript만 사용하며 새 테스트 프레임워크는 추가하지 않았다. 스크립트는 `127.0.0.1:3101`과 macOS의 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`을 사용한다. 다른 환경에서는 이 두 설정을 환경에 맞게 변경해야 한다. 실행 시 baseline/plan02의 결과와 이미지가 갱신된다.

- [기계 판독 결과](../baseline/plan02/checks.json)
- Home: [desktop](../baseline/plan02/home-desktop.png), [mobile](../baseline/plan02/home-mobile.png)
- Home 글 영역 스크롤 후: [desktop](../baseline/plan02/home-writing-desktop.png), [mobile](../baseline/plan02/home-writing-mobile.png). 기존 observer에 의해 실제 표시되는 것을 확인한 뒤 캡처했다.
- Work: [desktop](../baseline/plan02/work-desktop.png), [mobile](../baseline/plan02/work-mobile.png)
- Project: [desktop](../baseline/plan02/project-desktop.png), [mobile](../baseline/plan02/project-mobile.png)
- Resume: [desktop](../baseline/plan02/resume-desktop.png), [mobile](../baseline/plan02/resume-mobile.png)
- Writing: [desktop](../baseline/plan02/writing-desktop.png), [mobile](../baseline/plan02/writing-mobile.png)
- Article: [desktop](../baseline/plan02/blog-desktop.png), [mobile](../baseline/plan02/blog-mobile.png)
- Writing states: [loading](../baseline/plan02/writing-loading.png), [empty](../baseline/plan02/writing-empty.png), [error](../baseline/plan02/writing-error.png)

## Known Limitations and Follow-Up

- 기존 고정 Velog/GitHub 푸터는 viewport 하단에서 콘텐츠 일부와 겹친다. 스크롤로 해당 내용을 볼 수 있고 이번 점검의 이동 경로는 동작했으나, 모든 위치에서 겹침이 없다는 뜻은 아니다. 공통 shell 개선은 승인 전인 Plan 03의 검토 사항이다.
- Home의 기존 글 섹션은 스크롤 진입 후 표시되는 구조다. 스크롤 전 전체 화면 캡처의 빈 영역은 글 삭제를 뜻하지 않는다. 원래 observer 동작을 유지했다.
- 기존 article 코드 블록의 어두운 배경/문자 대비와 일부 작은 보조 문구는 후속 시각 디자인 개선 대상이다. 이번 단계에서 전체 스타일을 재설계하지 않았다.
- unknown project의 HTTP 응답은 404이나, 현재 Next.js production 서버가 `dynamicParams=false` 경로에서 `Internal: NoFallbackError`를 로그에 출력한다. 브라우저 오류는 관측되지 않았다. 최종 검증에서 재확인할 관찰 사항으로 남긴다.
- 초기 브라우저 점검에서 장시간 공유 브라우저 세션의 navigation timeout이 발생했다. 페이지별 브라우저 격리 후 재실행은 통과했다. 테스트 실패를 애플리케이션 성공으로 덮지 않고 최종 결과는 재실행 결과만 기록했다.
- 실제 운영 반영 여부와 AI 응답 복구는 확인하지 않았다. 별도 `$portfolio-verify`에서 이 승인 계획의 로컬 수용 기준을 판정해야 한다.

## Final Verification — 2026-09-29

Verdict: **PASS** — Plan 02 Verified.

검증 대상은 `60330c9` 구현 코드와 이후 추가된 Plan 02 인계 자료다. 시작 시 미커밋 변경은 같은 계획의 문서·결과·이미지였고 구현 소스의 추가 변경은 없었다. 저장소 및 부모/하위 경로에서 적용할 AGENTS.md는 발견되지 않았다. 별도 테스트 프레임워크/대상 테스트는 없으며 기존 점검 스크립트를 검토 후 재실행했다. 계획의 Create/Update/Move/Retain, 단계 1–11, 추가 소비자 수정과 위 Requirement Evidence의 모든 항목을 확인했다.

### Re-executed Commands

- `git diff --check`: 통과.
- `npm run lint`: 종료 2, 기존과 동일한 plugin 로딩 실패. 전체 lint 성공으로 표시하지 않는다.
- `npm run build`: 종료 0, 118개 정적 페이지. 기존 plugin/lockfile 경고 유지.
- `npx tsc --noEmit`: build 이후 종료 0.
- `npm run start -- -p 3101`: 로컬 서버 정상 실행, 검증 후 종료.
- `node doc/projects-reorganization/audit/02-information-architecture-check.cjs`: 종료 0, **54/54**. 최신 [checks.json](../baseline/plan02/checks.json)에 결과 기록. pageErrors와 AI 자동 요청 모두 0건.
- `node doc/projects-reorganization/audit/02-verification-extra.cjs`: 종료 0, **4/4**. [추가 스크립트](02-verification-extra.cjs), [결과](../baseline/plan02/verification-extra.json).
- 두 `.cjs` 검사 도구의 `node --check`: 통과.

### Lint Baseline Comparison

현재 구현의 TS/TSX 변경 파일을 `--no-renames`로 수집해 이동된 파일을 포함한 **32개** 전체에 `next/core-web-vitals` 및 `next/typescript` 규칙을 적용했다. ESLint API의 `overrideConfigFile: true`와 FlatCompat를 사용했으며 저장소 lint 설정은 수정하지 않았다. 결과는 오류 0, `PostCard.tsx:36`의 기존 `@next/next/no-img-element` 경고 1이었다. 해당 `<img>`와 패키지 설정은 실행 전과 동일하다. 구현 기록의 30개 검사는 rename 필터로 이동된 2개가 빠졌으나 이번 최종 검증에서 ResumePage와 WritingListPage도 포함해 통과했다. 전체 prettier 환경 복구는 승인된 비목표이므로 기존 기준선 예외만 적용하며 새로운 오류를 면제한 것은 아니다.

### Visual and Interaction Review

- 기존 스크립트의 390×844/1440×900 캡처를 갱신하고 Home/Work/Project/Resume/Writing/Article 구조와 메뉴, overflow, loading/empty/error를 확인했다. 한국어 UI와 기존 고유명사·경력·글 원문 보존 범위가 일치했다.
- 추가 검증은 reduced-motion 환경에서 진행했다. 모바일 메뉴를 Enter로 열고 Tab으로 첫 메뉴 이동, Escape로 닫고 버튼 focus 복귀, 마지막 프로젝트 카드 focus/Enter 이동이 동작했다. [실제 focus ring](../baseline/plan02/verified-focus-mobile.png)은 2px 파란 외곽선으로 확인했고 클릭 가능한 부분이 다른 요소에 가려지지 않았다.
- [한국어 404](../baseline/plan02/verified-not-found-mobile.png): unknown project가 실제 404를 반환하고 한국어 안내/홈 복귀를 제공한다. 서버의 `Internal: NoFallbackError` 로그는 재현됐으나 정상 상태 코드와 UI/복귀 동작을 깨뜨리지 않았다.
- 오류 응답을 브라우저에서만 대체한 뒤 재시도 버튼으로 실제 글 목록 복구를 확인했다. 외부 데이터는 변경하지 않았다.
- 반복 tag, 한글 검색어, 공백/`&`/`+`가 포함된 legacy query도 308 대상에서 값과 순서를 유지했다.
- focus 검사 보강 중 CSS shadow 직렬화 순서를 잘못 비교하여 두 차례 테스트 timeout이 있었다. 실제 값은 `0px 0px 0px 2px`였으며 파란 ring이 표시되는 [진단 캡처](../baseline/plan02/verified-focus-failure-mobile.png)를 확인했다. 검사 문자열만 바로잡은 최종 재실행은 통과했으며 구현 변경은 없었다. 이 진단 이미지의 파일명은 애플리케이션 실패 판정을 뜻하지 않는다.

### Scope and Remaining Baseline Items

- API/repository/service/action/Blog DTO/migrations/package/lockfile에 기준 커밋 대비 diff가 없다. 글과 AI 저장 데이터는 변경하지 않았다. 콘텐츠 export 전체 비교와 각 프로젝트 모든 문자열 필드 출력 검증이 통과했다.
- 고정 footer 겹침, article 코드 대비, 기존 reveal/404 애니메이션은 기존 shell의 후속 디자인 과제다. 새 애니메이션은 추가되지 않았고 이번 경로 이동을 막는 회귀는 확인되지 않았다. reduced-motion 설정에서 모든 애니메이션이 제거된다고 주장하지 않는다.
- 앞서 기록한 기존 관찰 사항 외 계획 위반이나 신규 차단 실패는 발견되지 않았다. 운영 반영을 보증하는 판정은 아니다.
- 검증 단계에서는 구현 코드를 수정하지 않았다. Plan 상태/감사/NEXT_STEPS와 검증 도구·증거만 갱신했다. 다음 승인 계획은 없으며 Plan 03 인터뷰·승인이 먼저 필요하다.
