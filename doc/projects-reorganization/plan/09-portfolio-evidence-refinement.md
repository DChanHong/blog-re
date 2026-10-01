# 09. Portfolio Evidence Refinement

Status: Verified

Approved: 2026-10-01. 전체 검토에서 제안한 보완을 사용자가 "보완할 사항을 보완해보자"로 승인했다. 기존 결정을 재질문하지 않고 계획→구현→검증을 연속 수행한다. 커밋·배포는 포함하지 않는다.

## Goal
대표 사례의 기술적 판단과 기능 흐름을 구체화하고, 작업량보다 서비스 규모·운영 개선을 강조한다. 이력서에 있는 채용사이트 경험을 프로젝트 상세로 연결한다.

## References
- Verified plan 08 및 `doc/portfolio-reference/README.md`, `02-page-templates.md`의 상세 템플릿.
- 현재 `src/data/resume.ts`, `projects.ts`, `work.ts`, `projectCaseStudies.ts`, `src/types/portfolio.ts`.
- 현재 홈·프로젝트 상세 컴포넌트와 CSS, 프로젝트 route, sitemap, `eslint.config.mjs`, `package.json`.
- 로컬 제출 기록의 상담 플랫폼 MASTER(복귀·재연결·런타임 설정 부분), ERP MASTER(Excel·Snapshot 부분). 기존 이력서의 보수적인 검증 한계를 우선한다.
- 2026-10-01 전체 검토와 사용자 승인.

## Current State
소개 문구 수정 커밋 `cc79d8a` 이후 clean. 기존 상세 6개에 텍스트·개념 구조가 있으나 실제 제품 화면 없음. 채용사이트는 이력서에만 존재. 홈 소개가 desktop에서 `설계 / ·개발`로 나뉜다. lint는 설치되지 않은 prettier plugin 참조로 실행 불가.

## Decisions
- 상담 복구에서 토큰 갱신, 연결과 방 참여, 서버 재조회, 앱 Bridge, 실패 안내를 구체화한다. 서버 설정과 사이트 재배포의 관계를 설명하되 8시간 절감으로 표현하지 않는다.
- ERP는 Excel 유지 판단, 현재 데이터와 발송 Snapshot 분리, DB 저장과 외부 알림 분리를 보강한다.
- 상담 상단의 함수·컴포넌트 개수는 구현 범위로 이동하고 서비스 규모 2개와 서버 설정 기반 운영 변경을 강조한다.
- 채용사이트는 이력서의 검토된 기록만 사용해 7번째 사례로 추가한다. 결제·성능·테스트 범위·개선율을 추정하지 않는다.
- 실제 화면은 제공된 캡처만 사용한다. 저장소에는 실제 제품 캡처가 없어 사용자에게 경로를 요청했다. 자료가 도착하지 않으면 이미지와 빈 자리·가상 화면은 만들지 않고 후속 보완으로 명시한다.
- 소개의 `설계·개발하며`를 하나의 줄바꿈 단위로 처리한다. 합의한 문장은 유지한다.
- ESLint 설정 복구를 검토했으나 기존 82 errors/14 warnings가 노출되어 기본 build도 실패했다. 설정 변경은 원복하고 기존 누락 플러그인 기준선을 유지한다. 임시 Next/TypeScript 구성으로 변경 파일만 검사하고 전역 복구는 별도 작업으로 남긴다.

## Scope
대표 사례 문구·단계별 복구 흐름, 채용사이트 데이터·목록·상세, 홈 소개 줄바꿈.

## Non-Goals
새로운 성과 수치, AI 직함 확대, 페이지 전체 재디자인, 원격 DB, 원본 제출 기록 변경, 의존성 설치, commit/push/배포.

## Route and Navigation Changes
`/project/recruitment` 추가. 기존 6개 경로 유지. Work·Resume·이전/다음·정적 생성·sitemap은 기존 데이터 경로를 재사용한다.

## Data and Database Changes
기존 typed source 데이터에 채용사이트 추가. 상세 데이터에 선택적 단계별 설명을 추가한다. DB 변경 없음.

## SEO Changes
새 프로젝트의 기존 metadata·JSON-LD·sitemap 생성 경로 사용. 사이트 URL과 나머지 metadata 유지.

