# SEO 컴포넌트 패턴 (Next.js Pages Router)

페이지별 메타태그, OG 태그, JSON-LD를 하나의 컴포넌트로 통합 관리하는 패턴.

## 컴포넌트 설계 원칙

- 모든 SEO 관련 `<Head>` 태그는 한 컴포넌트에서 처리
- 페이지 타입(`pageType`)으로 JSON-LD 스키마 분기
- 텍스트는 삽입 전 정제 (HTML 태그, 특수문자 제거)
- canonical URL은 컴포넌트 내에서 정규화

## 기본 구조

```tsx
// components/SeoHead.tsx
import Head from 'next/head'

export enum PageType {
  WEBSITE = 'WebSite',
  WEBPAGE = 'WebPage',
  ARTICLE = 'Article',
  COLLECTION = 'CollectionPage',
  FAQ = 'FAQPage',
  VIDEO = 'VideoObject',
}

interface SeoHeadProps {
  title: string
  description: string
  image: string
  imageAlt: string
  url: string
  canonicalUrl?: string
  robots?: boolean          // true = index, false = noindex
  pageType: PageType
  // Article 전용
  articleCreateDate?: string
  articleModifyDate?: string
  // FAQ 전용
  faqList?: { question: string; answer: string }[]
  // Video 전용
  youtubeId?: string
  duration?: string
}

export default function SeoHead(props: SeoHeadProps) {
  const { title, description, image, imageAlt, url, canonicalUrl, robots = true, pageType } = props

  const canonical = getCanonicalUrl(canonicalUrl ?? url)
  const cleanDesc = cleanDescription(description)
  const jsonLd = { '@context': 'https://schema.org', '@graph': buildJsonLd(props) }
  const defaultImage = `${process.env.NEXT_PUBLIC_SERVICE_DOMAIN}/og-default.jpg`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={cleanDesc} key="description" />
      <link rel="canonical" href={canonical} key="canonical" />
      <meta
        name="robots"
        content={robots
          ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          : 'noindex, nofollow'
        }
        key="robots"
      />

      {/* OG */}
      <meta property="og:type" content={pageType === PageType.ARTICLE ? 'article' : 'website'} key="og:type" />
      <meta property="og:url" content={canonical} key="og:url" />
      <meta property="og:title" content={title} key="og:title" />
      <meta property="og:description" content={cleanDesc} key="og:description" />
      <meta property="og:image" content={image || defaultImage} key="og:image" />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta property="og:locale" content="ko_KR" key="og:locale" />

      {/* Article 전용 */}
      {props.articleCreateDate && (
        <meta property="article:published_time" content={props.articleCreateDate} key="article:published_time" />
      )}
      {props.articleModifyDate && (
        <meta property="article:modified_time" content={props.articleModifyDate} key="article:modified_time" />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={title} key="twitter:title" />
      <meta name="twitter:description" content={cleanDesc} key="twitter:description" />
      <meta name="twitter:image" content={image || defaultImage} key="twitter:image" />
      <meta name="twitter:image:alt" content={imageAlt} key="twitter:image:alt" />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="jsonld"
      />
    </Head>
  )
}
```

## 유틸 함수

```typescript
// canonical 정규화: ?page= 외 쿼리 제거
function getCanonicalUrl(url: string): string {
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

// description 정제 + 155자 절삭
function cleanDescription(desc: string): string {
  const reg = /<[^>]*>?|["']|\\n/g
  return desc
    .replace(reg, '')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('.', '. ')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 155)
}

// JSON-LD 텍스트 정제
function cleanText(text: string): string {
  const reg = /(<\/?[^<>]*>?|&lt;\/?[^&]*&gt;|[<>]|["']|\\n)/g
  return text
    .replace(reg, '')
    .replaceAll('&nbsp;', ' ')
    .replace(/\s{2,}/g, ' ')
}
```

## JSON-LD 빌더

```typescript
function buildJsonLd(props: SeoHeadProps): object[] {
  const schemas: object[] = [
    buildOrganization(),
    buildBreadcrumb(props.title, props.url),
  ]

  switch (props.pageType) {
    case PageType.WEBSITE:
      schemas.unshift(buildWebSite(props))
      break
    case PageType.WEBPAGE:
      schemas.unshift(buildWebPage(props))
      break
    case PageType.ARTICLE:
      schemas.unshift(buildArticle(props))
      break
    case PageType.COLLECTION:
      schemas.unshift(buildCollectionPage(props))
      break
    case PageType.FAQ:
      schemas.push(buildFAQ(props))
      break
    case PageType.VIDEO:
      schemas.push(buildVideo(props))
      break
  }

  return schemas.flat()
}
```

## 사용 예시

```tsx
// pages/index.tsx — 홈 페이지
<SeoHead
  pageType={PageType.WEBSITE}
  title="사이트명 | 슬로건"
  description="사이트 설명 155자 이내"
  image="https://cdn.example.com/og-home.jpg"
  imageAlt="홈 대표 이미지"
  url={`${process.env.NEXT_PUBLIC_SERVICE_DOMAIN}/`}
  robots={true}
/>

// pages/posts/[id].tsx — 포스팅 상세
<SeoHead
  pageType={PageType.ARTICLE}
  title={post.title}
  description={post.summary}
  image={post.thumbnail}
  imageAlt={post.title}
  url={`${process.env.NEXT_PUBLIC_SERVICE_DOMAIN}/posts/${post.id}`}
  robots={true}
  articleCreateDate={post.createdAt}
  articleModifyDate={post.updatedAt}
/>

// pages/login.tsx — 로그인 (인덱싱 차단)
<SeoHead
  pageType={PageType.WEBPAGE}
  title="로그인"
  description="로그인 페이지"
  image=""
  imageAlt=""
  url={`${process.env.NEXT_PUBLIC_SERVICE_DOMAIN}/login`}
  robots={false}
/>
```

## seoRoutes — 브레드크럼용 네비게이션 정의

```typescript
// routes/seoRoutes.ts
interface IRoute {
  path: string
  name: string
  routes?: IRoute[]
}

const routes: IRoute[] = [
  {
    path: '/posts',
    name: '포스팅',
    routes: [
      { path: '/posts', name: '전체 포스팅' },
      { path: '/posts/category', name: '카테고리' },
    ]
  },
  // ...
]

export default routes
```

## App Router 방식 (Next.js 13+)

```typescript
// app/posts/[id]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetchPost(params.id)

  return {
    title: post.title,
    description: post.summary.slice(0, 155),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary.slice(0, 155),
      images: [{ url: post.thumbnail, width: 1200, height: 630 }],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}
```

## 체크리스트

- [ ] 모든 페이지에서 `SeoHead` 컴포넌트 사용
- [ ] `pageType` 정확히 설정
- [ ] `robots` prop — 관리/로그인 페이지는 `false`
- [ ] `url`에 절대 경로 사용 (env variable 기반)
- [ ] description 155자 이내
- [ ] 이미지 없을 때 기본 OG 이미지 폴백
- [ ] `key` prop 지정 (중복 태그 방지)
