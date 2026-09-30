/** Resume-only copy from the reviewed September 2026 application records. */
type ResumeExperience = { id: string; title: string; period: string; bullets: string[] };

export const resumeSummary =
    "고객 서비스와 내부 업무 시스템을 개발하며 화면 구현에서 API·데이터 설계와 운영 개선까지 담당 범위를 넓혀왔습니다. 약 80개 홈페이지에 적용된 실시간 상담 플랫폼과 인사평가·채용·콘텐츠 관리 시스템을 개발했습니다. 현업의 업무 흐름을 듣고 필요한 기능과 자동화 범위를 구체화하며, 배포 이후 발생하는 연결 단절과 데이터 처리 문제까지 개선합니다. 익숙하지 않은 기술도 기존 코드와 실제 동작을 확인하며 학습하고, 서비스에 필요한 기능으로 연결합니다.";

export const resumeExperiences: ResumeExperience[] = [
    {
        id: "realtime-support",
        title: "대륜톡 — 실시간 상담 플랫폼",
        period: "2025.04 ~ 현재",
        bullets: [
            "초기 프론트엔드 개발자 1명으로 고객 상담 위젯과 ERP 상담 콘솔 전반을 담당하고 약 80개 홈페이지에 적용했습니다. 서비스 시작 후 1년간 DB 기준 12만 건 이상의 실제 상담이 유입된 서비스를 개발·운영했습니다.",
            "기존 공통 npm 패키지에 상담 위젯을 추가하고, 대표 문구·프로필·답변 설정을 서버에서 제어하도록 구성했습니다. 전체 사이트 배포에 최대 약 8시간이 필요할 수 있는 환경에서 사이트별 프론트 재배포 없이 변경할 수 있는 영역을 마련했습니다.",
            "웹 절전과 모바일 WebView의 연결 단절을 실제 기기로 재현했습니다. 앱 개발자와 Bridge를 연동하고, 토큰 갱신·재연결·서버 재조회로 단절 중 추가된 메시지와 상담 상태를 복구했습니다. 복구 실패 시에는 새로고침을 안내했습니다.",
            "백엔드 담당자 공백 이후 기존 Go 서버의 요청·데이터·배포 흐름을 파악해 운영과 기능 개선을 이어갔습니다. 고객용 Presigned URL 발급부터 파일 정보 저장·상담 메시지 연결까지 API와 UI를 개발했습니다.",
        ],
    },
    {
        id: "erp-groupware",
        title: "인사평가 결과 배포·이의제기 시스템",
        period: "2026.02 ~ 2026.03 · 이후 유지보수",
        bullets: [
            "인사팀의 업무를 듣고 기획자와 자동화 범위를 정했습니다. 평가 기준 변경에 대응할 수 있도록 Excel은 유지하고, 개인별 파일 전달과 DM 이의제기를 Excel 한 개 업로드와 ERP 결과 조회·문답 관리로 전환했습니다.",
            "구성원에게 전달된 평가 결과를 보존하기 위해 발송 시점별 Snapshot 구조를 설계했습니다. 초기 1:1 이의제기 요구는 기획자와 논의해 추가 질문과 답변을 누적할 수 있는 구조로 구체화했습니다.",
            "간헐적 처리 오류에 대응해 Nginx 전송 한도와 Prisma 트랜잭션 timeout을 조정하고, DB 저장과 WORKS 후속 알림을 분리했습니다. 1,000명 합성 데이터의 전원 DB 저장을 검증하고, 알림 재시도·기존 알림 확인·실패 로그 추적을 적용했습니다. 실제 1,000명 알림 수신을 검증한 것은 아닙니다.",
        ],
    },
    {
        id: "recruitment",
        title: "채용사이트·관리자 시스템 개편",
        period: "2023.11 · 약 3주 개발 후 유지보수",
        bullets: [
            "디자이너와 협업해 공개 화면부터 5단계 지원서·제출 API·관리자 기능까지 풀스택으로 개발했습니다. sessionStorage 입력 보존과 단계별 검증, 기존 암·복호화 방식과 S3 첨부파일 흐름을 적용했습니다.",
            "지원자 검색·날짜 필터·중복 지원 확인·읽음·합격 상태 관리를 구현했습니다. 월평균 약 6~7개 공고와 약 100건의 지원서를 한 시스템에서 검토하고 관리하도록 구성했습니다.",
        ],
    },
    {
        id: "snn-cms",
        title: "SNN 뉴스 관리자 CMS",
        period: "2024.11 ~ 2025.03",
        bullets: [
            "기획 화면과 운영 요구사항에서 엔티티와 관계를 도출해 PostgreSQL 초기 구조를 설계하고 관리자 화면·API를 개발했습니다. 기사 작성·이미지 업로드·예약 발행·메인 노출·권한 관리 기능을 구현했습니다.",
            "뉴스·오피니언 분리로 검색 쿼리가 복잡해지는 문제를 발견하고 동료와 논의해 공통 콘텐츠 모델과 유형 구분 방식으로 통합했습니다. 사용자용 뉴스 프론트엔드는 담당 범위에서 제외됩니다.",
        ],
    },
    {
        id: "spring-msa",
        title: "Spring Boot 서비스 이관",
        period: "2026 · 진행 중 / 개발 서버 QA",
        bullets: [
            "기존 백엔드와 팀의 구현 패턴을 분석해 Spring Boot 알림 API와 Kafka 기반 사용자 정보 동기화를 구현했습니다. 선행 구축된 인프라에 서비스용 Helm·ArgoCD 배포 구성을 추가했습니다.",
            "개발 서버에서 API 응답·DB 저장·미인증 요청·Kafka 이벤트 수신과 재배포를 검증했습니다. 인사평가 API는 이관 코드 작성 중이며, 전체 인프라 구축이나 운영 트래픽 전환을 완료한 경험은 아닙니다.",
        ],
    },
    {
        id: "operations",
        title: "운영 및 협업 방식 개선",
        period: "재직 중",
        bullets: [
            "개발 서버에서 변경사항을 QA한 뒤 운영에 반영하는 절차를 마련하고, API 처리·오류 이력을 확인하는 로깅 화면과 주요 API의 Slack 오류 알림을 적용했습니다. 요구사항·설계 판단·배포 시 확인사항을 문서로 남겨 동료가 작업을 이어갈 수 있도록 했습니다.",
        ],
    },
];

export const resumeTools = [
    {
        label: "주력 개발",
        value: "TypeScript, JavaScript, React, Next.js, TanStack Query, Zustand, WebSocket",
    },
    {
        label: "API·데이터 및 운영 확장",
        value: "Node.js, Next.js API Routes, PostgreSQL, Prisma, Go, AWS S3, Nginx",
    },
    {
        label: "서비스 이관·개발 서버 QA",
        value: "Java, Spring Boot, Kafka, Kubernetes, Helm, ArgoCD, Jenkins, Amazon ECR",
    },
    {
        label: "개인 프로젝트·학습",
        value: "Python, FastAPI, LangChain, LangGraph, pgvector, Ragas",
    },
];