## File Changes
- `src/data/projects.ts`, `src/data/projectCaseStudies.ts`, `src/data/work.ts`
- `src/components/domain/project/ProjectDetails.tsx`, `project-detail.module.css`
- `src/components/domain/home/ReferenceHome.tsx`, `home-reference.module.css`
- 본 계획 및 `doc/projects-reorganization/audit/09-portfolio-evidence-verification.md`
- 실제 화면 자료가 제공되면 필요한 이미지와 상세 표시 영역만 추가하고 파일·검증을 로그에 명시한다.

## Implementation Steps
1. 기존 사실과 제출 기록을 대조한다.
2. 대표 사례 설명·지표·복구 단계와 채용사이트 사례를 반영한다.
3. 소개 줄바꿈을 보정하고 lint 기준선을 기록한다.
4. 구현 로그 작성 후 별도 verify 절차로 검증한다.

## Validation
diff check, TypeScript, 변경 파일 lint, 전역 lint, production build. 1280px 및 390/320px 실제 브라우저에서 홈·Work·Resume·상세 확인, 테마·복구 흐름·채용 route·이전/다음·SEO·sitemap 확인. 검증 서버는 종료한다.

## Acceptance Criteria
1. 상담·ERP의 추가 설명이 기존 기록에 근거하고 실적·검증 한계를 유지한다.
2. 채용사이트가 목록·상세·이력서 링크·정적 생성·sitemap에서 연결된다.
3. 작업량 수치는 상단 대표 지표에서 빠지고 소개 문구의 중간점 앞 줄바꿈이 없다.
4. 변경 파일 lint/type/build/diff 통과. 전역 lint의 기존 누락 플러그인 기준선은 예외로 기록하며 설정 복구로 드러난 기존 위반도 기록한다.
5. 실제 캡처가 없을 경우 화면 보강을 완료로 주장하지 않고 후속 자료 요청을 남긴다.

## Risks and Rollback
과거 MASTER의 포괄적인 문구보다 현재 이력서의 검증 범위를 우선한다. 변경 source·CSS·lint config만 되돌릴 수 있다. 기존 DB와 공통 테마 유지.

## Follow-Up Plans
실제 제품 화면 자료 확보 후 시각 근거 보강. 전역 lint에서 발견된 무관한 기존 위반은 별도 정리.

## Implementation Log
- 상담 복구 4단계, 서버 설정·배포 경계, ERP Excel·Snapshot·후속 알림 판단을 기존 기록으로 보강.
- 상담 상단 함수·컴포넌트 수를 구현 범위로 이동. 채용사이트를 7번째 프로젝트로 추가해 기존 링크·metadata·sitemap 경로에 연결.
- 공유 소개 데이터는 유지하고 `설계·개발하며`만 줄바꿈 방지 span으로 표시.
- 실제 제품 캡처는 제공되지 않아 이미지 추가 없음. 경로 요청은 사용자에게 전달함.
- lint 복구 시 기존 82 errors/14 warnings로 build 실패하여 구성 원복. 변경 5개 TS/TSX 임시 Next/TypeScript lint 통과. 전역 기준선 유지.
- 기본 build는 sandbox 네트워크 조회 실패 후 권한을 받아 재실행하여 exit 0. 타입 검사는 build와 동시에 실행해 생성 타입 경합이 발생한 첫 결과를 폐기하고 build 완료 후 순차 재실행.
- 커밋·배포·DB 쓰기 없음. 최종 시각 검증은 별도 verify 단계에서 수행.

## Verification Log
- 구현 범위 PASS. 기본 build·post-build TypeScript·변경 파일 lint·diff 통과. 전역 lint의 기존 누락 플러그인 예외 유지.
- 320/390px의 20페이지에서 가로 넘침 없음·단일 H1. desktop 소개 줄바꿈, 채용 상세 light/dark, 목록·이력서·다음 링크, 새 metadata와 sitemap 확인.
- 실제 제품 화면 자료는 미제공으로 후속 자료 보강이 남아 있다. 상세한 결과는 `audit/09-portfolio-evidence-verification.md` 참고.
