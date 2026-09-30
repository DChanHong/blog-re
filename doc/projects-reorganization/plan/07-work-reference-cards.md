# 07. Work Reference Cards

Status: Verified

Approved: 2026-09-30. 사용자가 권장안 전체 적용과 구현을 요청하여 계획→구현→검증을 연속 수행한다.

## Goal
`/work`를 제공된 화면처럼 이미지 없는 3열 성과 카드 목록으로 개편한다.

## References
- `doc/portfolio-reference/README.md`, `doc/portfolio-reference/02-page-templates.md`의 Work 항목.
- `src/app/work/page.tsx`, `src/data/projects.ts`, `src/components/layout/PageContainer.tsx`.
- 사용자 제공 2026-09-30 10:16:17/20 참고 캡처.
- Verified `06-resume-reference-reconstruction.md`.

## Current State
기존 6개 프로젝트를 공통 ProjectShowcase의 2열 아이콘·기술 배지·복수 지표 카드로 표시한다. 작업 트리는 clean이다.

## Decisions
- 한국어만 사용. 공통 헤더·푸터 유지. 페이지 소개와 6개 카드로 구성하며 현재 항목 수에 불필요한 필터는 추가하지 않는다.
- 카드: 작은 유형, 제목, 짧은 설명, 구분선, 큰 대표 지표 하나, 지표 설명. 이미지·아이콘·배지·기술 목록 제거. 회색 배경, 28px 곡률, 32px 내부 여백, 16px 간격, 3/2/1열.
- 대륜톡 약 80개 홈페이지, ERP Excel + ERP 업무 연결, CMS DB · API · UI, 외주 2개 프로젝트, 법률 내부 테스트(출시 보류), Spring 개발 서버 QA(운영 전환 전).
- 지표는 개선율만이 아닌 적용 규모·구현 및 검증 범위임을 소개에서 명시한다. 공통 원본과 상세 페이지는 수정하지 않는다.
- 채용사이트는 상세 경로가 아직 없으므로 후속 작업으로 남긴다.

## Scope
Work 전용 서버 렌더링 카드·문구·CSS. 각 카드 전체가 기존 상세 페이지 링크다.

## Non-Goals
상세 페이지 및 다른 화면 변경, AI, DB, 의존성, 이미지 생성, 배포, 커밋.

## Route and Navigation Changes
None. 기존 `/work`와 `/project/[slug]` 링크 유지.

## Data and Database Changes
Work 전용 표시 데이터 추가. 기존 projects 데이터와 DB 보존.

## SEO Changes
기존 metadata/canonical/OG/Twitter/JSON-LD 보존.

## File Changes
- `src/app/work/page.tsx`
- 신규 `src/app/work/work.module.css`, `src/data/work.ts`
- 본 계획 및 `doc/projects-reorganization/audit/07-work-verification.md`
- 임시 검증 스크립트·이미지는 저장소 외부에 보관.

## Implementation Steps
1. Work 전용 문구와 카드 UI 구현.
2. 구현 완료 후 상태를 Pending Verification으로 변경.
3. 별도 검증 단계에서 빌드·lint·브라우저 및 diff 대조.

## Validation
`git diff --check`, TypeScript, `npm run lint`, 분리 환경 `npm run build`. 기존 전역 prettier plugin 누락만 baseline 예외이며 변경 TS 파일 scoped lint는 오류·경고 0이어야 한다.
브라우저 320/390/768/1024/1440px, 양 테마, overflow·카드 링크·키보드 focus·reduced motion·JS 비활성 표시·SEO 확인. desktop/mobile 캡처 직접 검토.

## Acceptance Criteria
1. 참고의 회색 둥근 카드와 단일 대표 지표, 3/2/1열을 재현한다.
2. 6개 프로젝트의 사실성 경계와 기존 상세 링크를 보존한다.
3. overflow 없이 모바일/다크 모드 지원, focus 표시, 정적 콘텐츠 접근 가능.
4. 공유 소스 변경 없음, SEO 유지, build/type/scoped lint/diff 통과. 전역 lint는 기존 baseline과 동일.

## Risks and Rollback
한글 길이에 따라 참고와 줄바꿈·높이는 다르다. Work 전용 파일만 복원하면 되며 DB 변경은 없다.

## Follow-Up Plans
프로젝트별 상세 내용 정교화와 채용사이트 상세 추가는 별도 요청 시 진행.

## Implementation Log
- Work 전용 표시 데이터와 CSS, 서버 렌더링 카드 6개 구현. 공유 소스 및 SEO 생성 경로 보존.
- TypeScript와 변경 TS/TSX scoped lint 오류·경고 0. 전역 lint는 기존 prettier plugin 누락과 동일.
- 최종 상세 링크 경로는 실제 기존 `/project/[slug]`로 확인했다. 분리 빌드와 브라우저 검증을 별도 단계에서 수행한다.

## Verification Log — 2026-09-30
- PASS: 수용 기준 1–4를 최종 코드·diff·빌드·브라우저 결과와 대조했다.
- 분리 production build 120페이지 생성, TypeScript/diff/scoped lint 통과. 전역 lint 및 build 내 lint 진단은 기존 prettier plugin 누락으로 제한된다.
- 실제 Chrome 검사 39개 통과: 5개 폭×양 테마, 6개 상세 링크, 정확한 지표·범위, focus, reduced motion, JS 비활성 렌더링, SEO, runtime 오류 없음.
- 1440/390px 양 테마 캡처 4장 직접 검토. 카드 줄바꿈·구분선·대표 지표·모바일 간격 확인.
- 최종 src와 분리 빌드 src가 동일함을 diff로 확인. 기존 추적 소스 변경은 work/page.tsx 하나이며 신규 Work CSS/data 외 공유 소스 변경 없음.
- 상세 결과는 `../audit/07-work-verification.md`. 로컬 3107 preview 유지, 커밋·배포 없음.
