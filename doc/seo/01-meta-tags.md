# 메타태그 기본기

## 필수 태그 목록

```html
<title>{title}</title>
<meta name="description" content="{description}" />
<link rel="canonical" href="{canonicalUrl}" />
<link rel="shortcut icon" href="/favicon.ico" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
```

## robots 값 기준

| 상황 | 값 |
|---|---|
| 인덱싱 허용 | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| 인덱싱 차단 | `noindex, nofollow` |

- 관리자 페이지, 로그인 페이지, 테스트 페이지 등은 `noindex, nofollow`
- `max-image-preview:large` — Google 이미지 검색 미리보기 최대화
- `max-snippet:-1` — 검색 결과 스니펫 길이 제한 없음
- `max-video-preview:-1` — 동영상 미리보기 제한 없음

## description 작성 규칙

- **권장 길이: 120~155자** (Google 표시 한계 ~155자)
- HTML 태그, 따옴표, 개행 문자 제거 후 삽입
- 중복 공백 제거

```typescript
const cleanDescription = (desc: string): string => {
  const reg = /<[^>]*>?|["']|\\n/g
  return desc
    .replace(reg, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('.', '. ')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 155)
}
```

## canonical URL 정규화

쿼리 파라미터를 제거하되, 페이지네이션(`?page=`)은 유지.

```typescript
const getCanonicalUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const page = urlObj.searchParams.get('page')
    urlObj.search = ''
    if (page) urlObj.searchParams.set('page', page)
    return urlObj.toString()
  } catch {
    return url
  }
}
```

## lang 속성

```tsx
// _document.tsx — SSR에서 html lang 동적 설정
<Html lang="ko">
```

```tsx
// _app.tsx — 클라이언트 사이드 보정
useEffect(() => {
  document.documentElement.lang = 'ko'
  document.documentElement.dir = 'ltr'
}, [])
```

## 기타 권장 태그

```html
<meta name="apple-mobile-web-app-title" content="{title}" />
<meta name="application-name" content="{사이트명}" />
```

## 체크리스트

- [ ] 모든 페이지에 `<title>`, `<description>`, `<canonical>` 존재
- [ ] description 155자 이내 + HTML 태그 없음
- [ ] canonical이 실제 접근 URL과 일치 (쿼리 파라미터 정규화)
- [ ] 관리/테스트 페이지에 `noindex` 적용
- [ ] `<html lang>` 속성 설정
