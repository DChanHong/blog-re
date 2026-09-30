# 06. Resume Reference Reconstruction

Status: Verified

Approved: 2026-09-30. 사용자가 제출 자료 검토 후 추천 문구 반영과 이력서 화면 수정을 승인했다. 계획 기록→구현→검증을 단계별로 연속 수행한다.

## Goal

`/resume`을 제공된 참고 이력서처럼 단일 문서 카드로 재구성하고 검토한 본인 경력의 추천 문구를 반영한다.

## References

- `doc/portfolio-reference/README.md`, `doc/portfolio-reference/02-page-templates.md` (Resume).
- `src/app/resume/ResumePage.tsx`, `src/app/resume/page.tsx`, `src/data/careerData.ts`.
- 사용자가 제공한 2026-09-30 09:22:47~58 이력서 스크린샷 4장.
- 직전 자료 검토 결과: 지원정리의 PDF 7개(55쪽), APR Word 원본 및 자소서·추가 인터뷰. 이번 단계에서 원본 문서나 외부 프로젝트를 수정하지 않는다.

## Current State

Plan 00–05 Verified, 작업 트리 clean. 현재 Resume는 소개/성과 카드·성장 과정·프로젝트 카드·역량 카드·학력으로 구성된다. 공통 header/footer와 테마, Pretendard는 유지한다.

## Decisions

- 승인된 추천: 한국어, 웹 개발자, 업무 이해→화면/API/데이터→운영 개선의 소개. 한 회사 경력 안에 대륜톡(4 bullets), ERP(3), 채용사이트(2), SNN(2), MSA(2), 운영 개선(1)을 담는다.
- KBO Mate는 개발 중 개인 프로젝트로 2 bullets; 기술은 실무/확장/개인 학습으로 구분. 교육은 수강으로 표기하며 미확인 수료·자격증은 만들지 않는다. 학력 2016.02–2022.02, 3.9/4.5.
- single outlined document card, top title `경력 및 역량` with mail contact pill; name/contact links, intro, experience, personal project, tools, education. desktop date right / mobile stacked. 작은 본문과 넓은 여백, 다중 카드·수치 타일·sticky section nav 제거. 참고의 개인 내용은 복사하지 않음.
- 12만 건은 서비스 1년간 실제 상담 DB 집계, ERP 1,000명은 합성 데이터 저장 테스트. 기존 공통 패키지에 위젯 추가, SNN 관리자만 담당, Go 기존 서버 확장, MSA 개발 서버 QA로 범위 한정.
- 외주/법률 프로젝트는 기존 상세 페이지에 유지. 소속·연락처는 기존 데이터 재사용; 공개 웹에 전화번호·주소·연봉·생년월일 추가 안 함.
- 외부 원고 전체를 저장소에 복사하지 않고 이력서용 최소한의 공개 문구만 별도 typed data로 저장. 다른 페이지의 공통 career/projects 데이터는 변경하지 않는다.

## Scope

Resume 전용 텍스트 데이터, 문서형 UI·반응형·테마·키보드 접근성. 정적 서버 렌더링, 모션 없음. 이전 fragment overview/experience/projects/capabilities/education 및 기존 프로젝트 ID fragment 보존. 기존 프로젝트 상세 진입은 문서 하단 텍스트 링크로 유지.

## Non-Goals

다른 페이지/공통 shell 변경, AI 기능 복원, 다운로드 PDF 생성, 새 의존성, DB 쓰기·마이그레이션, 배포, 커밋·push, 원본 지원 자료 편집.

## Route and Navigation Changes

None. `/resume` 및 `/career` 308 유지. fragment는 문서의 해당 영역/관련 링크로 연결한다.

## Data and Database Changes

Create `src/data/resume.ts` for Resume-only copy. DB 및 기존 데이터 원본은 보존.

## SEO Changes

이력서 description/keywords만 새 소개 범위와 일치하도록 갱신. title/canonical/OG image/robots/JSON-LD 구조/사이트맵 보존, description은 기존 생성 경로에서 일관되게 재사용.

## File Changes

- Create `src/data/resume.ts`, `src/app/resume/resume.module.css`.
- Replace `src/app/resume/ResumePage.tsx`, update `src/app/resume/page.tsx` metadata.
- Keep old career components/data/public resume.txt (다른 참조와 과거 원본 보존).
- Create `audit/06-resume-reference-verification.md`, reusable `audit/06-*.cjs`, compact `baseline/plan06/` reports and 4 representative screenshots.
- Update this plan and `NEXT_STEPS.md`.

## Implementation Steps

