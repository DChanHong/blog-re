import type { CareerProject } from "@/types/portfolio";

export const projectsData: CareerProject[] = [
    {
        id: "realtime-support",
        title: "대륜톡 — 실시간 상담 플랫폼",
        subtitle: "80여 개 홈페이지와 ERP를 연결한 사내 상담 플랫폼",
        period: "2025.04 ~ 현재",
        role: "Main Frontend Developer → Go Backend 운영·확장",
        status: "운영 중",
        featured: true,
        summary:
            "약 80개 홈페이지의 고객 상담 위젯과 ERP 관리자 콘솔을 개발했습니다. 실시간 상태 동기화와 연결 복구를 구현하고, Go 기반 파일 업로드 API까지 개발 범위를 넓혔습니다.",
        background:
            "기존 채널톡은 빠른 도입에는 유리했지만 비용, 기능 확장, ERP 연계에 제약이 있었습니다. 단순 UI 복제가 아니라 여러 홈페이지에서 재사용할 수 있고 상담 운영 흐름과 결합되는 자체 플랫폼이 필요했습니다.",
        metrics: [
            { value: "약 80개", label: "상담 위젯 적용 홈페이지" },
            { value: "12만 건+", label: "서비스 시작 후 1년간 실제 상담 · DB 집계" },
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
        featured: false,
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
        title: "인사평가 배포·이의제기 시스템",
        subtitle: "평가 결과 전달과 이의제기를 연결한 ERP 업무 시스템",
        period: "2026.02 ~ 2026.03 · 이후 유지보수",
        role: "업무 요구사항 구체화 · 화면·API·DB 설계 및 개발",
        status: "운영 중",
        featured: true,
        summary:
            "개인별 Excel 전달과 DM으로 나뉘어 있던 평가 업무를 ERP로 연결했습니다. 평가 결과 보존을 위한 데이터 구조부터 화면·API를 구현하고, 대량 저장과 외부 알림 처리를 개선했습니다.",
        background:
            "인사팀이 개인별 Excel 파일을 만들어 전달하고 DM으로 이의제기를 관리했습니다. 평가 기준이 달라지는 업무 특성을 고려해 기존 Excel 양식은 유지하고, 결과 매칭·개인별 전달·이의제기 관리를 시스템화했습니다.",
        metrics: [
            { value: "Excel + ERP", label: "평가 양식 유지 · 전달과 이의제기 시스템화" },
            { value: "1,000명", label: "합성 평가 데이터 전원 DB 저장 검증" },
            { value: "13개", label: "이의제기 REST API" },
            { value: "3단계", label: "업무 상태 전이" },
            { value: "상시", label: "운영 요청 대응" },
        ],
        responsibilities: [
            "인사팀·기획자와 자동화 범위 협의 및 Excel 결과 매칭·개인별 전달 구현",
            "발송 시점별 평가 결과를 보존하는 Snapshot 데이터 구조 설계",
            "핵심 DB 저장과 WORKS 후속 알림 분리, 실패 재시도·중복 확인·오류 추적",
            "WAITING → RESPONDING → COMPLETED 상태 기반 인사평가 이의제기 기능 개발",
            "관리자·구성원 화면, 메시지 타임라인, 파일 첨부와 13개 API 구현",
            "드래그 앤 드롭 사이드바 순서 개인화와 Transaction 기반 저장",
            "상담 목록, AI 요약, 메모, 통화 이력, 담당자 배정을 포함한 AICC 화면 개발",
            "Zod 입력 검증과 EC2 UTC 환경을 고려한 KST 날짜 처리",
        ],
        architecture: [
            "평가 Excel 업로드 · 대상자 매칭",
            "API · PostgreSQL 결과 저장",
            "발송 시점별 Snapshot 보존",
            "ERP 결과 조회 · 이의제기·답변",
        ],
        challenges: [
            {
                title: "평가 결과 보존과 추가 문답",
                problem: "평가 결과를 수정하더라도 구성원에게 실제 전달한 시점의 데이터가 보존되어야 했고, 초기 1:1 이의제기 구조는 추가 질문을 담기 어려웠습니다.",
                action: "발송 시점별 Snapshot 구조를 설계하고, 기획자와 논의해 질문과 답변을 누적하는 메시지 구조로 구체화했습니다.",
                result: "전달 시점의 결과를 별도로 보존하고 추가 문답을 이어갈 수 있는 데이터 기반을 마련했습니다.",
            },
            {
                title: "대량 저장과 외부 알림 처리 분리",
                problem: "인사팀으로부터 대량 평가 처리 중 간헐적인 오류가 보고됐습니다.",
                action: "Nginx 전송 한도와 Prisma 트랜잭션 timeout을 조정하고, DB 저장 후 WORKS 알림을 후속 처리하도록 분리했습니다. 재시도·기존 알림 확인·실패 로그 추적을 적용했습니다.",
                result: "1,000명 합성 데이터의 전원 DB 저장을 확인했고, 개선 후 실제 사용에서 동일 오류가 재발하지 않았습니다. 알림 1,000건의 실제 수신이나 전달 보장을 검증한 것은 아닙니다.",
            },
        ],
        achievements: [
            "개인별 파일 전달과 DM 추적을 Excel 한 개 기반 결과 전달·ERP 이의제기 관리로 전환",
            "1,000명 합성 데이터 저장 검증 및 반복되던 운영 오류 개선",
            "화면 요구사항부터 데이터와 API까지 한 흐름으로 처리",
            "기존 업무 시스템 구조 안에서 신규 기능과 운영 이슈를 지속적으로 개선",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Nginx", "Zod", "AWS S3"],
        scopeNote:
            "기존 ERP 안에서 인사평가 기능을 설계·구현한 경험이며 ERP 전체를 초기 구축한 것은 아닙니다. 1,000명은 합성 데이터의 DB 저장 테스트 규모입니다. 그 외 사이드바 개인화·AICC 화면 등 기존 ERP 유지보수도 담당했습니다.",
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
    {
        id: "admin-platform",
        title: "외주 관리자 시스템과 공통 개발 기반",
        subtitle: "관리 기능 정의부터 화면·API 구현, 재사용 기반까지",
        period: "2026.06 ~ 현재",
        role: "관리자 기능·운영 규칙 정의 · 화면·API 개발 · 공통 기반 제작",
        status: "운영 중",
        featured: true,
        summary:
            "고객사가 실제 사용 중인 기업·의료기관 홈페이지의 관리자 화면과 API를 개발했습니다. 관리 기능과 운영 규칙을 구체화하고, 반복되는 인증·권한·업로드·공통 UI를 후속 프로젝트를 위한 보일러플레이트로 분리했습니다.",
        background:
            "명확한 관리자 기획서가 없는 외주 프로젝트에서 디자인을 바탕으로 편집 범위와 처리 상태, 운영 규칙을 정해야 했습니다. PM과 함께 고객사와 소통하고 중간 배포본의 검수 피드백을 반영했습니다.",
        metrics: [
            { value: "2개 프로젝트", label: "기업·의료기관 관리자 영역 개발 담당" },
            { value: "공통 모듈화", label: "인증·권한·UI·업로드 기반 분리" },
        ],
        responsibilities: [
            "기업 홈페이지의 콘텐츠·회사 정보·관리자 계정·로그 등 관리자 영역 개발",
            "기업 홈페이지 고객지원·제품 소개 등 일부 사용자 화면 구현",
            "의료기관 홈페이지 상담 처리·블랙리스트·이벤트·팝업·의료진 편집 기능 정의 및 개발",
            "관리자 화면·API·입력 검증·메뉴 권한·파일 업로드 구현",
            "외주사 검수용 Vercel 배포 및 피드백 반영",
            "인증·권한·공통 UI·업로드·데이터 접근 계층과 사용 가이드 모듈화",
        ],
        challenges: [
            {
                title: "디자인을 운영 가능한 관리자 기능으로 구체화",
                problem: "관리자 기획이 명확하지 않아 화면만으로는 편집 가능한 항목과 처리 규칙을 결정할 수 없었습니다.",
                action: "상담 상태·메모·검색·블랙리스트, 이벤트 기간·게시 여부, 의료진 편집 범위를 기능 스펙으로 정의하고 화면·API로 구현했습니다.",
                result: "고객사가 중간 배포본을 검수하며 관리 기능을 확인하고 추가 요청을 반영할 수 있는 흐름을 마련했습니다.",
            },
            {
                title: "반복되는 관리자 기반 분리",
                problem: "외주마다 인증과 권한, 업로드, 공통 화면을 반복 구성해야 했습니다.",
                action: "공통 기능을 보일러플레이트로 모듈화하고, 목데이터와 실제 DB 구현을 교체할 수 있는 데이터 접근 계층과 사용 가이드를 정리했습니다.",
                result: "후속 관리자 프로젝트의 초기 기반으로 사용하고 있습니다. 프로젝트별 콘텐츠 기능과 영속 DB 연결은 별도로 구현하는 구조입니다.",
            },
        ],
        achievements: [
            "기업·의료기관 두 프로젝트의 관리자 기능을 개발해 고객사에서 실제 사용 중",
            "디자인에서 편집 범위와 운영 규칙을 도출해 화면·API로 구현",
            "인증·권한·계정·로그·UI·업로드를 후속 개발에 활용할 공통 기반으로 분리",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Prisma", "Zod", "React Hook Form", "Vercel"],
        scopeNote:
            "기업·의료기관 두 프로젝트의 관리자 시스템은 고객사가 실제 사용 중입니다. 의료기관 프로젝트는 관리자 영역을 담당했으며 사용자 화면 전체를 개발한 것은 아닙니다. 별도의 후속 프로젝트는 초기 세팅 중이고, 공통 보일러플레이트는 목데이터 기반으로 프로젝트별 DB 연결이 필요합니다.",
    },
    {
        id: "spring-msa",
        title: "Spring Boot 서비스 이관과 Kubernetes 배포",
        subtitle: "알림 도메인 구현부터 개발 서버 배포·QA까지",
        period: "2026 · 진행 중",
        role: "알림 서비스 이관 · Kafka 연동 · 서비스 배포 구성 및 개발 서버 QA",
        status: "이관 진행 중",
        featured: true,
        summary:
            "기존 백엔드의 알림 기능을 Spring Boot 서비스로 이관하고, Kafka 기반 사용자 정보 동기화를 구현했습니다. Helm·ArgoCD 배포 구성을 추가하고 Kubernetes 개발 환경에서 API·DB·인증·이벤트 수신과 재배포를 검증했습니다.",
        background:
            "기존 Next.js 백엔드를 Java·Spring Boot 서비스로 분리하는 팀 프로젝트입니다. 선행 구축된 Kubernetes와 CI/CD 환경을 활용해 알림 도메인을 구현하고 개발 서버에서 기능과 배포 흐름을 확인했습니다.",
        metrics: [
            { value: "Spring Boot + Kafka", label: "알림 API와 사용자 정보 동기화" },
            { value: "Kubernetes + GitOps", label: "Helm·ArgoCD 배포 구성 · 개발 서버 검증" },
        ],
        responsibilities: [
            "알림 목록·미확인 개수·생성·읽음·클릭 처리 API 구현",
            "Spring Boot Controller·Service·Repository·Entity 및 인증 요청 처리 구성",
            "Kafka 사용자 변경 이벤트 수신과 서비스 내 사용자 정보 동기화 구현",
            "AI 도구를 활용한 서비스용 Helm 차트와 ArgoCD Application 추가",
            "Jenkins 빌드·ECR 이미지·ArgoCD 반영 및 재배포 확인",
            "개발 서버 API·DB 저장·미인증 401·Kafka 수신 QA",
            "인사평가 API의 Spring Boot 이관 코드 작성 중",
        ],
        architecture: ["알림 API · Kafka 사용자 이벤트", "Spring Boot 서비스 · PostgreSQL", "Jenkins 빌드 · ECR 이미지", "Helm · ArgoCD", "Kubernetes 개발 서버 · QA"],
        challenges: [
            {
                title: "분리된 서비스의 사용자 정보 동기화",
                problem: "알림 서비스에서 사용하는 사용자 정보를 다른 도메인의 변경에 맞춰 갱신해야 했습니다.",
                action: "Kafka 사용자 변경 이벤트를 수신해 알림 서비스의 사용자 정보 테이블에 동기화하는 구조를 구현했습니다.",
                result: "개발 서버에서 Kafka 메시지 수신과 데이터 반영을 확인했습니다.",
            },
            {
                title: "구현부터 배포·재배포까지 검증",
                problem: "새 도메인 서비스를 기존 Kubernetes와 CI/CD 환경에 연결하고 실제 실행을 확인해야 했습니다.",
                action: "서비스용 Helm·ArgoCD 구성을 추가하고 Jenkins 빌드, 이미지 생성, 배포 후 API·DB·인증 동작을 검사했습니다.",
                result: "개발 서버에서 알림 기능, 미인증 요청의 401 응답과 재빌드·재배포를 검증했습니다.",
            },
        ],
        achievements: ["알림 도메인의 Spring Boot API 및 Kafka 동기화 구현", "서비스 단위 배포 구성 추가와 개발 서버 기능·재배포 검증"],
        techStack: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Kubernetes", "Helm", "ArgoCD", "Jenkins", "Amazon ECR"],
        scopeNote:
            "초기 VPC·Kubernetes·Jenkins·Kafka 인프라는 선행 구축된 환경입니다. 본인은 알림 서비스와 배포 구성을 담당했습니다. 운영 트래픽 전환 전 개발 서버 QA 단계이며, 인사평가 API는 코드 작성 중입니다.",
    },
];

export function getProjectBySlug(slug: string): CareerProject | undefined {
    return projectsData.find((project) => project.id === slug);
}
