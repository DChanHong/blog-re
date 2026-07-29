# robots.txt

크롤러의 접근 범위를 제어하는 파일. `public/robots.txt`에 위치.

## 기본 구조

```
User-agent: *
Allow: /

Disallow: /admin
Disallow: /login
Disallow: /mypage

Sitemap: https://example.com/sitemap.xml
```

## 규칙 작성 원칙

### 1. 구체적인 규칙이 일반 규칙보다 우선 (Googlebot 기준)

```
Disallow: /*?*        ← 쿼리 파라미터 전체 차단
Allow: /posts?page=   ← 페이지네이션만 허용
```

Googlebot은 더 구체적인 경로를 우선 적용한다.  
단, 일부 봇은 순서대로 처리하므로 `Allow`를 `Disallow` 앞에 쓰는 것도 안전하다.

### 2. 쿼리 파라미터 처리

```
# 모든 쿼리 파라미터 차단
Disallow: /*?*

# 페이지네이션만 예외 허용
Allow: /posts?page=
Allow: /category?page=
```

### 3. 0페이지 차단

```
# page=0은 빈 페이지 또는 1페이지 중복이므로 차단
Disallow: /posts?page=0
Disallow: /category?page=0
```

## 차단해야 할 경로 유형

```
# 인증/개인 정보
Disallow: /login
Disallow: /mypage
Disallow: /admin

# 개발/테스트
Disallow: /test
Disallow: /dev
Disallow: /staging

# 완료/리다이렉트 대상 레거시 경로
Disallow: /old-path
Disallow: /complete

# 중복 콘텐츠 유발
Disallow: /*?*
```

## 특정 봇 개별 제어

```
# Googlebot만 허용
User-agent: Googlebot
Allow: /

# 이미지 크롤러 허용
User-agent: Googlebot-Image
Allow: /images/

# 특정 봇 전체 차단
User-agent: BadBot
Disallow: /
```

## Next.js 이미지 최적화 경로 허용

```
# Next.js가 생성하는 최적화 이미지 경로 허용
Allow: /_next/image?url=*
```

## API 경로 처리

```
# API는 크롤러가 접근할 필요 없음 (일반적으로)
Disallow: /api/

# 단, 공개 데이터 API는 허용 가능
Allow: /api/sitemap
Allow: /api/feed
```

## 전체 예시

```
User-agent: *
Allow: /

# 크롤링 제외 경로
Disallow: /admin
Disallow: /login
Disallow: /mypage
Disallow: /test
Disallow: /complete

# 쿼리 파라미터 차단 (중복 페이지 방지)
Disallow: /*?*

# 페이지네이션 허용
Allow: /posts?page=
Allow: /category?page=
Allow: /search?page=

# 0페이지 차단
Disallow: /posts?page=0
Disallow: /category?page=0

# Next.js 이미지 최적화
Allow: /_next/image?url=*

# API
Allow: /api/
Allow: /robots.txt

# Sitemap
Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-posts.xml
```

## Next.js App Router 방식 (Route Handler)

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/mypage'],
      },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## 검증

- [Google robots.txt Tester](https://search.google.com/search-console/robots-testing-tool)에서 특정 URL이 허용/차단되는지 확인
- Google Search Console → 크롤링 → robots.txt 분석

## 체크리스트

- [ ] `public/robots.txt`에 위치
- [ ] 관리/로그인/개인정보 경로 `Disallow`
- [ ] 쿼리 파라미터 처리 (중복 콘텐츠 방지)
- [ ] `page=0` 차단
- [ ] `Sitemap:` 엔트리에 모든 sitemap 파일 등록
- [ ] 배포 후 `https://example.com/robots.txt`에서 직접 확인
- [ ] Google Search Console robots.txt 테스터로 검증
