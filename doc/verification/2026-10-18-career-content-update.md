# 기존 포트폴리오 경력 업데이트

사용자의 후속 정정에 따라 기존 페이지의 프로젝트 경험을 최신 회사경력 MASTER·작성기준·확정 제출 문서와 일치시키는 작업으로 범위를 정리했다.

## 현재 반영 범위

- 새 경로는 추가하지 않는다. `/apply/lt-metal`과 제출 전용 PDF 링크·복사본·sitemap 항목을 제거했다.
- 기존 홈, `/work`, `/resume`, 프로젝트 상세, 검색·공유 설명의 원본 데이터, 챗봇 참조 텍스트를 갱신했다.
- Spring 구현·Kafka 연동·개발 서버 배포 완료 표현을 이관 준비·연습 모듈 구성으로 정정했다.
- 상담 12만 건을 누적 상담 유입으로 수정했다.
- ERP의 미확정 2026.02~03과 검증되지 않은 API 13개를 제거했다. 신규 개발 약 1개월로 표기했다.
- 평가 운영 대상 200~300명과 합성 데이터 1,000명 DB 저장 검증을 구분했다. 실제 외부 알림 수신 검증을 주장하지 않는다.
- 기존 ERP 상세와 이력서에 전자결재 초기 공동 개발, DB·주요 결재 로직 담당, 이후 공동 유지보수를 추가했다. 약 500명은 사용 대상 임직원이다.
- 관리자 종합평가의 기존 DB 활용·화면/API 개편과 기존 자체취합 평가의 인수인계 후 유지보수·오류 수정·구조 개선을 구분했다.
- 법률 상담의 기간·질문지 DB 재설계·웹 배포 완료·검색 사이트 오픈 미진행 상태를 최신 자료에 맞췄다.
- Go는 기존 서버 보완, AI·RAG는 개발 중 개인 프로젝트로 유지했다.

회사경력 MASTER의 후속 정정과 확정 PDF를 경력 근거로 활용했다. 경력 원본·PDF·Google Slides는 변경하지 않았다. Oracle·MES·PLC·제조업 AI·MLOps 운영 경험을 추가하지 않았다.

## 수정 파일

- `src/data/projects.ts`, `projectCaseStudies.ts`, `work.ts`, `resume.ts`, `careerData.ts`
- `src/components/domain/home/ReferenceHome.tsx`
- `src/components/domain/project/ProjectDetails.tsx`
- `src/types/portfolio.ts`
- `src/components/domain/career/ProjectTimeline.tsx`
- `src/components/domain/home/ProjectShowcase/index.tsx`
- `public/resume.txt`
- 이 문서

`ResumePage.tsx`와 `sitemap.ts`의 전용 제출 링크 변경은 원래 상태로 되돌렸다. 작업 전부터 존재하던 미추적 `CLAUDE.md`는 수정하지 않았다.

## 검증

- 앞선 기존 페이지 10개 × 1440/390/320px 검사에서 가로 넘침·페이지 JavaScript 오류 없음. ERP 상세와 이력서 추가 경력의 모바일 캡처 검토.
- 범위 정정 후 `npm run build` exit 0, 타입 검사·변경 파일 ESLint·`git diff --check` 통과.
- 기존 `/work`, `/resume`, `/project/erp-groupware` HTTP 200. 제거한 `/apply/lt-metal` HTTP 404. 기존 페이지에 전용 제출 경로 링크 없음.
- 전체 lint는 기존 `eslint-plugin-prettier` 누락으로 실패한다. 저장소 설정·의존성은 변경하지 않았다.
- 원격 보안 검사 스크립트는 Supabase DNS 제한으로 실행 불가. DB·보안 구조는 변경하지 않았다.

## 남은 불확실성

ERP 세 업무의 실제 시작 연월, 최신 API 개수, 관리자 종합평가의 실제 운영 전환·개인 알림 운영 범위는 미확인이다. Spring의 준비·연습 이후 완료 경험도 새로운 근거 없이 확정하지 않았다.

커밋·푸시·운영 배포는 수행하지 않았다. 확인 경로는 기존 `/work`, `/resume`, `/project/erp-groupware` 등이다.
