hong_blog/
├── README.md                # 프로젝트 소개 및 문서
├── eslint.config.mjs        # ESLint 설정
├── next-env.d.ts            # Next.js 타입 지원 자동 생성 파일
├── next.config.ts           # Next.js 설정 파일
├── package-lock.json        # npm 의존성 잠금 파일
├── package.json             # 프로젝트 의존성 및 스크립트 정의
├── postcss.config.mjs       # PostCSS 설정 (TailwindCSS 등)
├── public/                  # 정적 자원
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── rules/                   # 규칙/정책 문서 (sql, md 등)
│   └── velog.sql
│
├── src/                     # 소스 코드 루트
│   ├── app/                 # App Router 엔트리
│   │   ├── layout.tsx       # 전역 레이아웃
│   │   ├── page.tsx         # 홈 페이지
│   │   ├── users/           # 사용자 라우트
│   │   │   ├── page.tsx     # 서버 컴포넌트 (라우트 진입점)
│   │   │   └── ClientPage.tsx # 클라이언트 컴포넌트 시작점
│   │   └── posts/           # 게시물 라우트
│   │       ├── page.tsx
│   │       └── ClientPage.tsx
│   │
│   ├── lib/                 # 서버측 로직 (MVC: Model & Service)
│   │   ├── db/              # DB 클라이언트 (예: Supabase)
│   │   │   └── supabase.ts
│   │   ├── repositories/    # DB 접근 계층
│   │   ├── services/        # 비즈니스 로직 계층
│   │   └── utils/           # 공통 유틸
│   │
│   └── types/               # 공통 타입 정의
│
└── tsconfig.json            # TypeScript 설정
