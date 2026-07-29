# Sitemap

검색 엔진에 사이트 구조와 콘텐츠를 알리는 XML 파일.

## 파일 유형

| 파일 | 용도 |
|---|---|
| `sitemap.xml` | 동적 콘텐츠 (DB 기반) |
| `sitemap-common.xml` | 정적 페이지 (고정 URL) |
| `sitemap-rss.xml` | RSS 피드 (포스팅 목록) |
| `sitemap-video.xml` | 동영상 콘텐츠 |
| `sitemap-index.xml` | 위 파일들을 묶는 인덱스 |

## 기본 sitemap 형식

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### changefreq 기준

| 값 | 적용 대상 |
|---|---|
| `always` | 실시간 변경 콘텐츠 |
| `daily` | 매일 업데이트되는 페이지 |
| `weekly` | 포스팅, 목록 페이지 |
| `monthly` | 소개, 서비스 안내 |
| `yearly` | 거의 변경 없는 정적 페이지 |
| `never` | 아카이브 |

### priority 기준

| 값 | 적용 대상 |
|---|---|
| `1.0` | 홈 |
| `0.8` | 주요 섹션 |
| `0.6` | 일반 페이지 |
| `0.4` | 포스팅 상세 |
| `0.2` | 낮은 우선순위 |

## sitemap-index 형식

sitemap 파일이 여러 개일 때 묶어주는 인덱스 파일.  
`robots.txt`에는 각 파일 대신 이 인덱스 파일만 등록해도 된다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-common.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-posts.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
</sitemapindex>
```

## sitemap 제한

| 항목 | 제한 |
|---|---|
| 파일당 URL 수 | 50,000개 이하 |
| 파일 크기 | 50MB 이하 (압축 전) |
| sitemap-index URL 수 | 1,000개 이하 |

초과 시 sitemap을 분할하고 sitemap-index로 묶는다.

## Next.js에서 빌드 타임 생성 (스크립트 방식)

```javascript
// script/generate-sitemap.mjs
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://example.com'
const OUTPUT_PATH = path.resolve('./public/sitemap.xml')

async function generateSitemap() {
  // DB 또는 API에서 URL 목록 조회
  const posts = await fetchPostsFromDB()

  const urls = posts.map(post => `
  <url>
    <loc>${BASE_URL}/post/${post.id}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  fs.writeFileSync(OUTPUT_PATH, xml)
  console.log(`Sitemap generated: ${OUTPUT_PATH}`)
}

generateSitemap()
```

```json
// package.json
{
  "scripts": {
    "build": "node script/generate-sitemap.mjs && next build"
  }
}
```

## next-sitemap 라이브러리 사용 시

```bash
npm install next-sitemap
```

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://example.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/login', '/mypage'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://example.com/sitemap-posts.xml',
    ],
  },
}
```

```json
// package.json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

## Next.js 13+ App Router (Route Handler 방식)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPosts()

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    ...posts.map(post => ({
      url: `https://example.com/post/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  ]
}
```

## video sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://example.com/video/1</loc>
    <video:video>
      <video:thumbnail_loc>https://cdn.example.com/thumb.jpg</video:thumbnail_loc>
      <video:title>영상 제목</video:title>
      <video:description>영상 설명</video:description>
      <video:content_loc>https://www.youtube.com/watch?v=xxxxx</video:content_loc>
      <video:duration>330</video:duration>
      <video:publication_date>2024-01-01T00:00:00+09:00</video:publication_date>
    </video:video>
  </url>
</urlset>
```

## 체크리스트

- [ ] 정적 페이지 sitemap (`sitemap-common.xml`)
- [ ] 동적 콘텐츠 sitemap (DB/API 기반, 빌드 타임 생성)
- [ ] sitemap-index로 통합
- [ ] `robots.txt`에 sitemap URL 등록
- [ ] 파일당 50,000 URL 이하, 50MB 이하
- [ ] `lastmod` 정확한 날짜 기입
- [ ] Google Search Console에 sitemap 제출
- [ ] Disallow 경로의 URL은 sitemap에서 제외
