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
├── rules/ # 규칙/정책 문서 (mdc 파일 등)
├── public/ # 정적 자원
├── styles/ # 글로벌 스타일
├── next.config.mjs
└── tsconfig.json
```
