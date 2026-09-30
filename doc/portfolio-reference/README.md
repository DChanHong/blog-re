# Daehan Portfolio Reference Audit

## Purpose

`https://daehanportfolio.vercel.app/`을 현재 블로그 전면 개편의 구조 및 디자인 참고 대상으로 분석한 문서 모음이다.

조사일: `2026-09-28`

## 조사 범위

- 사이트맵에 공개된 URL 17개 전체 확인
- 모든 페이지의 HTML, 제목, 섹션, 링크, 버튼 및 메타데이터 확인
- 데스크톱 렌더링 확인
  - Home
  - Work
  - Resume
  - Writing
  - Ask AI
  - Project detail
  - Blog detail
- 모바일 실제 뷰포트 확인
  - Home
  - Work
  - Project detail
- 라이트/다크 테마, 언어 전환, 프로젝트 필터 UI 확인
- 공개 CSS에서 디자인 토큰과 반응형 규칙 확인

## 핵심 결론

사이트는 다음 6개 핵심 페이지 템플릿으로 구성된다.

1. Home
2. Work list
3. Project detail
4. Resume
5. Writing list / Blog detail
6. Ask AI

페이지 수는 17개지만 프로젝트 상세 10개와 블로그 상세 2개는 각각 공통 템플릿을 공유한다. 현재 블로그를 개편할 때 페이지별 화면을 따로 만들기보다 공통 레이아웃과 데이터 모델을 먼저 설계하는 것이 적합하다.

## 문서 목록

- [01-route-map.md](./01-route-map.md): 공개 URL 17개와 페이지별 구성
- [02-page-templates.md](./02-page-templates.md): 6개 핵심 템플릿의 상세 구조
- [03-design-system.md](./03-design-system.md): 색상, 타이포그래피, 간격, 반응형 규칙
- [04-implementation-notes.md](./04-implementation-notes.md): 현재 블로그 개편 시 적용할 구조와 체크리스트

## 확인할 수 없는 영역

공개 페이지 분석만으로 다음 내용은 확정할 수 없다.

- 원본 React 컴포넌트와 TypeScript 소스
- Ask AI의 시스템 프롬프트와 서버 검색 로직
- CMS 및 데이터베이스 구조
- 배포 환경변수와 관리자 기능
- 비공개 분석 도구 및 운영 데이터

Ask AI는 화면과 입력 구조만 확인했으며 실제 질문은 제출하지 않았다.