1. baseline/공통 소스 보존 확인.
2. 사실 경계를 포함한 Resume copy와 단일 문서 UI 구현.
3. targeted lint/tsc 및 desktop/mobile 확인 후 Implemented - Pending Verification.
4. 별도 verify 단계에서 전체 기준 확인. 실패 시 execute로 돌아와 해당 범위만 보정 후 재검증.

## Validation

- `git diff --check`, `npx tsc --noEmit --incremental false`, `npm run lint`, isolated `npm run build`, post-build tsc.
- 기존 전역 eslint-plugin-prettier 누락 baseline만 예외로 기록. 변경 TS/TSX 전체 scoped lint 오류/경고 0.
- 1440/390 양 테마 실제 브라우저·4대표 캡처, 320/640/768/1024/720 reflow, 키보드 focus, reduced-motion, 단일 H1/main, 연락 링크·프로젝트 링크·fragment·308.
- 원문 표시/운영·학습 범위/민감정보 제외, metadata/canonical/OG/Twitter/JSON-LD/sitemap/robots 확인. Home/Work/Writing/대표 project smoke 및 공유 소스 변경 없음.
- 정적 데이터이므로 loading/error/empty 조회 상태는 없음. JS 없이 문서가 표시되는지 확인.

## Acceptance Criteria

1. 참고 스크린샷의 문서형 구성·테두리·여백·타이포·날짜 정렬이 desktop/mobile 양 테마에서 재현되고 기존 다중 카드 UI가 사라진다.
2. 승인 소개 및 6개 경력 항목, 개인 프로젝트, 기술, 교육/학력과 모든 사실성 한계가 정확히 표시된다.
3. 가로 overflow/숨겨진 본문/새 console 오류 없음, 링크·focus·old fragments 정상, AI 기능/민감 개인정보 추가 없음.
4. 기존 공통 UI/데이터/경로 보존, SEO 일관성, build/type/scoped lint/diff 통과. 전역 lint는 baseline보다 악화되지 않는다.

## Risks and Rollback

경력 분량 때문에 참고와 전체 높이는 다르다. 실제 운영 지표를 재측정한 것이 아닌 제출 자료 기준이다. Resume 전용 변경만 되돌릴 수 있으며 원본 문서·공유 데이터·DB 변경 없음.

## Follow-Up Plans

다른 페이지의 경력 문구 동기화 및 제출용 PDF는 별도 요청 시 진행. AI 보류 계획 번호 06은 과거 예약이며 실제 파일이 없었으므로 본 계획에 사용한다.

## Implementation Log — 2026-09-30

- Resume 전용 데이터, CSS module, 화면 및 metadata 총 4개 소스 파일 반영. 공통 소스와 기존 데이터는 보존했다.
- 6개 실무 항목, KBO Mate, 구분된 기술 목록, 교육·학력 구현. 기존 fragment와 6개 프로젝트 상세 링크 유지.
- TypeScript, scoped lint(3 TS/TSX, 0 errors/warnings), diff 통과. 분리 build 120페이지 및 post-build tsc 통과.
- 브라우저 51개 검사 통과: 7폭×양 테마, 본문/개인정보 경계, 11 fragments, 상세 링크, focus, SEO, redirect, smoke, JS 비활성 렌더링.
- 기존 3001 dev 서버는 재탐색 중 빈 응답이 있어 분리한 최종 production build(3106)로 전체 재검사했다. 3000의 다른 프로젝트나 기존 개발 서버를 종료하지 않았다.
- 실행 단계 완료. 최종 verify 단계에서 diff·수용 기준·시각 결과·보존 증거를 대조한다.

## Verification Log — 2026-09-30

- 별도 portfolio-verify 단계에서 수용 기준 1–4를 diff·최종 소스·빌드 및 실제 렌더링과 대조. PASS.
- 브라우저 51/51 + 보충 12/12 통과, desktop/mobile 양 테마 4장 검토. 기존 fragment·프로젝트 링크·테마·SEO 확인.
- TypeScript/scoped lint/build/post-build tsc/diff 통과. 전역 lint는 기존 prettier plugin 누락만 예외로 유지.
- 공통 소스 보존 및 최종 빌드 일치 확인. `audit/06-resume-reference-verification.md`에 전체 근거와 제한 기록.
- 3106 preview를 사용자 확인용으로 유지. 커밋·push·배포·DB 변경 없음.

## Commit Handoff — 2026-09-30

사용자가 레이아웃을 확인하고 커밋을 승인했다. 불필요한 이미지·JS 제외 요청에 따라 검증 캡처 4장, 일회성 CJS 3개, 빌드 로그·임시 경로·전체 baseline은 로컬 전용으로 전환한다. 구현과 최종 문서·요약 검증 결과는 유지한다. 내용의 후속 개선은 별도 작업이며 본 커밋에서 추가 수정하지 않는다.
