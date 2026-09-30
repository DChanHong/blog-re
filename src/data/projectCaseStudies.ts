import { projectsData } from "./projects";
import type { CareerProject } from "@/types/portfolio";

export interface ProjectCaseStudy {
    category: string;
    comparison: [string, string];
    before: string[];
    after: string[];
    flow: Array<{ label: string; value: string }>;
    architecture: Array<{ label: string; value: string }>;
    quality: string[];
    scope: string;
    project: CareerProject;
}

type CaseCopy = Omit<ProjectCaseStudy, "project"> & { overrides?: Partial<CareerProject> };

// 공유 원본은 보존하고 상세 페이지에서 실적과 담당 범위를 명확히 한다.
const cases: Record<string, CaseCopy> = {
    "realtime-support": {
        category: "사내 서비스 · 실시간 상담",
        comparison: ["개선 전", "개선 후"],
        before: [
            "외부 상담 서비스의 비용·기능 확장·ERP 연계 제약",
            "절전과 모바일 복귀 시 연결·상담방 상태 복구 문제",
            "여러 홈페이지의 상담 기능을 일관되게 관리할 필요",
        ],
        after: [
            "약 80개 홈페이지에 자체 상담 위젯 적용",
            "연결과 상담방 생명주기를 분리해 재연결 흐름 개선",
            "기존 공통 npm 패키지에 위젯을 추가해 배포·관리",
            "서비스 시작 후 1년간 실제 상담 12만 건 이상 집계",
        ],
        flow: [
            { label: "상담 접점", value: "홈페이지" },
            { label: "실시간 연결", value: "WebSocket" },
            { label: "기존 서버 확장", value: "Go" },
            { label: "상담 운영", value: "ERP" },
        ],
        architecture: [
            { label: "고객·관리자 화면", value: "Next.js · React · 공통 npm 패키지" },
            { label: "상태 관리", value: "React Query 조회 캐시 · Zustand 실시간 상태" },
            { label: "통신·서버", value: "REST API · WebSocket · 기존 Go 서버 확장" },
            { label: "파일 처리", value: "AWS S3 · Presigned URL · 썸네일 처리 상태" },
        ],
        quality: [
            "비정상 종료 재시도와 현재 상담방 재참여 처리",
            "데스크톱과 모바일 WebView의 복귀·연결 복구 대응",
            "서버 조회 캐시와 즉시 반영하는 실시간 상태의 책임 분리",
        ],
        scope: "고객 위젯과 ERP 상담 화면을 담당하고 기존 Go 서버를 수정·확장했습니다. Go·WebSocket 서버나 공통 npm 패키지 자체를 처음부터 구축한 것은 아닙니다. 12만 건은 메시지 수가 아닌 서비스 첫 1년간 실제 상담 DB 집계입니다.",
        overrides: {
            responsibilities: [
                "고객 상담 위젯과 ERP 관리자 주요 화면 설계·개발",
                "메시지·상담방·미확인 수·미리보기 실시간 동기화",
                "기존 공통 npm 패키지에 상담 위젯 추가 및 배포",
                "파일 업로드 API와 Presigned URL 기반 화면 흐름 구현",
                "모바일 앱 Bridge 기반 재연결과 기존 Go 운영 API 확장",
            ],
            challenges: [
                {
                    title: "연결과 상담방 생명주기",
                    problem:
                        "절전·모바일 복귀·파일 선택 후 연결과 상담방 상태가 복구되지 않았습니다.",
                    action: "연결과 상담방의 생명주기를 분리하고 재시도·소켓 교체·상담방 재참여를 구현했습니다.",
                    result: "새로고침 없이 상태를 복구하는 흐름을 마련했습니다.",
                },
                {
                    title: "조회와 실시간 상태의 경계",
                    problem:
                        "REST 조회와 WebSocket 이벤트의 책임을 나누어 동기화할 필요가 있었습니다.",
                    action: "조회·변경 요청은 React Query, 즉시 반영 상태는 Zustand로 분리했습니다.",
                    result: "조회 캐시와 UI 이벤트 상태의 역할을 명확히 했습니다.",
                },
                {
                    title: "여러 홈페이지에 일관된 위젯 제공",
                    problem: "사이트별 복사 방식은 기능 개선과 장애 대응을 분산시킬 수 있었습니다.",
                    action: "기존 공통 npm 패키지에 위젯을 추가하고 설정은 props, 내부 상태는 Context와 Hook으로 분리했습니다.",
                    result: "공통 패키지 버전으로 위젯을 관리합니다.",
                },
            ],
        },
    },
    "erp-groupware": {
        category: "사내 서비스 · 인사 업무",
        comparison: ["개선 전", "개선 후"],
        before: [
            "개인별 Excel 파일을 따로 전달",
            "DM으로 이의제기를 받아 진행 상태를 추적",
            "대량 평가 처리 중 간헐적인 저장 오류 보고",
        ],
        after: [
            "Excel 양식을 유지하면서 결과 전달과 이의제기를 ERP로 연결",
            "발송 시점별 Snapshot으로 전달한 평가 결과 보존",
            "핵심 DB 저장과 WORKS 후속 알림 분리",
            "1,000명 합성 평가 데이터의 전원 DB 저장 검증",
        ],
        flow: [
            { label: "평가 입력", value: "Excel" },
            { label: "결과 매칭", value: "API" },
            { label: "시점별 보존", value: "Snapshot" },
            { label: "문답·상태", value: "ERP" },
        ],
        architecture: [
            { label: "화면·API", value: "Next.js · React · 관리자와 구성원 화면" },
            { label: "데이터 보존", value: "PostgreSQL · Prisma · 발송 시점별 Snapshot" },
            { label: "후속 처리", value: "DB 저장 후 WORKS 알림 · 실패 재시도 및 로그" },
            { label: "업무 규칙", value: "대기 → 응답 중 → 완료 · 누적 메시지 구조" },
        ],
        quality: [
            "1,000명 합성 데이터의 전원 DB 저장 확인. 알림 1,000건의 실제 수신 검증은 아님",
            "Nginx 전송 한도와 Prisma 트랜잭션 timeout 조정",
            "알림 재시도·기존 알림 확인·실패 로그 추적",
            "Zod 입력 검증과 UTC 서버의 KST 날짜 처리",
        ],
        scope: "기존 ERP 내부의 인사평가 기능을 설계·구현했습니다. ERP 전체 구축 실적이 아닙니다. 합성 데이터 검증 규모와 실제 운영 성과를 구분하며, 외부 알림의 전달 보장을 주장하지 않습니다.",
        overrides: {
            metrics: [
                { value: "Excel + ERP", label: "양식 유지 · 전달과 이의제기 통합" },
                { value: "1,000명", label: "합성 평가 데이터 DB 저장 검증" },
                { value: "13개", label: "이의제기 REST API" },
            ],
            responsibilities: [
                "인사팀·기획자와 자동화 범위 협의, Excel 결과 매칭과 개인별 전달 구현",
                "Snapshot 데이터 구조 및 관리자·구성원 화면 설계",
                "이의제기 상태 전이·메시지 타임라인·첨부파일·13개 API 개발",
                "DB 저장과 외부 알림 분리, 오류 추적과 재시도 개선",
            ],
        },
    },
    "snn-cms": {
        category: "사내 프로젝트 · 콘텐츠 관리",
        comparison: ["구축 과제", "구현 결과"],
        before: [
            "운영자가 기사와 주요 노출 영역을 직접 관리할 도구 필요",
            "기사·기자·태그·첨부파일의 복합 관계 저장 필요",
            "기사 원본 품질과 웹 이미지 용량의 균형 필요",
        ],
        after: [
            "DB 구조부터 API와 관리자 화면까지 연결",
            "기사와 관계 데이터를 트랜잭션 단위로 저장",
            "예약 발행·배너·검색 키워드·권한 관리 구현",
            "WebP 변환 및 별도 썸네일 등록 흐름 구성",
        ],
        flow: [
            { label: "기사 작성", value: "CMS" },
            { label: "저장 처리", value: "API" },
            { label: "관계 데이터", value: "DB" },
            { label: "이미지 제공", value: "S3" },
        ],
        architecture: [
            { label: "관리자 편집", value: "Next.js · React · CKEditor" },
            { label: "API·데이터", value: "Prisma Transaction · PostgreSQL" },
            { label: "이미지 처리", value: "sharp WebP 변환 · AWS S3" },
            { label: "운영 기능", value: "예약 발행 · 메인 노출 설정 · 관리자 권한" },
        ],
        quality: [
            "복합 관계 데이터 저장을 Prisma Transaction으로 처리",
            "기사 수정·soft delete와 관계 조회 기준 정리",
            "이미지 용도와 중요도에 따른 원본·썸네일 처리 구분",
        ],
        scope: "뉴스 플랫폼의 관리자 CMS와 관련 DB·API를 담당했습니다. 공개 뉴스 사용자 화면 전체를 개발한 것으로 표현하지 않습니다.",
    },
    "admin-platform": {
        category: "외주 프로젝트 · 관리자 시스템",
        comparison: ["구축 과제", "구현 결과"],
        before: [
            "디자인만으로는 편집 범위와 운영 규칙이 불명확",
            "외주마다 반복되는 인증·권한·업로드 구현",
            "중간 결과에 대한 고객사 검수와 피드백 반영 필요",
        ],
        after: [
            "기업·의료기관 2개 프로젝트의 관리자 기능 실사용",
            "관리 기능을 정의하고 화면·API·입력 검증 연결",
            "공통 모듈과 데이터 접근 계층을 후속 개발 기반으로 분리",
        ],
        flow: [
            { label: "업무 구체화", value: "운영 규칙" },
            { label: "관리 화면", value: "React" },
            { label: "기능 처리", value: "API" },
            { label: "피드백 반영", value: "고객 검수" },
        ],
        architecture: [
            { label: "관리자 UI", value: "Next.js · React Hook Form · 공통 UI" },
            { label: "입력·권한", value: "Zod · 메뉴 권한 · 관리자 계정" },
            { label: "데이터 계층", value: "Prisma · 프로젝트별 DB 연결" },
            { label: "재사용 기반", value: "인증·권한·로그·업로드 모듈과 사용 가이드" },
        ],
        quality: [
            "중간 Vercel 배포본으로 고객사 검수와 추가 요청 반영",
            "관리자 입력 검증·메뉴 권한·처리 상태 기준 적용",
            "공통 보일러플레이트의 목데이터와 실제 DB 구현 분리",
        ],
        scope: "기업·의료기관 관리자 시스템은 실제 사용 중입니다. 의료기관은 관리자 영역을 담당했습니다. 공통 보일러플레이트는 목데이터 기반이며, 프로젝트별 영속 DB 연결과 콘텐츠 기능은 별도 구현합니다.",
        overrides: {
            metrics: [
                { value: "2개", label: "기업·의료기관 관리자 시스템 개발" },
                { value: "실사용", label: "고객사 운영 중" },
                { value: "공통 모듈", label: "인증·권한·UI·업로드 기반 분리" },
            ],
        },
    },
    "legal-platform": {
        category: "사내 프로젝트 · 법률 상담",
        comparison: ["구축 과제", "구현·검증 결과"],
        before: [
            "사용자 상황에 맞는 상담 신청 흐름 구성",
            "운영자가 질문지 구성을 관리할 기능 필요",
            "화면에서 API·DB와 외부 알림까지 연결할 필요",
        ],
        after: [
            "상황 입력·질문지 응답·변호사 선택·상담 신청 구현",
            "사용자 화면과 관리자 질문지 기능 개발",
            "내부 테스트까지 완료했으나 외부 출시는 보류",
        ],
        flow: [
            { label: "사용자 입력", value: "상황·질문" },
            { label: "상담 연결", value: "변호사 선택" },
            { label: "신청 처리", value: "API" },
            { label: "운영 관리", value: "관리자" },
        ],
        architecture: [
            { label: "화면", value: "Next.js · React · 사용자 및 관리자" },
            { label: "서버·데이터", value: "API Routes · PostgreSQL · Prisma" },
            { label: "클라이언트 상태", value: "React Query · Zustand" },
            { label: "외부 연동 경험", value: "푸시 알림 · 알림톡 · NCP" },
        ],
        quality: [
            "출시 전 내부 테스트를 수행한 범위의 구현 경험",
            "운영 환경의 성능·이용자 수·전환율 등 미확인 성과는 제시하지 않음",
            "회사 일정에 따른 외부 출시 보류 상태를 명시",
        ],
        scope: "사용자·관리자 화면과 API·DB 개선에 참여했습니다. 일부 서비스는 내부 테스트까지 완료했으나 외부 출시가 보류되어, 실제 운영 성과로 표현하지 않습니다.",
        overrides: {
            challenges: [
                {
                    title: "연속된 상담 신청 흐름",
                    problem:
                        "상황 입력부터 변호사 선택과 신청까지 연결되는 화면·데이터 흐름이 필요했습니다.",
                    action: "사용자 입력·질문지·변호사 선택·상담 신청 플로우를 구현했습니다.",
                    result: "상담 신청 흐름을 내부 테스트했습니다.",
                },
                {
                    title: "사용자와 관리자 기능 연결",
                    problem: "사용자가 답하는 질문 구성을 운영자가 관리할 수 있어야 했습니다.",
                    action: "관리자 질문지와 API Routes, PostgreSQL 데이터 구조 개선에 참여했습니다.",
                    result: "화면과 서버 데이터의 연결 경험을 확보했습니다.",
                },
            ],
        },
    },
    "spring-msa": {
        category: "사내 프로젝트 · 서비스 이관",
        comparison: ["이관 과제", "개발 환경 검증 결과"],
        before: [
            "기존 Next.js 백엔드의 알림 기능을 별도 서비스로 분리",
            "분리된 서비스에서 사용자 변경 정보를 동기화할 필요",
            "새 서비스를 선행 구축된 배포 환경에 연결할 필요",
        ],
        after: [
            "Spring Boot 알림 API와 Kafka 사용자 동기화 구현",
            "서비스용 Helm·ArgoCD 배포 구성 추가",
            "개발 서버에서 API·DB·인증·이벤트 수신과 재배포 확인",
            "운영 트래픽 전환 전 단계 · 인사평가 API 이관 코드 작성 중",
        ],
        flow: [
            { label: "도메인 구현", value: "Spring" },
            { label: "이미지 생성", value: "Jenkins" },
            { label: "배포 반영", value: "ArgoCD" },
            { label: "개발 환경", value: "Kubernetes" },
        ],
        architecture: [
            {
                label: "알림 서비스",
                value: "Spring Boot · Controller/Service/Repository · PostgreSQL",
            },
            { label: "사용자 정보", value: "Kafka 변경 이벤트 수신·동기화" },
            { label: "서비스 배포", value: "Helm 차트 · ArgoCD Application" },
            { label: "선행 구축 환경", value: "Jenkins · Amazon ECR · Kubernetes · Kafka" },
        ],
        quality: [
            "개발 서버에서 알림 API와 DB 저장 확인",
            "미인증 요청의 401 응답 검증",
            "Kafka 이벤트 수신과 사용자 데이터 반영 확인",
            "이미지 빌드부터 재배포까지 실행 흐름 검증",
        ],
        scope: "VPC·Kubernetes·Jenkins·Kafka 초기 인프라는 선행 구축된 환경입니다. 알림 도메인과 서비스 배포 구성을 담당했으며 운영 트래픽 전환은 아직 진행하지 않았습니다.",
        overrides: {
            metrics: [
                { value: "Spring Boot", label: "알림 도메인 API 구현" },
                { value: "Kafka", label: "사용자 변경 이벤트 동기화" },
                { value: "개발 서버 QA", label: "기능·인증·재배포 검증 · 운영 전환 전" },
            ],
        },
    },
};

export function getProjectCaseStudy(id: string): ProjectCaseStudy | undefined {
    const source = projectsData.find((project) => project.id === id);
    const copy = cases[id];
    if (!source || !copy) return undefined;
    const { overrides, ...detail } = copy;
    return { ...detail, project: { ...source, ...overrides } };
}
