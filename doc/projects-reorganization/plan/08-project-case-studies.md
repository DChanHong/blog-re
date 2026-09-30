# 08. Project Case Studies

Status: Verified

Approved: 2026-09-30. 사용자가 참고 디자인과 권장 콘텐츠를 현재 모든 프로젝트에 적용하도록 승인. 계획·구현·검증을 순차 수행한다.

## Goal
기존 6개 프로젝트 상세 페이지를 참고 캡처의 사례 연구형 디자인으로 전환한다.

## References
- `doc/portfolio-reference/README.md`, `02-page-templates.md`의 상세 페이지 구성.
- Verified plan 07 및 사용자 제공 11:08:30–46 캡처 7장.
- `src/app/project/[slug]/page.tsx`, `src/components/domain/project/ProjectDetails.tsx`, `src/data/projects.ts`, `src/types/portfolio.ts`.

## Current State
Plan 07 커밋 완료, clean. 기존 상세는 테두리 있는 단일 패널 안에 헤더·기술·다중 카드를 배치한다. 6개 경로와 정적 생성 및 SEO가 존재한다.

## Decisions
- 한국어, 중앙 대형 제목, 선으로 구분한 3열 핵심 지표, 밝은/어두운 비교 카드, 좌측 라벨·우측 본문 구조.
- 배경, 내 역할·범위, 문제, 구현, 접근, 구조, 품질·검증, 기술, 이전·다음 순서. 회고는 있는 경우 보존.
- 신규 구축의 비교는 '구축 과제/구현 결과', 운영 개선은 '개선 전/개선 후'로 명시. 수치나 운영 실적을 새로 추정하지 않는다.
- 각 프로젝트에 3–4개 핵심 지표(정량 또는 구현 범위)를 사용. 1,000명은 합성 DB 저장 검증, 법률은 출시 보류, Spring은 개발 서버 QA와 선행 인프라 사용을 명시.
- 대륜톡은 기존 공통 패키지에 위젯 추가, Go 기존 서버 확장임을 상세 전용 문구에 명시. SNN은 관리자 영역만 담당.
- 구조는 개념 흐름이며 전체 인프라 구축 주장 아님. 품질·검증은 실제 기존 기록만 사용. 법률은 별도 보안/운영 성과를 주장하지 않고 내부 테스트와 범위를 기술.
- AI CTA 없음. 이전/다음은 Work 카드 순서로 순환하여 모든 페이지에 양쪽 링크 제공.

## Scope
6개 공통 상세 템플릿과 프로젝트별 공개 사례 데이터. 모든 기존 프로젝트 상세 경로 유지.

## Non-Goals
홈·Work·Resume 변경, 원본 지원 자료 변경, 새로운 프로젝트, AI, 원격 DB 작업, 배포, 커밋, 새 의존성.

## Route and Navigation Changes
`/project/[slug]` 및 `/work` 유지. 이전/다음 순서만 Work 목록과 통일. 미등록 slug는 404 유지.

## Data and Database Changes
`src/data/projectCaseStudies.ts`에 상세 전용 구조·문구 추가. 기존 공유 projects 원본과 DB 보존.

## SEO Changes
기존 title/description/canonical/OG/Twitter/JSON-LD 생성 유지. 경로와 사이트맵 보존.

## File Changes
- `src/app/project/[slug]/page.tsx`
- `src/components/domain/project/ProjectDetails.tsx`
- 신규 `src/components/domain/project/project-detail.module.css`
- 신규 `src/data/projectCaseStudies.ts`
- 본 계획, `audit/08-project-case-studies-verification.md`
- 테스트 도구/이미지는 `/tmp`에만 저장.

## Implementation Steps
1. 6개 사례별 비교·구조·검증 문구 정리.
2. 공통 서버 컴포넌트 및 CSS, 기존 route 결합.
3. 구현 완료 상태 기록 후 별도 검증 단계 수행.

## Validation
`git diff --check`, `npx tsc --noEmit --incremental false`, `npm run lint`, isolated `npm run build`, 변경 TS/TSX scoped lint.
전역 lint 기존 prettier plugin 누락은 Plan 07 baseline과 동일할 때만 예외. 6개 페이지 각각 320/390/768/1440px 양 테마에서 overflow/필수 섹션/본문 확인. desktop/mobile 대표 캡처 직접 검토. Work 진입, 이전/다음/목록, 404, focus/reduced motion/JS 비활성, metadata 확인. 공유 파일 및 빌드 src 일치 확인.

## Acceptance Criteria
1. 모든 6개 페이지에 참고의 hero·지표·명암 비교·2열 본문·흐름도·기술 태그·하단 탐색 적용.
2. 각 프로젝트별 관련 문구가 있고 실제 성과/범위/검증 한계를 보존. 가공 수치와 AI UI 없음.
3. 모바일·다크·키보드·JS 없는 접근 및 모든 기존 상세 링크/404 정상.
4. 빌드/type/scoped lint/diff 통과, SEO와 공유 화면 소스 보존. 전역 lint baseline 악화 없음.

## Risks and Rollback
한글과 내용 분량으로 높이는 참고와 다르다. 전용 데이터와 컴포넌트·route 변경만 되돌리면 복원 가능. DB 마이그레이션 없음.

## Follow-Up Plans
개별 프로젝트 내용의 추가 인터뷰 및 증거 자료 보강은 별도 요청 시 진행.

## Implementation Log
- 6개 상세 데이터, 공통 상세 템플릿·CSS, route 결합 완료. Work 순서의 순환 탐색 적용.
- 실제 성과와 구축·검증 결과를 분리. 기존 원본 데이터와 metadata 생성 경로는 유지.
- TypeScript/diff 및 변경 3개 TS/TSX scoped lint 오류·경고 0. 전역 lint는 기존 prettier plugin 누락으로 실행 불가.
- 임시 분리 빌드 후 별도 검증 단계에서 모든 페이지를 확인한다.

## Verification Log — 2026-09-30
- 수용 기준 1–4 PASS. 전체 6개 상세에 참고의 중앙 hero, 큰 지표, 비교 카드, 라벨/본문, 원형 개념 흐름, 기술 태그와 이전/다음 적용.
- 브라우저 159개 검사 및 실제 순환 탐색 9개 검사 통과. 6개×4개 폭×양 테마 overflow/필수 본문 검사, 6개 metadata와 JS 비활성 렌더링 확인, 404 유지.
- 전체 6개 desktop 캡처와 대표 모바일/다크 캡처 직접 검토. 카드·타이포·본문·흐름도 배치 정상.
- TypeScript, diff, 변경 TS/TSX 3개 scoped lint 통과. 분리 build 120페이지 생성(exit 0). 전역 lint는 기존 prettier plugin 누락(exit 2)으로 제한되며 새 오류 없음.
- 최종 src와 검증 빌드 src 일치, 공유 소스 변경 없음. `audit/08-project-case-studies-verification.md`에 근거 기록.
- 임시 캡처·JS는 /tmp에만 보관. 로컬 3108 preview 유지. 커밋·push·배포 없음.
