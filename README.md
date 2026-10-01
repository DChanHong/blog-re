나의 블로그

```text
hong_blog/
├── app/ # App Router 엔트리
│ ├── layout.tsx # 전역 레이아웃
│ ├── page.tsx # 홈
│ ├── users/
│ │ ├── page.tsx # 서버 컴포넌트 (라우트 진입점)
│ │ └── ClientPage.tsx # 클라 컴포넌트 시작점
│ └── posts/
│   ├── page.tsx
│   └── ClientPage.tsx
│
├── lib/ # 서버측 로직 (MVC: Model & Service)
│ ├── db/ # Supabase client
│ │ └── supabase.ts
│ ├── repositories/ # DB 접근 계층
│ ├── services/ # 비즈니스 로직 계층
│ └── utils/ # 공통 유틸
│
├── fetchers/ # 클라 API 요청 (axios/fetch)
├── actions/ # React Query / Server Actions
├── types/ # 공통 타입 정의
│
├── components/ # UI & Domain 컴포넌트
│ ├── ui/ # Atomic 단위 (Button, Input 등)
│ ├── domain/ # 도메인 단위 (user, post 등)
│ ├── layout/ # Header, Footer 등
│ └── templates/ # 페이지 뼈대
│
├── migrations/ # Supabase 테이블 스키마 SQL
├── public/ # 정적 자원
├── styles/ # 글로벌 스타일
├── next.config.mjs
└── tsconfig.json
```

## Velog 전체 재수집

공개 크롤링 API는 제거되어 로컬에서 실행합니다. `.env`에 블로그 URL과 Supabase URL/service role key가 필요합니다.

```bash
# 전체 목록·본문 수집 및 검증 (DB 변경 없음)
node --env-file=.env scripts/refresh-velog.mjs
# 백업 후 기존 글 갱신과 새 글 추가
node --env-file=.env scripts/refresh-velog.mjs --apply
```

백업·수집 결과·보고서는 `/private/tmp/blog-refresh`에 저장합니다 (`BLOG_CRAWL_OUTPUT`으로 변경 가능). 본문 수집 실패 시 DB를 변경하지 않습니다. DB 쓰기는 행별 처리되므로 저장 도중 실패했다면 백업과 DB 상태를 확인하고 재실행하세요. 동일 원문의 기존 행을 갱신하므로 재실행으로 새 글이 중복 추가되지 않습니다. 주소가 바뀐 글은 제목이 정확히 하나의 수집 글과 일치하는 경우 기존 slug를 보존하고 최신 본문·원문 주소를 연결합니다. 따라서 기존에 중복된 목록 행은 삭제되지 않습니다.
