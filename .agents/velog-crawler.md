# Velog Crawler Agent

## Purpose

Keep the local blog database in sync with Velog.

Use this agent when the user wants to run blog crawling, backfill missing detail content, or refresh already-crawled posts after editing posts on Velog.

## Prerequisites

- Run from the project root.
- `.env` must include:
  - `NEXT_PUBLIC_BLOG_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Supabase table `velog` must include:
  - `slug`
  - `content_html`
  - `content_text`
  - `source_url`
  - `detail_crawled_at`
  - `detail_crawl_error`

## Start Local API Server

Start the local Next.js server:

```bash
npm run dev
```

Use the port printed by Next.js. If port `3000` is occupied, Next.js may use `3001`, `3002`, or another available port.

Set a local variable in your shell for convenience:

```bash
BASE_URL="http://localhost:3000"
```

If Next.js selected another port:

```bash
BASE_URL="http://localhost:3002"
```

## Crawl New Velog List Items

Use this when new posts may have been added to Velog:

```bash
curl "$BASE_URL/api/velog/crawl"
```

This does:

- Crawl the Velog list page from `NEXT_PUBLIC_BLOG_URL`.
- Insert newly discovered rows.
- Backfill detail content for a limited number of rows whose `content_html` is empty.

Optional:

```bash
curl "$BASE_URL/api/velog/crawl?expected=100&detailLimit=30"
```

## Backfill Missing Detail Content

Use this after adding the detail columns or when some rows still have empty `content_html`.

```bash
curl "$BASE_URL/api/velog/crawl?backfill=detail&limit=30"
```

Repeat until the response has:

```json
{
  "scanned": 0,
  "updated": 0,
  "failed": 0
}
```

Expected successful batch shape:

```json
{
  "scanned": 30,
  "updated": 30,
  "failed": 0
}
```

## Refresh Edited Velog Posts

Use this when existing Velog posts were edited, such as typo fixes or content changes.

```bash
curl "$BASE_URL/api/velog/crawl?refresh=detail&limit=30"
```

This does:

- Re-crawl existing detail pages.
- Compare newly crawled `contentText` with stored `content_text`.
- Ignore whitespace-only differences.
- Update `content_html`, `content_text`, `slug`, `source_url`, and `detail_crawled_at` only when text changed.
- Store failures in `detail_crawl_error`.

Expected response shape:

```json
{
  "scanned": 30,
  "updated": 1,
  "unchanged": 29,
  "failed": 0
}
```

## Recommended Local Update Routine

Run this after posting or editing Velog articles:

```bash
curl "$BASE_URL/api/velog/crawl?detailLimit=30"
curl "$BASE_URL/api/velog/crawl?backfill=detail&limit=30"
curl "$BASE_URL/api/velog/crawl?refresh=detail&limit=30"
```

If the backfill response has `scanned` greater than `0`, repeat the backfill command until `scanned` becomes `0`.

## Verify

Check the blog list:

```bash
curl -I "$BASE_URL/blog"
```

Check an internal detail page using a stored `slug`:

```bash
curl -I "$BASE_URL/blog/{slug}"
```

Expected HTTP status:

- `/blog`: `200`
- `/blog/{slug}` for existing posts: `200`
- `/blog/{missing-slug}`: `404`

## Current Matching Logic

New list rows are considered duplicates by:

```txt
title + detail_link
```

Detail refresh compares:

```txt
stored content_text
vs
newly crawled contentText
```

Whitespace-only differences are ignored.

## Notes

- `detail_link` is the source URL used for detail crawling.
- `slug` is derived from the last path segment of the Velog URL.
- Card links use `/blog/[slug]` when `slug` exists.
- If `slug` is missing, card links fall back to the original Velog URL.
- Keep `limit` around `10` to `30` to avoid long local runs and reduce pressure on Velog.
