# 프로젝트 상세 사례 연구형 개편 검증

2026-09-30 / Plan 08 / PASS (기존 전역 lint 제한 포함)

## 수용 기준 근거

| 기준 | 검증 |
| --- | --- |
| 6개 상세에 참고 구성 적용 | 모든 페이지에 중앙 제목, 3–4개 지표, 명암 비교, 배경·역할·문제·구현·접근·구조·품질·기술, 이전/다음 존재. 6개 데스크톱 전체 캡처 직접 확인 |
| 사실·범위 보존 | source projects와 상세 전용 데이터 대조. 대륜톡 기존 서버/패키지 확장, 12만 실제 상담, ERP 1,000명 합성 DB 저장, SNN 관리자 영역, 외주 목데이터 기반, 법률 출시 보류, Spring 선행 인프라 및 개발 QA 명시 |
| 반응형·접근·경로 | 6페이지×320/390/768/1440px×light/dark에서 overflow·본문 잘림 없음. 목록에서 상세 진입, 이전/다음 순환 및 목록 복귀, focus-visible, reduced motion, JS 없는 본문, 미등록 slug 404 확인 |
| 기술·SEO·격리 | TypeScript/diff/scoped lint 성공. build 성공(120페이지). 기존 title/description/canonical/OG/Twitter/JSON-LD 생성 코드 유지 및 6페이지 실제 metadata 검사. 최종 src와 빌드 src 비교 차이 없음 |

## 검사 결과
- `npx tsc --noEmit --incremental false`: exit 0.
- `git diff --check`: exit 0.
- 변경 3개 TS/TSX에 Next core-web-vitals/typescript lint: 오류 0 / 경고 0.
- `npm run lint`: exit 2, 기존 eslint-plugin-prettier 누락. Plan 07과 동일. 설정·패키지는 변경하지 않음.
- 분리 환경 `npm run build`: exit 0, 120개 페이지 생성. 내장 lint 단계에는 동일한 plugin 누락 진단이 남음. 전체 lint가 통과했다는 뜻은 아님.
- Chrome 자동 검사 159/159, 실제 탐색 추가 검사 9/9.
- 초기 검사 도구의 SPA navigation 대기 timeout은 URL·본문 확인 방식으로 변경 후 재검증. 최종 실행에 timeout 또는 pageerror 없음.
- 전체 6개 desktop와 대륜톡 mobile 전체 캡처, ERP dark desktop 및 light mobile 상단/구조, 법률·Spring dark mobile 상단을 직접 검토.

## 데이터 검토
미확인 수치·절감률·이용자 성과를 만들지 않았다. 신규 구축은 '구축 과제/구현 결과', Spring은 '이관 과제/개발 환경 검증 결과'로 표현한다. 개념 흐름도는 담당 기능 중심이며 전체 인프라를 구축했다는 주장이 아니다. 법률 프로젝트의 품질 영역은 내부 테스트·출시 상태로 한정한다.

## 보존 및 제한
제품 코드 변경은 route, ProjectDetails, 전용 CSS와 projectCaseStudies 데이터 4개 파일뿐이다. 원본 projects, Work, Resume, 홈, 공통 UI, DB, SEO 설정·사이트맵 코드는 보존했다. 정적 데이터 페이지이므로 별도 조회 loading/error/empty UI 없음. 없는 프로젝트는 기존 404 처리 유지. AI 질문 UI 없음.

검증은 공개 사례 텍스트와 UI에 대한 것이며 실제 회사 시스템의 수치나 운영 상태를 재측정한 것은 아니다.

## 로컬 증거
임시 도구·캡처는 `/tmp/plan08-*`에만 보관한다. 요약 결과 `/tmp/plan08-results.json`, `/tmp/plan08-extra-results.json`. 검증 빌드 `/tmp/portfolio-plan08-CUHeCn`. 임시 파일은 장기 보존하지 않는다.

사용자 preview: http://127.0.0.1:3108/work. 다른 실행 서버는 중단하지 않았다. 커밋·push·배포 없음.
