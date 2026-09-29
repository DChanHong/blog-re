# Plan 05 Verification

## Attempt 1 — 2026-09-30

Verdict: FAIL (motion focus termination)

- 실제 검색/필터/페이지/뒤로가기, SEO/JSON-LD/sitemap/robots, desktop/mobile 양 테마 및 320/640/768/1024/720 reflow 통과.
- 분리 build 120페이지와 type/scoped lint 통과. 전역 lint는 기존 eslint-plugin-prettier 누락 exit 2.
- 브라우저 fixture에서 진행 중인 애니메이션에 focus를 주면 `stop()` 후 inline style을 지워도 다음 Motion 프레임에서 중간 opacity/transform이 다시 반영됨. 2 rAF 뒤 첫 행 opacity .897, 후반 행 0으로 남는 것을 재현했다. 수용 기준 4 미충족.
- 초기 빈 목록 assertion은 hydration 완료 전 평가하는 검사기 race였으므로 완료 조건 대기로 보정. 구현 결함으로 판단하지 않았으며 재검사 필요.
- 검증 단계에서는 앱 코드를 수정하지 않았다. 사용자 승인된 연속 execute/verify 흐름에 따라 같은 계획의 보정 단계로 인계한다.

## Final Verdict — 2026-09-30

**PASS**, 승인된 전역 lint 기준선 예외 적용. execute 보정 후 verify를 별도 재실행했다. 최종 검증 중 앱 코드 수정 없음.

### Acceptance evidence

| 기준 | 증거 및 판정 |
| --- | --- |
| 1. 레퍼런스 구조/문구/가독성 | 실제 reference/result 1440/390 양 테마 캡처 육안 대조. Writing → 검정/회색 제목 → 설명 → 탐색 → 구분선 행 구조, 이미지 0, 승인 문구 일치. desktop 64px/24px/18px, mobile 36px/21px/16px. PASS |
| 2. 탐색 | 실제 97개 글, 9개/page. 검색 RAG + category AI Agent + tag AI Agent 조합, 전체 초기화, page 2, 브라우저 back, 필터 키보드 Enter/Tab 확인. 전체 태그 배열을 제공하며 이전 20개 제한 제거. PASS |
| 3. 보존 | before.json/preservation.json: src 변경은 writing 5개만, 보존 대상 변동 0, 최종 build와 source mismatch 0. metadata/JSON-LD 동일; sitemap(lastmod 제외)/robots 동일; exact /blog 308와 query, 실제 상세 200, 원문 fallback 확인. PASS |
| 4. 모션 | 첫 성공 응답 직후 opacity 첫행 .84/둘째 .56/후반 0인 순차 진행. focus 후 2프레임에 9행 opacity 1/transform none. 검색/page 갱신 모션 없음. reduced-motion hero/행 즉시 노출. FAIL 원인 해결 후 PASS |
| 5. 상태/접근성 | 0/1/9개·지연응답·글 및 메타 실패·재시도·긴 제목/태그 fixture; 실패와 0개 구분. H1/main 각각 1, 320/390/640/768/1024/1440 및 720px reflow 양 테마 overflow 없음. 키보드 focus outline 확인. PASS |
| 6. 검증 | browser-checks.json **62/62**. 분리 build 120페이지, post-build 및 checkout tsc, scoped lint 4 TSX 오류/경고 0, diff check 통과. PASS |

### Visual comparison and approved differences

- reference는 1152px 내부 폭/2개 영문 글, 결과는 승인된 1280px 폭/9개 한글 글이다. 글 수·문구 길이 때문에 페이지 전체 높이는 같지 않다.
- reference의 EN/KO 대신 검색+필터를 제공한다. 모바일 399px 이하에서는 검색과 필터를 두 행에 두어 입력 공간을 확보한다. 필터는 기본 접힘, 활성 상태는 패널 외부에서도 보인다.
- reference의 2단계 제목 명도/텍스트 중심 목록/분리선/PC 오른쪽 보조 정보와 모바일 하단 보조 정보 배치를 유지했다. 글자와 설명은 승인된 가독성 기준으로 확대했다.
- 한국어 제목의 두 번째 문장은 모바일에서 추가 줄바꿈된다. 억지 축소/잘림 없이 의미를 유지한다. 요약만 최대 2줄로 제한하며 제목은 전체 표시한다.
- 기존 80/72px 헤더와 푸터, 홈은 변경하지 않았다. 개발 캡처의 Next 개발 도구/기존 개발 위젯은 이번 구현이 추가한 요소가 아니며 production-light/dark 캡처에는 없다.
- production.json 실제 대비: light 제목 16.54, 보조 큰 제목 3.20, 요약 4.98; dark 각각 18.18/4.77/7.69. 큰 제목 3:1, 일반 본문 4.5:1 충족.

### Commands and artifacts

- `node doc/projects-reorganization/audit/05-browser.cjs`: exit 0, 62개 통과. 테스트는 browser request interception을 사용하여 원격 DB를 변경하지 않음.
- `node doc/projects-reorganization/audit/05-workspace.cjs build`: exit 0, `npm run build` 분리 실행. 최종 snapshot `portfolio-plan05-build-bK9Szl`. 120페이지 생성.
- 최종 snapshot `npx tsc --noEmit --incremental false`: exit 0. checkout 동일 명령도 exit 0.
- `node doc/projects-reorganization/audit/05-workspace.cjs lint`: 4 TSX, errors 0/warnings 0.
- `npm run lint`: exit 2, 기존 `eslint-plugin-prettier` 누락. build의 같은 lint 진단도 보존했다. 전역 lint 통과로 주장하지 않음.
- `git diff --check`: exit 0.
- `node doc/projects-reorganization/audit/05-workspace.cjs preserve`: writing 5개만 변경, violations/buildMismatches 모두 빈 배열.
- 최종 production 서버 3105: 양 테마 `/writing` 200/9행/overflow 없음. 실제 스크린샷 `production-light.png`, `production-dark.png`.
- 증거: `../baseline/plan05/`의 browser-checks.json, fixture-checks.json, preservation.json, lint.json, build.log, production.json, reference/result/filters/empty/long-content PNG.

### Limits and scope

- 200% 확대는 1440px 화면의 720 CSS-px 등가 reflow로 확인했으며 브라우저 메뉴 zoom 자체를 자동 조작한 검사는 아니다. 화면낭독기 음성 출력/모든 보조기술 조합을 검증했다고 주장하지 않는다.
- sitemap의 동적 lastmod는 비교에서 제외했지만 해당 생성 코드와 데이터 읽기 경로는 해시로 보존 확인했다.
- 이번 변경에 해당하는 기존 자동화 unit test 파일은 발견되지 않아 scoped 검사와 새 브라우저 검사를 사용했다.
- 운영 배포·DB 쓰기·재수집·commit/push는 수행하지 않았다. 이 판정은 승인된 Writing 목록에 한정하며 글 상세 리디자인/다른 페이지 완성을 뜻하지 않는다.
