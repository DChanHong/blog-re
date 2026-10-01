# Plan 09 검증 — 2026-10-01

판정: 구현 범위 PASS. 전역 lint는 기존 누락 플러그인 예외를 유지한다. 실제 제품 화면 추가는 자료 미제공으로 후속 작업이며 완료로 주장하지 않는다.

## 콘텐츠와 연결
- 상담 플랫폼: 토큰 갱신·방 재참여·서버 데이터 재조회·앱 Bridge·실패 안내를 기존 이력서와 상담 MASTER에 대조했다. 복구 성공률·시간 지표를 추정하지 않았다.
- 운영 설정: 대표 문구·프로필·답변 설정과 패키지 코드 변경을 구분했다. 전체 배포에 최대 약 8시간이 필요할 수 있다는 환경 제약을 설명하며 8시간 단축을 주장하지 않는다.
- ERP: Excel 유지, 현재 입력과 발송 Snapshot 분리, 핵심 저장과 외부 알림 분리의 판단을 보강했다. 1,000명은 합성 DB 저장 검증으로 유지한다.
- 상담 함수 58개+·컴포넌트 43개는 상단 지표에서 구현 범위로 이동했다. 대표 지표는 약 80개·12만 건+·서버 설정으로 구성된다.
- 채용사이트: 이력서의 5단계 지원서·약 3주 개발·입력 보존·검증·제출 API·기존 암복호화·S3·관리자 검토와 운영 규모만 사용한다.
- Work → 채용 상세, Resume → 채용 상세, 채용 상세 → 다음 법률 프로젝트를 실제 클릭해 확인했다. 이전 링크는 admin-platform, 다음 링크는 legal-platform.

## 실행 검증
- `npm run build`: exit 0. 기본 sandbox의 공개 블로그 데이터 조회 실패 후 네트워크 권한을 받아 같은 명령을 재실행했다. 기존 prettier plugin 경고 유지.
- build 완료 후 `npx tsc --noEmit --incremental false`: exit 0. build와 동시 실행한 첫 검사는 생성 타입 경합으로 무효 처리하고 순차 재검증했다.
- 변경 5개 TS/TSX에 임시 `next/core-web-vitals`, `next/typescript`, `prettier` 구성으로 eslint: 오류·경고 0. 임시 구성은 `/tmp`에만 두고 Next/TypeScript 규칙을 유지했다.
- `git diff --check`: 통과.
- `npm run lint`: exit 2, 기존 `eslint-plugin-prettier` 누락과 동일.
- lint 설정 복구를 검토할 때 기존 소스·CJS 검증 스크립트에서 82 errors/14 warnings가 노출돼 기본 build도 실패했다. 설정은 변경 전으로 원복했으며 전역 정리는 이번 콘텐츠 변경에서 수행하지 않았다. 원복 후 `eslint.config.mjs`, `package.json`, lockfile의 diff 없음.

## 브라우저 검증
- production 서버의 기본 1280px 홈 캡처에서 `설계·개발하며`가 하나의 줄로 표시되고 중간점 앞 줄바꿈이 사라짐을 확인했다. 소개 데이터의 원문 유지.
- 390px·320px 각각 Home/Work/Resume/프로젝트 상세 7개, 총 20페이지 관찰에서 document 가로 넘침 없음·H1 1개.
- 채용 상세의 desktop light와 320px dark 실제 캡처를 직접 검토했다. 기존 상세의 hero·지표·비교·본문 템플릿 유지.
- 상담 상세에서 상단 지표 3개와 복귀 확인 → 인증·연결 → 상담방·데이터 → 사용자 안내 4단계 실제 렌더링 확인.
- 채용 상세 title·canonical·og:url·JSON-LD 존재 확인. canonical/og:url은 `https://portfolio.dev-hong.it.kr/project/recruitment`.
- 생성된 production HTML 7개와 `sitemap.xml`의 채용 경로 포함 확인.
- 임시 viewport와 theme를 원복하고 검증 서버를 종료한다. 커밋·push·배포·DB 쓰기 없음.

## 남은 자료
실제 상담 위젯·콘솔 및 인사평가 화면 자료가 저장소에 없다. 사용자에게 캡처 폴더 경로를 요청했으며 응답 전까지 실제 화면·이미지 추가는 미완료다. 임의 목업과 빈 이미지 자리표시는 추가하지 않았다.
