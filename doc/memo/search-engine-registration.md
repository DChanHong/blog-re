# 검색엔진 등록 체크리스트

## 사이트 정보

- 사이트 URL: `https://blog.dev-hong.it.kr`
- 사이트맵 URL: `https://blog.dev-hong.it.kr/sitemap.xml`
- robots URL: `https://blog.dev-hong.it.kr/robots.txt`

## Google Search Console

1. Google Search Console에 접속한다.
2. 속성을 추가한다.
   - 추천: 도메인 속성 `dev-hong.it.kr`
   - 대안: URL 접두어 속성 `https://blog.dev-hong.it.kr`
3. 소유권을 확인한다.
   - 도메인 속성: DNS TXT 레코드 추가
   - URL 접두어 속성: HTML meta 태그 또는 HTML 파일 업로드
4. 사이트맵을 제출한다.
   - `https://blog.dev-hong.it.kr/sitemap.xml`
5. 주요 URL을 검사한다.
   - `https://blog.dev-hong.it.kr/`
   - `https://blog.dev-hong.it.kr/blog`
   - 대표 블로그 상세 페이지 1개
6. 검사한 URL에 대해 색인 생성을 요청한다.
7. 이후 상태를 확인한다.
   - 색인 상태
   - 페이지 오류
   - 검색 노출 및 클릭 데이터

## 네이버 서치어드바이저

1. 네이버 서치어드바이저에 접속한다.
2. 사이트를 추가한다.
   - `https://blog.dev-hong.it.kr`
3. 소유권을 확인한다.
   - Next.js/Vercel 환경에서는 HTML meta 태그 방식이 보통 가장 쉽다.
   - 도메인 DNS를 직접 관리하고 있다면 DNS TXT 레코드 방식도 가능하다.
4. 사이트맵을 제출한다.
   - `https://blog.dev-hong.it.kr/sitemap.xml`
5. robots.txt를 확인한다.
   - `https://blog.dev-hong.it.kr/robots.txt`
6. 주요 URL 수집을 요청한다.
   - 홈
   - 블로그 목록
   - 대표 블로그 상세 페이지
7. 이후 상태를 확인한다.
   - 수집 상태
   - 검색 노출 여부
   - 크롤링 오류

## 등록 후 확인할 것

- `robots.txt`가 공개 페이지 크롤링을 허용하는지 확인한다.
- `sitemap.xml`에 블로그 상세 URL들이 포함되어 있는지 확인한다.
- canonical URL이 `https://blog.dev-hong.it.kr` 기준으로 들어가는지 확인한다.
- 대표 블로그 상세 페이지를 Google Rich Results Test에 넣어 확인한다.
- 며칠 뒤 직접 검색해본다.
  - `site:blog.dev-hong.it.kr`
  - `site:blog.dev-hong.it.kr AI 에이전트`

## 메모

- Google Search Console과 네이버 서치어드바이저는 모두 무료다.
- 검색 노출은 즉시 반영되지 않는다.
- 새 도메인은 검색 결과에 나타나기까지 며칠 이상 걸릴 수 있다.
