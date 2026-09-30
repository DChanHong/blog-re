# Work 카드 개편 검증

검증일: 2026-09-30 / Plan 07 / 판정: PASS (기존 전역 lint 제한 포함)

## 구현 범위
`src/app/work/page.tsx`, `src/app/work/work.module.css`, `src/data/work.ts`만 제품 코드 변경. 이미지·의존성·클라이언트 상태·AI·DB 변경 없음. 기존 6개 상세 페이지 유지.

## 수용 기준 대조
1. 회색 배경 #f0f0ee, 다크 #1c1c1f, 28px 곡률, 16px 간격, 제목/설명/구분선/단일 지표 확인. 1440/390px 양 테마 4개 캡처 직접 검토.
2. 6개 카드의 지표를 projects.ts와 대조. Excel 양식 유지, CMS 관리자 범위, 외부 출시 보류, 개발 서버 QA·운영 전환 전을 명시. 각 `/project/[slug]` 응답 200 및 H1 확인.
3. 320/390/768/1024/1440px × light/dark에서 카드 6개와 1/1/2/3/3열 확인, 가로 overflow 없음. focus-visible outline, reduced motion에서 애니메이션 없음, JS 비활성 상태에서 전체 카드 표시. 브라우저 pageerror 없음.
4. metadata 생성 코드는 기존과 동일. canonical/OG URL 일치, description/Twitter/CollectionPage JSON-LD 확인. 공유 소스는 변경 없음. 최종 src와 검증 빌드 src 비교 차이 없음.

## 명령과 결과
- `git diff --check`: PASS.
- `npx tsc --noEmit --incremental false`: PASS.
- `npm run lint`: 기존 eslint-plugin-prettier 누락으로 exit 2. Plan 06 및 현재 변경 전 baseline과 동일하며 이번 범위에서 설정을 바꾸지 않았다.
- 변경 TS/TSX 2개에 Next core-web-vitals/typescript 규칙 적용: 오류 0, 경고 0.
- 임시 분리 환경 `npm run build`: exit 0, 120개 페이지 생성. 내장 lint 단계에는 동일한 기존 plugin 누락 진단이 남는다. lint 전체 통과를 의미하지 않는다.
- Chrome 브라우저 검사: 39/39 PASS.

## 임시 증거와 미리보기
검증 helper와 캡처는 `/tmp/plan07-*`에 두어 저장소에 불필요한 이미지·JS를 추가하지 않았다. 상세 결과 `/tmp/plan07-results.json`, 빌드 `/tmp/portfolio-plan07-Yn3okx`. 임시 파일은 장기 보존하지 않는다.

미리보기: http://127.0.0.1:3107/work (분리 production snapshot). 실행 중인 다른 서버는 중단하지 않았다. 커밋·push·배포는 수행하지 않았다.

## 적용 제외
정적 목록이므로 데이터 조회 loading/error 상태와 사용자 필터 empty 상태는 없다. 채용사이트 상세 추가, 프로젝트 상세 문구 동기화, 전역 lint 설정 복구는 별도 작업이다.
