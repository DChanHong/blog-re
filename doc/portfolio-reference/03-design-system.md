# Design System

## Technology

- Next.js App Router
- Tailwind CSS `3.4.19`
- Inter variable font
- CSS custom properties 기반 light/dark theme

## Layout

| 항목 | 값 |
| --- | --- |
| 최대 콘텐츠 너비 | `72rem` |
| 모바일 nav 높이 | `57px` |
| 데스크톱 nav 높이 | `65px` |
| 기본 모바일 좌우 여백 | `24px` |
| 데스크톱 섹션 좌우 여백 | `40px` |
| 일반 섹션 세로 여백 | 모바일 `112px`, 데스크톱 `160px` |
| 본문 최대 너비 | 약 `40rem` |

## Color Tokens

### Light

| Token | Value | 용도 |
| --- | --- | --- |
| `--ink` | `#1d1d1f` | 제목과 핵심 텍스트 |
| `--ink-secondary` | `#45454a` | 보조 본문 |
| `--ink-tertiary` | `#6e6e73` | 설명, eyebrow |
| `--ink-quaternary` | `#8e8e93` | 약한 정보 |
| `--surface` | `#fdfdfc` | 기본 배경 |
| `--surface-raised` | `#ffffff` | 문서 카드 |
| `--surface-sunken` | `#f7f7f5` | 구분 섹션 |
| `--surface-muted` | `#f0f0ee` | 프로젝트 카드 |
| `--accent` | `#0066cc` | 링크와 강조 CTA |

### Dark

| Token | Value |
| --- | --- |
| `--ink` | `#f5f5f7` |
| `--ink-secondary` | `#d1d1d6` |
| `--ink-tertiary` | `#a1a1a6` |
| `--surface` | `#0a0a0b` |
| `--surface-raised` | `#161618` |
| `--surface-sunken` | `#111113` |
| `--surface-muted` | `#1c1c1f` |
| `--accent` | `#4da3ff` |

테마 버튼으로 전환하며 선택값은 `localStorage.theme`에 저장된다. 저장값이 없으면 시스템 테마를 따른다.

## Typography

| 역할 | 크기 |
| --- | --- |
| Display XL | `5.25rem`, line-height `0.98` |
| Display LG | `4rem`, line-height `1.02` |
| Display | `3rem`, line-height `1.06` |
| Display SM | `2.25rem`, line-height `1.14` |
| Title | `1.75rem` |
| Title SM | `1.3125rem` |
| Body LG | `1.0625rem` |
| Body | `0.9375rem` |
| Caption | `0.8125rem` |

제목은 `-0.02em`에서 `-0.04em` 사이의 음수 letter-spacing을 사용한다. 굵기는 대부분 `500` 또는 `600`이며, 본문은 `400`이다.

## Radius and Borders

| Token | Value |
| --- | --- |
| Small | `10px` |
| Medium | `14px` |
| Large | `20px` |
| XL card | `28px` |
| Pill | `9999px` |

테두리는 강한 선보다 `rgba` 기반의 매우 옅은 구분선을 사용한다.

## Motion

- 첫 화면 Hero: `fade-up 0.5s`
- 스크롤 진입 요소: opacity `0 → 1`, translateY `16px → 0`
- easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- 링크 화살표: hover 시 오른쪽으로 `2px` 이동
- 카드: hover 시 surface 색상 변경
- Ask AI 상태 점: ping animation
- `prefers-reduced-motion` 환경에서는 애니메이션을 사실상 비활성화

## Responsive Rules

주요 breakpoint는 `640px`, `768px`, `1024px`다.

### Under 400px

- 브랜드 이름을 숨기고 심볼만 유지

### Under 640px

- Hero 제목 축소
- 카드와 지표를 1열로 배치
- 프로젝트 필터를 가로 스크롤로 처리
- Ask AI 버튼 문구 축약
- 상세 페이지 label/content 2열을 세로로 전환

### 640px and Above

- 2열 카드 사용 가능
- 섹션 세로 여백 증가
- 브랜드 이름 노출

### 1024px and Above

- 업무 방식 4열
- 경력 타임라인 5열
- Work 목록 3열
- 핵심 지표 4열
- 최대 display 크기 적용

## Accessibility

- `Skip to content` 링크
- 테마 버튼의 `aria-label`
- 키보드 focus-visible outline
- semantic heading 구조
- `prefers-reduced-motion` 대응
- 아이콘의 장식용 `aria-hidden`
