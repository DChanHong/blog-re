# TTFB 성능 개선 목표

## 0. TTFB란?
**TTFB (Time To First Byte)**는 브라우저가 웹 서버에 페이지를 요청한 후, 서버로부터 **첫 번째 바이트(데이터의 시작)**를 수신하기까지 걸리는 시간을 의미합니다.
* 쉽게 말해 **"서버가 응답을 시작할 때까지의 대기 시간"**입니다.
* 서버가 느리거나, DB 조회가 오래 걸려 HTML 생성이 지연되면 TTFB가 길어집니다.
* TTFB가 길면 사용자는 그동안 **흰 화면(White Screen)**만 보게 되며, SEO 점수에 악영향을 미칩니다.

## 1. 현재 상태 (As-Is)
- **측정 지표**: TTFB (Time To First Byte)
- **현재 값**: `1.3s` (1307.5ms)
- **Rating**: 🟡 Needs Improvement
- **현상**: 
  - 초기 진입 시 서버가 모든 데이터(FAQ, 블로그 포스트)를 fetching 할 때까지 HTML 응답을 지연시킴.
  - 사용자는 약 1.3초 동안 흰 화면(Blank Page)을 응시해야 함.

## 2. 개선 목표 (To-Be)
- **목표 값**: `0.2s` 미만 (Instant Loading)
- **Rating**: 🟢 Good
- **기대 효과**:
  - 서버는 껍데기(Layout, Font, Meta tags)만 포함된 HTML을 즉시 응답.
  - 사용자는 진입과 동시에 UI 프레임과 로딩 상태(Skeleton)를 확인 가능.
  - 검색 엔진 봇에게 "빠른 서버 응답 속도" 신호 전달.

## 3. 개선 전략
- **기술**: React `Suspense` & Next.js `Streaming`
- **적용 방안**:
  1. **데이터 페칭 분리**: `page.tsx`에서 하던 병렬 데이터 요청을 각 섹션 컨테이너(`FaqContainer`, `BlogContainer`)로 이관.
  2. **Streaming 적용**: 메인 페이지는 즉시 렌더링하고, 데이터가 필요한 섹션은 `Suspense`로 감싸서 비동기 로딩.
  3. **UX 보완**: 데이터가 준비되는 동안 `Skeleton UI`를 노출하여 이탈률 방지.

## 4. 모니터링 계획
- Chrome DevTools Network 탭 (Doc 요청 시간 확인)
- Web Vitals 라이브러리 콘솔 로그 확인
