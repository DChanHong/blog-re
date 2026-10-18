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
        description: "여러 홈페이지에서 사용하는 상담 위젯과 ERP 상담 콘솔을 개발했습니다. 실시간 상태 반영과 연결 복구도 구현했습니다.",
        metric: "약 80개",
        caption: "상담 위젯을 적용한 홈페이지",
    },
    {
        slug: "erp-groupware",
        category: "사내 서비스 · 운영 중",
        title: "ERP 인사평가·전자결재 개발",
        description: "평가 결과 통지·이의제기를 개발했습니다. 전자결재 초기 공동 개발과 기존 DB를 활용한 관리자 종합평가 개편도 맡았습니다.",
        metric: "Excel + ERP",
        caption: "결과 통지 · 결재 DB·규칙 · 관리자평가 개편",
    },
    {
        slug: "snn-cms",
        category: "사내 프로젝트 · 개발 완료",
        title: "SNN 뉴스 플랫폼 관리자 CMS",
        description: "기사 작성과 예약 발행, 메인 노출과 권한 관리 기능을 개발했습니다. 관리자 CMS의 DB 구조와 API, 화면을 맡았습니다.",
        metric: "DB · API · UI",
        caption: "콘텐츠 운영을 위한 관리자 영역 통합 개발",
    },
    {
        slug: "admin-platform",
        category: "외주 프로젝트 · 운영 중",
        title: "기업·의료기관 관리자 시스템과 공통 모듈",
        description: "기업·의료기관의 관리자 화면과 API를 개발했습니다. 반복되는 인증·권한·업로드 기능은 공통 모듈로 분리했습니다.",
        metric: "2개 프로젝트",
        caption: "고객사가 실제 사용 중인 관리자 시스템",
    },
    {
        slug: "recruitment",
        category: "사내 서비스 · 운영 중",
        title: "채용사이트·관리자 시스템 개편",
        description: "5단계 지원서의 입력 보존과 검증을 적용했습니다. 제출 API와 첨부파일 처리, 지원자 검색과 검토 기능도 개발했습니다.",
        metric: "5단계 지원서",
        caption: "지원서 작성·제출과 관리자 검토",
    },
    {
        slug: "legal-platform",
        category: "사내 프로젝트 · 웹 배포 완료",
        title: "법률 상담·변호사 연결 서비스",
        description: "상황 입력과 질문지 응답, 변호사 선택과 상담 신청 화면을 개발했습니다. 관리자 질문지 기능도 맡았습니다.",
        metric: "웹 배포 완료",
        caption: "검색 사이트 오픈 미진행",
    },
    {
        slug: "spring-msa",
        category: "사내 프로젝트 · 이관 진행 중",
        title: "Spring Boot API 이관 준비",
        description: "인사평가 API 이관을 준비하며 Gradle 기반 alarm 연습 모듈, 보안 필터와 Flyway 초기 스키마를 구성했습니다.",
        metric: "이관 준비·연습",
        caption: "Spring Boot 연습 모듈 구성",
    },
];
