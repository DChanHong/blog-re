# 10. Natural Korean Portfolio Copy

Status: Verified

Approved: 2026-10-06. 사용자가 Resume 권장안 전체 반영과 랜딩·모든 프로젝트 페이지의 동일 기준 수정을 승인했다. 승인된 문구 수정 작업을 계획→구현→검증까지 연속 수행한다.

## Goal
Resume, 홈, Work 목록 및 7개 프로젝트 상세의 한국어를 자연스럽고 구체적으로 다듬는다.

## References
- 사용자 제공 문장 검토 기준 및 승인된 Resume 1차 수정안.
- Verified plans 06, 08, 09.
- `doc/portfolio-reference/README.md`, `02-page-templates.md`.
- `src/data/resume.ts`, `careerData.ts`, `projects.ts`, `projectCaseStudies.ts`, `work.ts`.
- `src/app/resume/ResumePage.tsx`, `page.tsx`, `src/components/domain/home/ReferenceHome.tsx`, `src/components/domain/home/Section3/index.tsx`, `src/components/domain/project/ProjectDetails.tsx`, `src/app/work/page.tsx`, `src/app/project/[slug]/page.tsx`, `src/lib/seo/config.ts`.
- `package.json`, `eslint.config.mjs`, `next.config.ts`.

## Current State
작업 트리 clean. 상담 12만 건은 서비스 첫 1년 DB 집계, ERP 1,000명은 합성 DB 저장 테스트. 상세 일부 문구가 공유 데이터를 override하며 lint는 prettier plugin 누락 기준선이 있다.

## Decisions
불필요한 쉼표·추상어·반복 구조를 줄인다. 문제·직접 한 일·선택 이유를 드러낸다. 지표와 기간, 담당 범위, 검증 한계를 유지한다. Resume는 승인안을 반영하며 소개는 기존 한 문단 구조에 맞춘다. 기술명과 짧은 구조 도표에는 목록 표기를 유지한다. 원본 제출 자료와 블로그 게시글은 편집하지 않는다.

## Scope
Resume 전체 문구, 홈 소개·역량·경력·학습, 7개 상세 전체 설명, 대표 카드·Work 요약, 해당 SEO 설명 및 공통 상세 섹션 제목.

## Non-Goals
레이아웃/CSS/기능/라우트/스키마 변경, 새 실적 추가, 의존성 설치, commit/push/배포.

## Route and Navigation Changes
None. 기존 링크와 프로젝트 slug 유지.

## Data and Database Changes
기존 typed data의 문구만 수정. DB 변경 없음. 미사용 레거시 데이터·public/resume.txt는 과거 기록으로 유지.

## SEO Changes
Resume·Work·홈 설명 문구를 갱신. 상세는 기존 summary 기반 metadata/JSON-LD 경로를 사용한다. canonical/robots/OG 이미지/sitemap 구조 유지.

## File Changes
- `src/data/resume.ts`, `careerData.ts`, `projects.ts`, `projectCaseStudies.ts`, `work.ts`
- `src/app/resume/ResumePage.tsx`, `src/app/resume/page.tsx`, `src/app/work/page.tsx`
- `src/components/domain/home/ReferenceHome.tsx`, `src/components/domain/home/Section3/index.tsx`, `src/components/domain/project/ProjectDetails.tsx`
- `src/lib/seo/config.ts`
- 본 계획, `doc/projects-reorganization/audit/10-natural-korean-copy-verification.md`

## Implementation Steps
1. 승인안과 현재 사실 범위를 대조한다.
2. Resume→홈→7개 상세→목록·SEO 순서로 수정한다.
3. diff·변경 파일 lint·타입·build를 확인한다.
4. 별도 verify 절차에서 실제 렌더링과 원문 범위 보존을 대조한다.

## Validation
`git diff --check`, TypeScript, 변경 파일 임시 Next/TypeScript lint, `npm run lint`, `npm run build`. 기존 전역 prettier plugin 누락은 기록된 기준선 예외로 비교한다. 실제 브라우저 1440/390/320px에서 홈·Resume·Work·7개 상세의 단일 H1/가로 넘침/본문/metadata 확인 및 desktop/mobile 대표 캡처 검토. 빌드 네트워크가 차단되면 제한을 기록하고 로컬 실행 검증은 계속한다.

## Acceptance Criteria
1. 승인된 Resume 문구 및 동일 편집 기준이 홈과 7개 상세·목록에 적용된다.
2. 프로젝트 ID·기간·수치·기술·담당 범위·검증 한계를 보존한다.
3. 변경 파일 lint/type/diff가 통과하고 build 결과와 전역 lint 기준선을 정확히 기록한다.
4. desktop/mobile에서 본문이 렌더링되며 새 가로 넘침이나 metadata 불일치가 없다.

## Risks and Rollback
문장 길이가 달라지므로 모바일 줄바꿈을 확인한다. 기존 데이터 파일의 문구 변경만 되돌릴 수 있다.

## Follow-Up Plans
추가 사용자 피드백에 따른 2차 문장 조정.

## Implementation Log — 2026-10-06
- 승인된 Resume 권장안 전체와 홈 소개·역량·경력·기술·교육·최근 글 안내 반영.
- 7개 프로젝트의 요약·배경·역할·문제·해결 방법·결과·회고·범위 설명과 상세 override, Work 카드·SEO 문구를 수정. 공통 상세 제목도 자연스럽게 조정.
- 소스 12개 변경. CSS·데이터 구조·route·dependencies 변경 없음. 기술명 및 짧은 도표는 기존 목록 형태 유지.
- 변경 12개 파일 임시 Next/TypeScript ESLint, TypeScript, diff 통과. 전역 lint는 기존 prettier plugin 누락(exit 2)과 동일.
- 기본 build는 블로그 조회 네트워크 제한으로 실패. 권한을 받은 최종 `npm run build`는 exit 0, 128페이지 생성. 빌드 후 TypeScript exit 0.
- 프로젝트 7개의 ID·기간·상태·대표 여부·사용 기술이 HEAD와 동일하며 Resume 6개 항목 및 bullet 수 보존 확인.
- 현재 요청에서 연속 검증까지 승인한 범위에 따라 verify 절차를 이어간다.

## Verification Log — 2026-10-06
- Acceptance Criteria 1–4 PASS. 소스 12개 문구 변경과 데이터/담당 범위 보존 대조 완료.
- 최종 build·post-build TypeScript·변경 파일 ESLint·diff 통과. 전역 lint의 기존 누락 plugin 예외 유지.
- 1440/390/320px × 10페이지 = 30개 실제 production 렌더링 검사 통과. H1·가로 넘침·metadata·핵심 범위 문구 확인, 페이지 JS 오류 없음.
- desktop/mobile 및 ERP dark 캡처 검토. 자세한 결과는 `audit/10-natural-korean-copy-verification.md`에 기록했다. 임시 검증 서버는 종료한다.
