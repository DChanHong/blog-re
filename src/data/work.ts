interface WorkCard {
    slug: string;
    category: string;
    title: string;
    description: string;
    metric: string;
    caption: string;
}

// Work 목록의 요약 문구. 담당 범위의 원본은 projects.ts에서 관리한다.
export const workCards: WorkCard[] = [
    {
        slug: "realtime-support",
        category: "사내 서비스 · 운영 중",
        title: "대륜톡 실시간 상담 플랫폼",
        description: "여러 홈페이지의 고객 상담 위젯과 ERP 상담 콘솔을 연결하고, 실시간 동기화와 연결 복구를 구현했습니다.",
        metric: "약 80개",
        caption: "상담 위젯을 적용한 홈페이지",
    },
    {
        slug: "erp-groupware",
        category: "사내 서비스 · 운영 중",
        title: "인사평가 배포·이의제기 시스템",
        description: "기존 평가 양식은 유지하면서 개인별 파일 전달과 DM으로 나뉜 업무를 ERP로 연결했습니다.",
        metric: "Excel + ERP",
        caption: "평가 결과 전달부터 이의제기까지 업무 통합",
    },
    {
        slug: "snn-cms",
        category: "사내 프로젝트 · 개발 완료",
        title: "SNN 뉴스 플랫폼 관리자 CMS",
        description: "기사 작성과 예약 발행, 노출·권한 관리를 위한 데이터 구조와 API, 관리자 화면을 개발했습니다.",
        metric: "DB · API · UI",
        caption: "콘텐츠 운영을 위한 관리자 영역 통합 개발",
    },
    {
        slug: "admin-platform",
        category: "외주 프로젝트 · 운영 중",
        title: "관리자 시스템과 공통 개발 기반",
        description: "기업·의료기관의 관리자 화면과 API를 개발하고, 인증·권한·업로드 기능을 공통 기반으로 분리했습니다.",
        metric: "2개 프로젝트",
        caption: "고객사가 실제 사용 중인 관리자 시스템",
    },
    {
        slug: "recruitment",
        category: "사내 서비스 · 운영 중",
        title: "채용사이트·관리자 시스템 개편",
        description: "5단계 지원서의 입력 보존과 검증부터 제출 API, 첨부파일과 지원자 검토 기능까지 개발했습니다.",
        metric: "5단계 지원서",
        caption: "공개 화면·제출 API·관리자 검토 흐름 연결",
    },
    {
        slug: "legal-platform",
        category: "사내 프로젝트 · 출시 보류",
        title: "법률 상담 및 변호사 플랫폼",
        description: "상황 입력부터 질문지 응답, 변호사 선택과 상담 신청까지 사용자·관리자 흐름을 개발했습니다.",
        metric: "내부 테스트",
        caption: "출시 전 검증 완료 · 외부 출시는 보류",
    },
    {
        slug: "spring-msa",
        category: "사내 프로젝트 · 이관 진행 중",
        title: "Spring Boot 서비스 이관과 배포",
        description: "알림 API와 Kafka 동기화를 구현하고, 기존 Kubernetes 환경에 서비스 배포 구성을 추가했습니다.",
        metric: "개발 서버 QA",
        caption: "기능·재배포 검증 · 운영 트래픽 전환 전",
    },
];
