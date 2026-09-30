# Implementation Notes

## Recommended Information Architecture

현재 블로그를 참고 사이트 구조로 개편할 경우 다음 라우트 구성이 적합하다.

```txt
/
/work
/work/[slug]
/writing
/blog/[slug]
/resume 또는 /career
/ask
```

기존 블로그의 `/career`를 유지해야 한다면 내비게이션 표시명만 `Resume` 또는 `Career`로 결정하고 내부 컴포넌트는 동일한 이력서 템플릿을 사용할 수 있다.

## Recommended Shared Components

```txt
SiteHeader
SiteFooter
ThemeToggle
SectionHeading
PrimaryButton
TextLink
SegmentedControl
MetricItem
ProjectCard
ProjectMetrics
BeforeAfterPanel
CaseStudySection
ArchitectureFlow
StackList
LanguageToggle
ArticleListItem
ContactCTA
```

## Recommended Data Models

### Project

```ts
type Project = {
  slug: string;
  category: "client" | "independent" | "purpose";
  domain: string;
  title: string;
  summary: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
  outcomeMode: "before-after" | "outcomes";
  before?: Array<DetailItem>;
  after?: Array<DetailItem>;
  outcomes?: Array<DetailItem>;
  context: RichContent;
  problems: Array<DetailItem>;
  build: RichContent;
  approach: Array<DetailItem>;
  architecture?: ArchitectureStep[];
  governance?: Array<DetailItem>;
  stack: Array<{
    label: string;
    values: string[];
  }>;
};
```

### Article

```ts
type Article = {
  slug: string;
  locale: "ko" | "en";
  title: string;
  summary: string;
  categories: string[];
  content: RichContent;
  publishedAt?: string;
  updatedAt?: string;
};
```

## Recommended Build Order

1. 글로벌 색상 및 typography token 정의
2. SiteHeader, SiteFooter, ThemeToggle 구현
3. SectionHeading, MetricItem, 카드 공통 컴포넌트 구현
4. Home 구조 변경
5. Work 목록 및 프로젝트 데이터 모델 구현
6. Project detail 템플릿 구현
7. Writing 목록과 Blog detail 정리
8. Resume/Career 템플릿 구현
9. Ask AI 화면 및 서버 기능 연결
10. 모바일, 접근성, SEO 검증

## Content Mapping Questions

구현 전에 다음 내용을 결정해야 한다.

- Home의 가장 큰 한 문장
- 대표 직무 또는 정체성 문구
- 공개할 프로젝트와 비공개 처리할 프로젝트
- 각 프로젝트에서 보여줄 실제 성과 수치
- Career와 Resume 중 내비게이션 명칭
- 한국어 우선인지 영어 우선인지
- 블로그 글에 EN/KO 전환을 제공할지
- Ask AI를 첫 버전에 포함할지
- 이메일, GitHub, LinkedIn 등 외부 링크

## Design Adaptation Rules

참고 사이트의 구조와 리듬은 활용하되 다음 항목은 현재 블로그에 맞게 변경한다.

- 이름과 로고
- 직무 및 소개 문구
- 프로젝트명과 성과 수치
- 경력 타임라인
- 기술 스택
- CTA와 외부 링크
- 색상 강조점

프로젝트 카드, 큰 제목, 넓은 여백, 회색 surface 계층, 텍스트 중심 구성은 유지할 수 있다.

## Validation Checklist

### Desktop

- 1024px 이상에서 Home 카드 열 수 확인
- Work 3열 grid 확인
- 프로젝트 지표 4열 확인
- 상세 본문의 label/content 정렬 확인
- Resume 기간 우측 정렬 확인

### Mobile

- 390px에서 horizontal page overflow가 없는지 확인
- 브랜드 이름이 숨겨지는지 확인
- 내비게이션과 Ask 버튼이 한 줄에 들어가는지 확인
- Work 필터만 가로 스크롤되는지 확인
- 카드와 프로젝트 지표가 1열인지 확인
- Before/After가 세로로 쌓이는지 확인

### Interaction

- 테마 설정이 새로고침 후 유지되는지 확인
- 시스템 테마 fallback 확인
- Work 필터 선택 상태와 결과 확인
- 언어 전환 시 제목과 본문이 함께 변경되는지 확인
- Ask 입력이 비어 있을 때 submit 비활성화 확인
- 키보드 focus 이동 확인

### SEO

- 페이지별 title과 description
- canonical URL
- Open Graph와 Twitter metadata
- Person, WebSite, Article JSON-LD
- sitemap과 robots
- 프로젝트 및 블로그 상세 동적 metadata

## Source Caveat

이 문서는 `2026-09-28`에 공개된 화면과 정적 자산을 기준으로 작성했다. 참고 사이트가 변경될 수 있으므로 실제 구현 직전에 주요 화면과 디자인 토큰을 한 번 더 확인하는 것이 좋다.
