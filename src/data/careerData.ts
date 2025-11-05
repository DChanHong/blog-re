import type { PersonalInfo } from "@/components/domain/career/PersonalInfoHeader";
import type { CareerSummaryItem } from "@/components/domain/career/CareerSummary";
import type { ProjectData } from "@/components/domain/career/ProjectTimeline";
import type { TechStackCategory } from "@/components/domain/career/TechStack";

// 개인 정보 데이터
export const personalInfoData: PersonalInfo = {
    name: "성찬홍",
    position: "프론트엔드 개발자",
    company: "로펌 개발자",
    period: "2023.09 ~ 현재",
    university: "동아대학교",
    phone: "010-5897-3405",
    email: "bkn367@naver.com",
    github: "https://github.com/DChanHong",
    blog: "https://velog.io/@hongchee",
};

// 경력 요약 데이터
export const careerSummaryData: CareerSummaryItem[] = [
    {
        id: "summary-1",
        content: "프론트엔드 전담 개발자로 실시간 채팅 서비스, 뉴스 플랫폼, 모바일 서비스 등 다양한 프로젝트에 참여",
        highlight: ["프론트엔드 전담 개발자"]
    },
    {
        id: "summary-2",
        content: "Next.js + TypeScript 기반 개발 경험 다수",
        highlight: []
    },
    {
        id: "summary-3",
        content: "WebSocket 실시간 통신, DB 설계, 인증·보안 처리, 외부 서비스 연동 경험 보유",
        highlight: ["WebSocket 실시간 통신, DB 설계, 인증·보안 처리, 외부 서비스 연동"]
    },
    {
        id: "summary-4",
        content: "다수의 자사 홈페이지(80여 개)에 공통 UI 컴포넌트를 배포·관리한 경험으로 확장성과 유지보수성에 강점",
        highlight: ["확장성과 유지보수성"]
    }
];

// 프로젝트 데이터
export const projectsData: ProjectData[] = [
    {
        title: "실시간 채팅 서비스",
        period: "2025.04 ~ 현재",
        role: "프론트엔드 개발 전담",
        description:
            "기존 채널톡 유료 서비스를 대체하고, 사내 요구사항에 맞춘 맞춤형 실시간 채팅 서비스를 구축. 80여 개 자사 홈페이지 전체에서 재사용 가능한 구조를 목표로 개발.",
        contributions: [
            "관리자 사이트 채팅창 개발: actions/fetchers 분리 구조 도입",
            "npm 패키지 모듈화로 80여 개 홈페이지에 배포 및 유지보수 자동화",
            "WebSocket 재연결 프로세스 설계 및 UX 개선",
        ],
        achievements: [
            "기존 30개 → 80여 개 전체 홈페이지로 채팅 기능 확장",
            "채널톡 유료 서비스 의존 제거로 연간 비용 절감",
            "WebSocket 안정성 확보 및 사용자 만족도 향상",
        ],
        techStack: ["Next.js", "TypeScript", "WebSocket", "Context API", "Zustand", "React Query"],
        status: "current",
    },
    {
        title: "SNN 뉴스 사이트",
        period: "2024.11 ~ 2025.03",
        role: "풀스택 개발 (DB 설계 + API + 프론트엔드)",
        description:
            "자사 뉴스 플랫폼 및 관리자 사이트 개발. 기획 요구사항을 분석하고, DB 설계와 API 설계를 주도적으로 수행.",
        contributions: [
            "카테고리별 테이블 분리 후 성능 이슈 발견, 테이블 통합 재설계로 최적화",
            "Prisma 기반 CRUD API 및 마이그레이션 관리",
            "관리자 페이지 CRUD 기능 및 사용자 페이지 뉴스 열람 기능 개발",
        ],
        achievements: [
            "DB 구조 의사결정 경험 확보 (분리 vs 통합)",
            "기획 → DB 설계 → API → UI까지 풀스택 개발 전 과정 수행",
            "관리자의 콘텐츠 등록/배포 프로세스 단축",
        ],
        techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Zustand", "React Query"],
        status: "completed",
    },
    {
        title: "로맨스 어플",
        period: "2023.10 ~ 2024.09 (2차에 걸쳐 진행)",
        role: "1차: 풀스택 개발 참여 / 2차: 프론트엔드 전담",
        description:
            "자체 로맨스 서비스 어플리케이션 개발. 신입 시절 첫 주요 프로젝트로, 새로운 기술 학습 및 서비스 적용 경험을 축적.",
        contributions: [
            "Firebase 푸시 알림, 카카오 알림톡, 토스 결제/환불 기능 등 외부 서비스 연동",
            "프론트·백엔드 분리 환경에서 API 연동 및 협업",
            "Next.js SSR 활용 로그인/인증 기능 개발 및 보안 강화",
        ],
        achievements: [
            "신입 첫 프로젝트로 빠른 학습·적응 능력 입증",
            "외부 서비스 연동 경험으로 문서 기반 학습/적용 역량 확보",
            "프론트·백엔드 협업 경험으로 API 설계·소통 능력 강화",
        ],
        techStack: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Firebase",
            "카카오 API",
            "Toss Payments",
            "Zustand",
            "React Query",
        ],
        status: "completed",
    },
];

// 기술 스택 데이터
export const techStackData: TechStackCategory[] = [
    {
        name: "Frontend",
        color: "text-blue-600",
        dotColor: "bg-blue-500",
        technologies: ["Next.js", "TypeScript", "React Query", "Zustand", "Context API"]
    },
    {
        name: "Backend",
        color: "text-green-600",
        dotColor: "bg-green-500",
        technologies: ["Next.js 서버리스 API", "Prisma"]
    },
    {
        name: "Database",
        color: "text-purple-600",
        dotColor: "bg-purple-500",
        technologies: ["PostgreSQL"]
    },
    {
        name: "Etc",
        color: "text-orange-600",
        dotColor: "bg-orange-500",
        technologies: [ "WebSocket", "npm 패키지 관리"]
    }
];
