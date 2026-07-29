# SEO Process Agent

## Purpose

Apply SEO improvements to this Next.js App Router project in small, verifiable steps.

Use this agent when the user wants to improve metadata, Open Graph, Twitter Card, JSON-LD, sitemap, robots, or SEO validation for the blog and portfolio pages.

## Project Context

- Framework: Next.js App Router
- Base URL: `https://blog.chanhong.pro`
- Primary content:
  - Home: `/`
  - Blog list: `/blog`
  - Blog detail: `/blog/[slug]`
  - Career: `/career`
- Blog data source: Supabase `velog` table
- Blog detail fields:
  - `title`
  - `intro`
  - `img_src`
  - `created_at`
  - `inserted_at`
  - `detail_crawled_at`
  - `tags`
  - `slug`
  - `content_text`
  - `content_html`

## Source References

The source SEO notes live outside the repo:

```txt
/Users/hong/Desktop/seo-process/01-meta-tags.md
/Users/hong/Desktop/seo-process/02-json-ld.md
/Users/hong/Desktop/seo-process/03-og-twitter.md
/Users/hong/Desktop/seo-process/04-sitemap.md
/Users/hong/Desktop/seo-process/05-robots-txt.md
/Users/hong/Desktop/seo-process/06-seo-component-pattern.md
```

When applying SEO work, inspect these files first if more detail is needed.

## Step 1. SEO Utilities

Create shared SEO helpers before editing pages.

Recommended file:

```txt
src/lib/seo/
```

Suggested utilities:

- `cleanDescription(text)`:
  - Remove HTML tags.
  - Remove quotes and newlines.
  - Replace `&nbsp;`.
  - Collapse duplicate whitespace.
  - Limit to 155 characters.
- `cleanJsonLdText(text)`:
  - Remove HTML tags and unsafe characters for JSON-LD.
  - Collapse duplicate whitespace.
- `absoluteUrl(pathOrUrl)`:
  - Return input unchanged if already absolute.
  - Otherwise prefix with `metadataBase`.
- `getCanonicalUrl(url)`:
  - Remove query params.
  - Keep `page` when needed for paginated list pages.

Validation:

```bash
npx tsc --noEmit --pretty false
```

## Step 2. Base Metadata

Review and improve:

```txt
src/app/layout.tsx
src/app/page.tsx
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/app/career/page.tsx
```

Required metadata:

- `title`
- `description`
- `alternates.canonical`
- `robots`
- `openGraph`
- `twitter`

Recommended robots value for public pages:

```txt
index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1
```

Noindex candidates:

- API docs if not meant for public indexing.
- Test/dev/admin pages.

Note: deleted routes such as `/blog/test` should not be indexed.

## Step 3. Blog Detail Article Metadata

Focus on:

```txt
src/app/blog/[slug]/page.tsx
```

For each post:

- `title`: `post.title`
- `description`: cleaned `post.intro || post.content_text`
- canonical: `/blog/${post.slug}`
- OG type: `article`
- OG image: `post.img_src || /og_front.png`
- Twitter card: `summary_large_image`
- article published time: `post.created_at`
- article modified time: `post.detail_crawled_at || post.inserted_at || post.created_at`
- article tags: `post.tags`

Avoid:

- Raw HTML in descriptions.
- Descriptions longer than 155 characters.
- Relative OG image URLs when Next metadata expects absolute external preview URLs.

## Step 4. JSON-LD

Add JSON-LD using App Router components or small server components.

Recommended schemas:

- Home `/`:
  - `WebSite`
  - `Organization`
  - `BreadcrumbList`
- Blog list `/blog`:
  - `CollectionPage`
  - `Organization`
  - `BreadcrumbList`
- Blog detail `/blog/[slug]`:
  - `Article`
  - `ImageObject`
  - `Organization`
  - `BreadcrumbList`
- Career `/career`:
  - `WebPage`
  - `Organization`
  - `BreadcrumbList`

Use one JSON-LD script per page:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Validation:

- Inspect rendered HTML.
- Validate deployed pages with Google Rich Results Test.

## Step 5. Sitemap

Use App Router sitemap route:

```txt
src/app/sitemap.ts
```

Include:

- `/`
- `/blog`
- `/career`
- every `/blog/[slug]` row from Supabase

Suggested values:

- Home:
  - `priority: 1`
  - `changeFrequency: "monthly"`
- Blog list:
  - `priority: 0.8`
  - `changeFrequency: "weekly"`
- Career:
  - `priority: 0.8`
  - `changeFrequency: "monthly"`
- Blog detail:
  - `priority: 0.6`
  - `changeFrequency: "weekly"`
  - `lastModified: detail_crawled_at || inserted_at || created_at`

Validation:

```bash
curl -I "$BASE_URL/sitemap.xml"
curl "$BASE_URL/sitemap.xml"
```

## Step 6. Robots

Use App Router robots route:

```txt
src/app/robots.ts
```

Recommended rules:

- Allow public pages.
- Disallow API routes:
  - `/api/`
- Disallow dev/test/admin routes:
  - `/test`
  - `/admin`
  - `/login`
- Add sitemap:
  - `https://blog.chanhong.pro/sitemap.xml`

Validation:

```bash
curl "$BASE_URL/robots.txt"
```

## Step 7. Verification

Run local checks:

```bash
npx tsc --noEmit --pretty false
npm run dev
```

Check important routes:

```bash
curl -I "$BASE_URL/"
curl -I "$BASE_URL/blog"
curl -I "$BASE_URL/career"
curl -I "$BASE_URL/sitemap.xml"
curl -I "$BASE_URL/robots.txt"
```

Check a blog detail page:

```bash
curl -I "$BASE_URL/blog/{slug}"
```

Inspect metadata:

```bash
curl -s "$BASE_URL/blog/{slug}" | rg "canonical|og:title|og:type|twitter:card|application/ld\\+json"
```

Deployment checks:

- Google Rich Results Test
- Google Search Console sitemap submission
- Facebook Sharing Debugger
- Twitter Card Validator

## Recommended Implementation Order

1. Add SEO utilities.
2. Improve blog detail `generateMetadata`.
3. Add JSON-LD for blog detail.
4. Add sitemap.
5. Add robots.
6. Improve home/blog/career metadata.
7. Validate and commit.

## Commit Guidance

Prefer small commits:

```txt
feat: add seo utilities
feat: improve blog article metadata
feat: add sitemap and robots
feat: add json ld schemas
```

For broad one-pass cleanup:

```txt
feat: add seo metadata and indexing routes
```
