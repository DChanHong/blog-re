import type { CareerProject } from "@/types/portfolio";

export const projectsData: CareerProject[] = [
    {
        id: "realtime-support",
        title: "실시간 상담 위젯 및 관리자 운영 콘솔",
        subtitle: "80여 개 홈페이지와 ERP를 연결한 사내 상담 플랫폼",
        period: "2025.04 ~ 현재",
        role: "Main Frontend Developer → Go Backend 운영·확장",
        status: "운영 중",
        featured: true,
        summary:
            "외부 채팅 SaaS 의존도를 낮추고 내부 상담 프로세스에 맞추기 위해, 고객용 공통 채팅 위젯과 ERP 관리자 콘솔을 구축했습니다.",
        background:
            "기존 채널톡은 빠른 도입에는 유리했지만 비용, 기능 확장, ERP 연계에 제약이 있었습니다. 단순 UI 복제가 아니라 여러 홈페이지에서 재사용할 수 있고 상담 운영 흐름과 결합되는 자체 플랫폼이 필요했습니다.",
        metrics: [
            { value: "80여 개", label: "적용 대상 홈페이지" },
            { value: "6,455건+", label: "2025.12 기준 상담" },
            { value: "58개+", label: "외부 API 연동 함수" },
            { value: "43개", label: "관리자 UI 컴포넌트" },
        ],
        responsibilities: [
            "고객 채팅 위젯과 ERP 상담 관리자 주요 화면 설계·개발",
            "메시지, 상담방, unread count, preview 등 실시간 UI 동기화",
            "scoped npm package 형태의 공통 위젯 분리 및 배포",
            "Presigned URL 기반 파일 업로드와 썸네일 처리 상태 UX 구현",
            "모바일 WebView 생명주기에 대응하는 앱 Bridge 기반 재연결 흐름 구성",
            "기존 Go 서버의 운영 API와 이벤트 응답, AI API 중간 연동 확장",
        ],
        architecture: [
            "80여 개 고객 홈페이지 · 공통 npm 채팅 위젯",
            "REST API + WebSocket 실시간 통신",
            "Go Backend · WebSocket Server · AI API",
            "ERP 상담 관리자 운영 콘솔",
        ],
        challenges: [
            {
                title: "연결과 상담방 생명주기 분리",
                problem:
                    "절전 모드, 브라우저 포그라운드 복귀, 모바일 파일 선택 과정에서 연결이 종료되고 상담방 상태가 복구되지 않았습니다.",
                action: "Connection Life Cycle과 Room Life Cycle을 분리하고 비정상 종료 재시도, 소켓 교체, 현재 상담방 join 재전송을 구현했습니다.",
                result: "새로고침 없이 연결과 상담방 상태를 복구하고 사용자가 연결 상태를 인지할 수 있는 UX를 마련했습니다.",
            },
            {
                title: "서버 상태와 실시간 UI 상태의 경계",
                problem:
                    "REST 조회 결과와 WebSocket 이벤트를 한 저장소에서 다루면 캐시와 즉시 반영 상태의 책임이 불명확해졌습니다.",
                action: "조회·mutation은 React Query, 메시지·상담방 목록·미리보기처럼 즉시 반영할 상태는 Zustand로 분리했습니다.",
                result: "서버 데이터 캐시와 이벤트 기반 UI 업데이트의 역할이 명확해지고 상담방 전환 시 동기화 흐름을 단순화했습니다.",
            },
            {
                title: "다수 홈페이지의 배포 일관성",
                problem:
                    "사이트마다 위젯 코드를 복사하면 기능 추가와 장애 수정이 각 저장소에 흩어지는 문제가 있었습니다.",
                action: "외부에는 최소 설정만 props로 노출하고 내부 API·Socket·사용자 상태는 Context와 Hook으로 감싼 scoped npm package를 만들었습니다.",
                result: "하나의 패키지 버전으로 약 80개 Next.js 홈페이지의 공통 기능을 관리할 수 있는 기반을 구축했습니다.",
            },
        ],
        achievements: [
            "일부 사이트에 한정됐던 상담 접점을 약 80개 홈페이지로 확장",
            "외부 채팅 SaaS 의존도를 낮추고 사내 업무 흐름에 맞춘 기능 확장 기반 확보",
            "고객 위젯, 관리자 콘솔, 파일 처리, AI 답변을 하나의 상담 흐름으로 연결",
            "실제 운영 이슈를 바탕으로 데스크톱과 WebView의 재연결 안정성 개선",
        ],
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "WebSocket",
            "React Query",
            "Zustand",
            "Context API",
            "TipTap",
            "AWS S3",
            "Go",
        ],
        retrospective:
            "초기에는 실시간 메시지 구현에 집중했지만 운영 단계에서 연결 복구가 더 중요한 문제임을 배웠습니다. 다시 설계한다면 WebSocket 연결, Room 참여, 모바일 생명주기, 복구 UX를 초기 스펙에 먼저 포함할 것입니다.",
        scopeNote:
            "Go 백엔드와 WebSocket 서버를 처음부터 구축한 것은 아닙니다. 기존 구조를 분석한 뒤 신규 엔드포인트, 운영 API, 파일 업로드와 AI 연동에 필요한 범위를 수정·확장했습니다.",
    },
    {
        id: "snn-cms",
        title: "SNN 뉴스 플랫폼 관리자 CMS",
        subtitle: "기사 작성부터 메인 노출까지 연결한 콘텐츠 운영 시스템",
        period: "2024.11 ~ 2025.03",
        role: "Frontend Developer / API Developer",
        status: "완료",
        featured: true,
        summary:
            "기사, 기자, 카테고리, 배너, 검색 키워드와 관리자 권한을 한곳에서 관리할 수 있는 뉴스 플랫폼 CMS를 개발했습니다.",
        background:
            "운영자가 개발자의 도움 없이 기사 콘텐츠와 서비스 주요 노출 영역을 관리할 수 있어야 했습니다. 기획서를 바탕으로 데이터 관계를 정의하고 관리자 화면과 API를 함께 구현했습니다.",
        metrics: [
            { value: "End-to-End", label: "DB · API · UI 연결" },
            { value: "Transaction", label: "관계 데이터 정합성" },
            { value: "WebP", label: "이미지 최적화" },
        ],
        responsibilities: [
            "기사, 카테고리, 기자, 첨부파일, 권한 중심의 PostgreSQL 관계 구조 설계·개선",
            "Prisma 기반 기사 CRUD, relation 조회, soft delete와 관리자 API 개발",
            "CKEditor 기사 작성, 기자·관련 기사·태그·썸네일·예약 발행 기능 구현",
            "메인 뉴스 노출, 배너, 검색 키워드 정렬, 관리자 권한 관리 개발",
            "sharp WebP 변환과 AWS S3 이미지 업로드 흐름 구성",
        ],
        architecture: [
            "관리자 CMS · CKEditor 콘텐츠 작성",
            "Next.js API · Prisma Transaction",
            "PostgreSQL 관계형 데이터",
            "AWS S3 · sharp 이미지 처리",
            "뉴스 사용자 서비스 노출",
        ],
        challenges: [
            {
                title: "콘텐츠 관계 데이터 정합성",
                problem:
                    "기사 저장 시 본문뿐 아니라 복수 기자, 관련 기사, 태그와 첨부파일 정보가 함께 변경되어 부분 실패 위험이 있었습니다.",
                action: "Prisma Transaction으로 기사와 관계 데이터를 하나의 저장 단위로 묶고 수정·삭제 흐름을 정리했습니다.",
                result: "복합 콘텐츠 저장 과정의 데이터 불일치 가능성을 줄이고 API 처리 기준을 명확히 했습니다.",
            },
            {
                title: "원본 품질과 렌더링 성능의 균형",
                problem:
                    "기사 이미지의 용도와 중요도가 다른데 동일한 최적화 규칙을 적용하면 품질 저하 또는 불필요한 용량이 발생했습니다.",
                action: "sharp 기반 WebP 변환과 별도 썸네일 등록 구조를 적용하고 이미지 중요도에 따라 처리 방식을 구분했습니다.",
                result: "콘텐츠 품질을 유지하면서 사용자 페이지에서 활용하기 적합한 이미지 제공 흐름을 구성했습니다.",
            },
        ],
        achievements: [
            "기획 요구사항을 DB 구조, API, 관리자 UI까지 연결해 전체 개발 흐름 수행",
            "운영자가 기사와 주요 노출 영역을 직접 관리할 수 있는 CMS 환경 구축",
            "관계 데이터 Transaction과 이미지 처리 기준으로 콘텐츠 운영 안정성 개선",
        ],
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Prisma",
            "CKEditor",
            "AWS S3",
            "sharp",
            "Vercel",
        ],
        retrospective:
            "초기 데이터 구조는 화면 단위 요구사항만으로 판단하기보다 검색, 노출, 운영 수정까지 포함한 전체 사용 흐름을 먼저 검토해야 한다는 점을 배웠습니다.",
    },
    {
        id: "erp-groupware",
        title: "사내 ERP / 그룹웨어",
        subtitle: "내부 사용자의 업무 요청을 빠르게 제품 기능으로 전환",
        period: "재직 기간 중 상시",
        role: "Frontend Developer / Web Developer",
        status: "운영 중",
        featured: false,
        summary:
            "사내 임직원이 사용하는 업무 시스템에서 신규 페이지, 기존 기능 개선, Next.js API Routes 기반 API를 함께 개발했습니다.",
        background:
            "업무 시스템은 새로운 아키텍처보다 기존 구조를 빠르게 파악하고 실제 사용자의 요청과 운영 이슈를 안정적으로 반영하는 것이 중요했습니다.",
        metrics: [
            { value: "13개", label: "이의제기 REST API" },
            { value: "3단계", label: "업무 상태 전이" },
            { value: "상시", label: "운영 요청 대응" },
        ],
        responsibilities: [
            "WAITING → RESPONDING → COMPLETED 상태 기반 인사평가 이의제기 기능 개발",
            "관리자·구성원 화면, 메시지 타임라인, 파일 첨부와 13개 API 구현",
            "드래그 앤 드롭 사이드바 순서 개인화와 Transaction 기반 저장",
            "상담 목록, AI 요약, 메모, 통화 이력, 담당자 배정을 포함한 AICC 화면 개발",
            "Zod 입력 검증과 EC2 UTC 환경을 고려한 KST 날짜 처리",
        ],
        challenges: [],
        achievements: [
            "화면 요구사항부터 데이터와 API까지 한 흐름으로 처리",
            "기존 업무 시스템 구조 안에서 신규 기능과 운영 이슈를 지속적으로 개선",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Node.js", "Prisma", "Zod", "AWS S3"],
        scopeNote:
            "ERP 전체를 초기 설계한 프로젝트가 아니라, 운영 중인 시스템에서 메뉴 단위 신규 기능과 API를 개발·유지보수한 경험입니다.",
    },
    {
        id: "legal-platform",
        title: "법률 상담 유입 및 변호사 플랫폼",
        subtitle: "입사 초기 프론트엔드에서 API·데이터 흐름까지 확장한 경험",
        period: "2023 ~ 2024",
        role: "Frontend Developer / Web Developer",
        status: "출시 보류",
        featured: false,
        summary:
            "사용자가 상황을 입력하고 질문지에 답한 뒤 변호사를 선택해 상담을 신청하는 사용자·관리자 서비스를 개발했습니다.",
        background:
            "입사 초기 프론트엔드 포지션으로 시작했지만 Next.js 단일 프로젝트 구조 안에서 화면, API Routes, 데이터 구조와 외부 알림 연동을 함께 경험했습니다.",
        metrics: [
            { value: "User + Admin", label: "양쪽 서비스 개발" },
            { value: "API Routes", label: "서버 로직 경험" },
            { value: "내부 테스트", label: "출시 전 검증 완료" },
        ],
        responsibilities: [
            "사용자 상황 입력, 질문지 응답, 변호사 선택과 상담 신청 플로우 개발",
            "운영자가 질문 구성을 관리하는 관리자 질문지 기능 구현",
            "Next.js API Routes 기반 API와 PostgreSQL 데이터 구조 개선 참여",
            "로그인, 정적 페이지, 사용자·관리자 화면 개발",
            "푸시 알림, 알림톡, NCP 등 외부 서비스 연동 경험",
        ],
        challenges: [],
        achievements: [
            "프론트엔드 화면에서 API와 DB 데이터 흐름까지 개발 범위 확장",
            "이후 CMS DB·API 설계와 운영 백엔드 확장의 기반 경험 확보",
        ],
        techStack: [
            "Next.js",
            "React",
            "TypeScript",
            "API Routes",
            "PostgreSQL",
            "Prisma",
            "React Query",
            "Zustand",
        ],
        scopeNote:
            "일부 서비스는 내부 테스트까지 완료했지만 회사 일정으로 외부 출시가 보류되었습니다. 운영 서비스로 표현하지 않습니다.",
    },
];

export function getProjectBySlug(slug: string): CareerProject | undefined {
    return projectsData.find((project) => project.id === slug);
}
