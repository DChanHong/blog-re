# OG 태그 & Twitter Card

소셜 미디어(카카오, 슬랙, 트위터 등) 공유 시 미리보기를 제어하는 태그.

## Open Graph 필수 태그

```html
<meta property="og:type" content="{type}" />
<meta property="og:url" content="{canonicalUrl}" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:image" content="{imageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="{사이트명}" />
<meta property="og:locale" content="ko_KR" />
```

## og:type 값 기준

| 페이지 종류 | og:type |
|---|---|
| 홈, 일반 페이지, 목록 | `website` |
| 블로그 포스팅, 아티클 | `article` |
| 영상 페이지 | `video.other` |

> `og:type = website`를 모든 페이지에 고정하면 아티클 공유 시 미리보기가 부정확해진다.

## og:image 규격

| 항목 | 권장값 |
|---|---|
| 크기 | **1200 × 630px** |
| 비율 | 1.91:1 |
| 용량 | 8MB 이하 |
| 형식 | JPG, PNG, WebP |
| 최소 크기 | 600 × 315px (이하는 미리보기 생략될 수 있음) |

- 페이지별 고유 이미지가 없을 경우 사이트 대표 OG 이미지를 폴백으로 사용

```tsx
<meta property="og:image" content={image ? image : defaultOgImage} />
```

## article 타입 추가 태그

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2024-01-01T00:00:00+09:00" />
<meta property="article:modified_time" content="2024-01-15T00:00:00+09:00" />
<meta property="article:section" content="카테고리명" />
<meta property="article:tag" content="태그1" />
```

## og:updated_time

콘텐츠 최종 수정일 전달. 포스팅 페이지에서 권장.

```html
<meta property="og:updated_time" content="{modifiedTime}" />
<meta property="article:modified_time" content="{modifiedTime}" />
```

---

## Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{imageUrl}" />
<meta name="twitter:image:alt" content="{imageAlt}" />
```

### twitter:card 값 선택

| 값 | 설명 |
|---|---|
| `summary_large_image` | 가로형 큰 이미지 (대부분의 경우 사용) |
| `summary` | 작은 썸네일 |
| `player` | 동영상 플레이어 |

---

## 구현 예시 (Next.js Pages Router)

```tsx
// components/SeoHead.tsx
import Head from 'next/head'

interface SeoHeadProps {
  title: string
  description: string
  image: string
  imageAlt: string
  url: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

export default function SeoHead({
  title, description, image, imageAlt, url,
  type = 'website', publishedTime, modifiedTime
}: SeoHeadProps) {
  const defaultImage = `${process.env.NEXT_PUBLIC_SERVICE_DOMAIN}/og-default.jpg`

  return (
    <Head>
      {/* OG */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="ko_KR" />

      {/* article 전용 */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Head>
  )
}
```

---

## 체크리스트

- [ ] `og:type` 페이지 종류에 맞게 설정 (`website` / `article`)
- [ ] `og:image` 1200×630px, 8MB 이하
- [ ] 이미지 없을 때 기본 OG 이미지 폴백 설정
- [ ] `og:url`이 canonical URL과 일치
- [ ] `og:locale` 사이트 언어에 맞게 설정 (`ko_KR`, `en_US` 등)
- [ ] 포스팅 페이지에 `article:published_time`, `article:modified_time`
- [ ] Twitter Card `summary_large_image` 설정
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)로 검증
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)로 검증
