# 구조화 데이터 (JSON-LD)

Schema.org 기반 JSON-LD를 `<script type="application/ld+json">` 태그로 삽입.  
페이지 타입에 따라 적절한 스키마를 선택한다.

## 기본 구조

```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [ ...schemas ]
    })
  }}
/>
```

`@graph` 배열에 여러 스키마를 묶어 하나의 script 태그로 삽입한다.

---

## 페이지 타입별 스키마

### WebSite (홈/랜딩 페이지)

```json
{
  "@type": "WebSite",
  "@id": "https://example.com",
  "url": "https://example.com",
  "name": "사이트명",
  "description": "설명",
  "inLanguage": "ko-KR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": {
      "@type": "PropertyValueSpecification",
      "valueName": "search_term_string"
    }
  }
}
```

### WebPage (일반 페이지)

```json
{
  "@type": "WebPage",
  "@id": "https://example.com/page",
  "url": "https://example.com/page",
  "name": "페이지 제목",
  "description": "설명",
  "inLanguage": "ko-KR",
  "primaryImageOfPage": { "@id": "https://example.com/page#primaryimage" },
  "image": { "@id": "https://example.com/page#primaryimage" }
}
```

### Article (블로그/포스팅)

```json
{
  "@type": "Article",
  "@id": "https://example.com/post/1#article",
  "headline": "제목",
  "datePublished": "2024-01-01T00:00:00+09:00",
  "dateModified": "2024-01-15T00:00:00+09:00",
  "wordCount": 1200,
  "commentCount": 0,
  "thumbnailUrl": "https://cdn.example.com/image.jpg",
  "keywords": ["키워드1", "키워드2"],
  "articleSection": ["카테고리"],
  "inLanguage": "ko-KR"
}
```

### CollectionPage (목록 페이지)

```json
{
  "@type": "CollectionPage",
  "@id": "https://example.com/list",
  "url": "https://example.com/list",
  "name": "목록 페이지 제목",
  "description": "설명",
  "inLanguage": "ko-KR",
  "breadcrumb": { "@id": "https://example.com/list#breadcrumb" }
}
```

### FAQPage

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "질문 내용",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "답변 내용"
      }
    }
  ]
}
```

### VideoObject

```json
{
  "@type": "VideoObject",
  "name": "영상 제목",
  "description": "설명",
  "thumbnailUrl": "https://img.youtube.com/vi/{id}/maxresdefault.jpg",
  "uploadDate": "2024-01-01T00:00:00+09:00",
  "duration": "PT5M30S",
  "embedUrl": "https://www.youtube.com/embed/{id}",
  "contentUrl": "https://www.youtube.com/watch?v={id}"
}
```

### Organization (기업/브랜드)

```json
{
  "@type": "Organization",
  "name": "회사명",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "image": "https://example.com/og-image.jpg",
  "description": "회사 설명",
  "telephone": "+82-2-0000-0000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "도로명주소",
    "addressLocality": "구",
    "addressRegion": "시",
    "addressCountry": "KR",
    "postalCode": "우편번호"
  },
  "sameAs": [
    "https://blog.naver.com/example",
    "https://www.youtube.com/@example",
    "https://www.instagram.com/example"
  ]
}
```

### LegalService / LocalBusiness (지역 사업장)

```json
{
  "@type": "LegalService",
  "name": "지점명",
  "url": "https://example.com/map/branch",
  "telephone": "+82-2-0000-0000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "도로명 + 건물번호",
    "addressLocality": "구",
    "addressRegion": "시",
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "37.0000",
    "longitude": "127.0000"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ]
}
```

---

## BreadcrumbList

모든 페이지에 공통 삽입. URL 계층 구조를 반영.

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "카테고리", "item": "https://example.com/category" },
    { "@type": "ListItem", "position": 3, "name": "현재 페이지", "item": "https://example.com/category/detail" }
  ]
}
```

---

## ImageObject

OG 이미지를 구조화 데이터로도 등록.

```json
{
  "@type": "ImageObject",
  "@id": "https://example.com/page#primaryimage",
  "url": "https://cdn.example.com/image.jpg",
  "contentUrl": "https://cdn.example.com/image.jpg",
  "width": 1200,
  "height": 630,
  "caption": "이미지 설명",
  "inLanguage": "ko-KR"
}
```

---

## 텍스트 정제 (JSON-LD 삽입 전)

JSON-LD에 HTML 태그, 특수문자가 들어가면 파싱 오류 발생.

```typescript
const cleanText = (text: string): string => {
  const reg = /(<\/?[^<>]*>?|&lt;\/?[^&]*&gt;|[<>]|["']|\\n)/g
  return text
    .replace(reg, '')
    .replaceAll('&nbsp;', ' ')
    .replace(/\s{2,}/g, ' ')
}
```

---

## 체크리스트

- [ ] 홈에 `WebSite` + `SearchAction` 포함
- [ ] 모든 페이지에 `Organization` 포함
- [ ] 모든 페이지에 `BreadcrumbList` 포함
- [ ] 포스팅 페이지에 `Article` (datePublished, dateModified 포함)
- [ ] FAQ 섹션 있는 페이지에 `FAQPage`
- [ ] 영상 페이지에 `VideoObject` (duration ISO 8601 형식)
- [ ] 지역 사업장 페이지에 `LocalBusiness` / `LegalService`
- [ ] JSON-LD 텍스트에 HTML 태그 없음
- [ ] Google Rich Results Test로 검증
