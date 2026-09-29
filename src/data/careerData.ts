import type { CareerMetric, GrowthStep, Capability } from "@/types/portfolio";

export const personalInfoData = {
    name: "성찬홍",
    position: "Web Developer",
    company: "스카이즈코리아 개발팀",
    period: "2023.09 ~ 현재",
    introduction:
        "비즈니스가 돌아가는 방식을 이해하고, 앞으로 나아가는 데 필요한 도구를 만듭니다.",
    university: "동아대학교",
    degree: "전자공학과 학사",
    gpa: "GPA 3.9",
    email: "bkn367@naver.com",
    github: "https://github.com/DChanHong",
    blog: "https://velog.io/@hongchee/posts",
};

export const careerMetrics: CareerMetric[] = [
    {
        value: "약 80개",
        label: "공통 상담 위젯 적용 홈페이지",
        caption: "사이트별 고객 상담을 하나의 플랫폼으로 연결",
        href: "/project/realtime-support",
    },
    {
        value: "12만 건+",
        label: "실제 상담 유입",
        caption: "서비스 시작 후 1년간 · DB 집계 기준",
        href: "/project/realtime-support",
    },
    {
        value: "1,000명",
        label: "평가 데이터 저장 검증",
        caption: "합성 데이터 테스트 · 전원 DB 저장 확인",
        href: "/project/erp-groupware",
    },
    {
        value: "2개 프로젝트",
        label: "외주 관리자 영역 개발",
        caption: "기업·의료기관 홈페이지 관리자 담당",
        href: "/project/admin-platform",
    },
];

export const growthSteps: GrowthStep[] = [
    {
        year: "2023",
        title: "서비스 개발의 시작",
        description:
            "법률 도메인 사용자·관리자 화면과 Next.js API Routes를 함께 개발하며 화면 너머의 데이터 흐름을 익혔습니다.",
        keywords: ["Next.js", "API Routes", "PostgreSQL"],
    },
    {
        year: "2024",
        title: "CMS와 데이터 설계로 확장",
        description:
            "뉴스 플랫폼 CMS에서 관계형 데이터 구조, Prisma API, 이미지 처리와 콘텐츠 운영 기능을 연결했습니다.",
        keywords: ["Prisma", "CMS", "AWS S3"],
    },
    {
        year: "2025",
        title: "실시간 플랫폼의 메인 프론트엔드",
        description:
            "사용자 위젯과 관리자 콘솔을 개발하고 WebSocket 상태 동기화, 공통 패키지 배포, 운영 장애 대응을 수행했습니다.",
        keywords: ["WebSocket", "React Query", "Zustand"],
    },
    {
        year: "현재",
        title: "서비스 전체 흐름을 보는 개발자",
        description:
            "기존 Go 백엔드 구조를 분석해 운영 API, 파일 업로드, AI 응답 연동까지 필요한 범위로 역할을 확장했습니다.",
        keywords: ["Go 운영", "System Flow", "Troubleshooting"],
    },
];

export const capabilitiesData: Capability[] = [
    {
        title: "실시간 서비스와 상태 설계",
        description:
            "연결 여부만 확인하는 수준을 넘어 재연결, 상담방 참여, 읽지 않은 메시지와 목록 미리보기를 하나의 사용자 흐름으로 다룹니다.",
        evidence: [
            "WebSocket Connection / Room Life Cycle 분리",
            "React Query 서버 상태와 Zustand 실시간 상태의 역할 구분",
            "WebView foreground 복귀와 앱 Bridge 연동",
        ],
        technologies: ["WebSocket", "React Query", "Zustand"],
    },
    {
        title: "재사용 가능한 프론트엔드 구조",
        description:
            "여러 저장소에 반복되는 UI를 배포 가능한 제품 단위로 만들고, 사용하는 쪽의 설정과 의존성을 최소화합니다.",
        evidence: [
            "80여 개 Next.js 홈페이지 공통 위젯",
            "scoped npm package 배포",
            "Context API와 기능별 Custom Hook 분리",
        ],
        technologies: ["Next.js", "TypeScript", "npm Package"],
    },
    {
        title: "CMS와 운영 콘솔",
        description:
            "목록과 상세 화면뿐 아니라 검색, 필터, 권한, 파일, 상태 변경 등 운영자가 실제로 업무를 마칠 수 있는 도구를 만듭니다.",
        evidence: [
            "SNN 기사·노출·배너·권한 관리",
            "ERP 이의제기와 AICC 상담 화면",
            "실시간 상담 관리자 6개 주요 화면",
        ],
        technologies: ["CMS", "Backoffice", "TipTap", "CKEditor"],
    },
    {
        title: "API와 데이터 흐름의 이해",
        description:
            "프론트엔드 요구사항을 API 응답과 데이터 관계까지 추적하며, 필요한 범위의 서버 로직을 직접 구현하거나 개선합니다.",
        evidence: [
            "PostgreSQL·Prisma 관계 데이터와 Transaction",
            "Next.js API Routes 기반 운영 API 개발",
            "기존 Go 서버 엔드포인트와 AI 중간 연동 확장",
        ],
        technologies: ["PostgreSQL", "Prisma", "Node.js", "Go"],
    },
];
