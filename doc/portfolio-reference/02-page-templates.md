# Page Templates

## Global Layout

모든 일반 페이지는 공통 내비게이션과 푸터를 사용한다.

### Navigation

- 상단 sticky 배치
- 반투명 surface와 backdrop blur
- 좌측: 심볼과 이름
- 중앙: Work, Writing, Resume
- 우측: 테마 전환, Ask AI
- 현재 메뉴 아래에 가는 active underline 표시
- 모바일에서는 이름을 숨기고 심볼만 남김
- 모바일에서는 `Ask AI`를 `Ask`로 축약

### Footer

- 이름, 직무, 지역
- Site 링크: Work, Writing, Resume, Ask AI
- Elsewhere 링크: LinkedIn, Email
- 저작권 및 Next.js 안내
- AI가 사이트 내용만 사용한다는 설명

## Template 1. Home

### Hero

- 가운데 정렬
- 이름과 자격을 작은 텍스트로 표시
- 직무를 매우 큰 H1으로 표시
- 두 줄 설명
- Primary CTA와 text CTA
- 현재 직장과 지역

### Work Method

제목 아래에 네 개의 순서 카드가 배치된다.

1. Understand the business
2. Design the whole system
3. Build it myself
4. Ship it and prove it

카드는 순번, 제목, 설명으로 구성된다.

### Career Path

- 배경색이 다른 sunken section
- 연도, 단계명, 직책/기관, 설명
- 데스크톱 5열
- 모바일 세로 흐름

### Outcome Highlights

- 큰 수치 4개
- 각 수치가 프로젝트 상세 페이지로 연결
- 대표 프로젝트 카드 4개
- 프로젝트 유형, 제목, 설명, 지표 2개, 상세 링크

### Toolkit and Education

- AI, Data, Cloud, Domain 네 그룹
- 학력 목록
- 텍스트 중심 2열 레이아웃

### Writing Preview

- 글 2개
- EN/KO 전환
- 전체 Writing 페이지 링크

### Contact CTA

- 대형 질문 문구
- Ask AI 또는 연락 CTA

## Template 2. Work List

### Header

- 작은 eyebrow `Work`
- 검정과 옅은 회색을 섞은 2행 제목
- 프로젝트 성과 수치 원칙 설명

### Filter

- pill 형태 segmented control
- 선택 항목은 흰색 pill
- 모바일에서는 가로 스크롤

### Project Grid

- 데스크톱 3열
- 태블릿 2열
- 모바일 1열
- 카드 배경은 muted surface
- 카드 안에서 성과 수치가 하단에 고정되는 구조

## Template 3. Project Detail

### Hero

1. `← All work`
2. 프로젝트 유형과 분야
3. 대형 프로젝트명
4. 한 줄 설명
5. 핵심 지표 3~4개

### Outcome Block

두 가지 변형이 있다.

- Before/After형: 밝은 Before 카드와 어두운 After 카드
- Outcomes형: 결과 지표 및 결과 문장 중심

### Detail Sections

- 데스크톱에서 좌측 고정 폭 라벨, 우측 본문
- 섹션 사이에 가는 구분선
- 문제와 접근 방식은 `01`, `02` 형식의 번호 목록
- Architecture가 있는 경우 단계형 흐름 다이어그램 사용
- Governance는 원칙이나 통제 항목 목록 사용
- Stack은 분야명과 기술 목록의 정의 리스트 사용

### Bottom Navigation

- Previous project
- Next project
- 공통 연락 CTA
- Footer

## Template 4. Resume

- 페이지 상단 제목과 Get in touch 버튼
- 내부 콘텐츠를 별도 흰색 문서 카드로 표현
- Summary
- Professional Experience
- Licenses & Certifications
- Languages & Tools
- Education
- 직책은 좌측, 기간은 우측 정렬
- 경력 설명은 bullet list
- 인쇄 문서를 웹 카드로 옮긴 형태

## Template 5. Writing

### Writing List

- 대형 2행 제목
- 대상 독자와 다국어 제공 설명
- 우측 EN/KO segmented control
- 글 목록은 이미지 없이 제목과 요약 중심
- 카테고리와 화살표를 우측에 배치

### Blog Detail

- `← Writing`
- EN/KO 전환
- 대형 제목
- category tag pills
- 약 `40rem` 폭의 단일 본문 칼럼
- H2, H3, 문단, bullet, numbered list 지원

## Template 6. Ask AI

- 일반 콘텐츠 페이지보다 앱 화면에 가까운 전체 높이 레이아웃
- 중앙에 질문형 제목과 설명
- 큰 textarea와 원형 전송 버튼
- 추천 질문 4개
- 답변 근거가 사이트 콘텐츠라는 안내
- 질문이 없는 초기 상태는 여백을 크게 사용
