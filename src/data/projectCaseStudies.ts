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
    walkthrough?: {
        title: string;
        description: string;
        steps: Array<{ title: string; description: string }>;
        limitation: string;
    };
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
            "연결 관리와 상담방 참여를 분리해 복구 처리 개선",
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
            "실제 기기로 웹 절전·모바일 복귀·파일 선택 중 단절을 재현하고 복구 흐름 확인",
            "앱 개발자와 Bridge를 연동해 앱 복귀 시 연결 상태 확인",
            "연결이 끊긴 동안 변경된 메시지·상담 상태 재조회 및 복구 실패 시 안내",
            "서버 조회 캐시와 실시간 변경을 반영하는 상태 분리",
        ],
        walkthrough: {
            title: "앱으로 돌아왔을 때 상담 상태를 복구하는 흐름",
            description: "소켓만 다시 연결하면 연결이 끊긴 동안 추가된 메시지나 변경된 상담 상태가 화면에 반영되지 않을 수 있습니다. 재연결 후 서버 데이터를 다시 조회해 화면에 반영했습니다.",
            steps: [
                { title: "복귀와 단절 확인", description: "웹에서는 연결 상태를 확인했습니다. 모바일에서는 앱 개발자가 Bridge로 전달하는 백그라운드·포그라운드 정보를 받아 복구가 필요한지 판단했습니다." },
                { title: "인증과 연결 복구", description: "WebSocket 토큰을 새로 발급받아 재연결했습니다. 의도적으로 종료한 경우와 비정상 종료를 구분하고 중복 재연결을 방지했습니다." },
                { title: "상담방 참여와 데이터 복원", description: "현재 상담방에 다시 참여하고 서버 데이터를 조회했습니다. 연결이 끊긴 동안 추가된 메시지와 변경된 상담 상태를 화면에 반영했습니다." },
                { title: "사용자 행동에 맞춘 안내", description: "짧은 재연결 과정에서는 안내를 최소화했습니다. 메시지를 보내는 동안에는 전송 대기 상태를 표시하고 복구에 실패하면 새로고침을 안내했습니다." },
            ],
            limitation: "구현한 복구 과정을 정리했습니다. 복구 시간과 성공률은 별도로 측정하지 않았습니다.",
        },
        scope: "고객 상담 위젯과 ERP 상담 화면을 개발했습니다. 기존 Go·WebSocket 서버를 수정하고 공통 npm 패키지에 위젯을 추가했습니다. 12만 건은 서비스 시작 후 1년간 DB에 집계된 실제 상담 건수입니다.",
        overrides: {
            responsibilities: [
                "고객 상담 위젯과 ERP 관리자 주요 화면 설계·개발",
                "메시지·상담방·미확인 수·미리보기 실시간 동기화",
                "기존 공통 npm 패키지에 상담 위젯 추가 및 배포",
                "파일 업로드 API와 Presigned URL 기반 화면 흐름 구현",
                "모바일 앱 Bridge 연동·연결 복구 및 기존 Go 운영 API 개선",
                "외부 API 연동 함수 58개+와 관리자 UI 컴포넌트 43개 구현",
            ],
            challenges: [
                {
                    title: "연결 복구와 상담방 재참여",
                    problem:
                        "절전 상태나 모바일 앱 복귀, 파일 선택 후 연결이 끊기고 상담방 상태가 복구되지 않았습니다.",
                    action: "연결 관리와 상담방 참여 처리를 분리했습니다. Bridge로 앱 복귀 정보를 받고 토큰을 갱신해 재연결했습니다. 상담방에 다시 참여한 뒤 서버 데이터를 조회하도록 구현했습니다.",
                    result: "연결이 끊긴 동안 추가된 메시지와 변경된 상담 상태를 복구했습니다. 복구에 실패하면 새로고침을 안내했습니다.",
                },
                {
                    title: "조회 캐시와 실시간 상태 분리",
                    problem:
                        "REST 조회 결과와 WebSocket 이벤트를 함께 처리하면서 조회 캐시와 실시간 상태를 구분할 필요가 있었습니다.",
                    action: "조회와 변경 요청은 React Query로 관리했습니다. 메시지와 상담방 목록처럼 이벤트를 바로 반영할 상태는 Zustand로 분리했습니다.",
                    result: "조회 캐시와 실시간 상태를 나눠 관리하고 각 데이터의 갱신 방식을 정리했습니다.",
                },
                {
                    title: "여러 홈페이지에 일관된 위젯 제공",
                    problem: "공통 패키지의 코드를 변경하면 각 사이트에서 버전을 갱신하고 빌드·배포해야 했습니다. 전체 반영에는 최대 약 8시간이 걸릴 수 있었습니다. 문구나 프로필 같은 설정까지 코드에 두면 작은 변경에도 이 과정이 반복됩니다.",
                    action: "기존 공통 npm 패키지에 위젯을 추가했습니다. 사이트 식별 설정은 props로 받고 내부 상태는 Context와 Hook으로 관리했습니다. 자주 바뀌는 대표 문구와 프로필, 답변 설정은 서버에서 변경할 수 있게 했습니다.",
                    result: "문구와 프로필, 답변 설정은 사이트별 프론트엔드 재배포 없이 바꿀 수 있게 했습니다. 위젯 코드 변경에는 패키지 버전 갱신과 각 사이트의 배포가 필요합니다.",
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
            "발송 시점의 스냅샷으로 전달한 평가 결과 보존",
            "핵심 DB 저장과 WORKS 후속 알림 분리",
            "1,000명의 합성 평가 데이터 전체 DB 저장 확인",
        ],
        flow: [
            { label: "평가 입력", value: "Excel" },
            { label: "결과 매칭", value: "API" },
            { label: "시점별 보존", value: "Snapshot" },
            { label: "질문·답변 관리", value: "ERP" },
        ],
        architecture: [
            { label: "화면·API", value: "Next.js · React · 관리자와 구성원 화면" },
            { label: "데이터 보존", value: "PostgreSQL · Prisma · 발송 시점의 스냅샷" },
            { label: "후속 처리", value: "DB 저장 후 WORKS 알림 · 실패 재시도 및 로그" },
            { label: "업무 규칙", value: "대기 → 응답 중 → 완료 · 추가 질문·답변 저장" },
        ],
        quality: [
            "1,000명의 합성 평가 데이터 전체 DB 저장 확인",
            "Nginx 전송 한도와 Prisma 트랜잭션 제한 시간 조정",
            "알림 재시도·기존 알림 확인·실패 로그 추적",
            "Zod 입력 검증과 UTC 서버의 KST 날짜 처리",
        ],
        scope: "기존 ERP에 인사평가 기능을 추가하고 관련 화면과 API, 데이터 구조를 담당했습니다. 1,000명은 합성 평가 데이터의 DB 저장 테스트 규모입니다. 실제 1,000명의 알림 수신 여부는 검증하지 않았습니다.",
        overrides: {
            metrics: [
                { value: "Excel + ERP", label: "양식 유지 · 전달과 이의제기 통합" },
                { value: "1,000명", label: "합성 평가 데이터 DB 저장 검증" },
                { value: "13개", label: "이의제기 REST API" },
            ],
            challenges: [
                {
                    title: "평가 작업은 유지하고 전달·이의제기는 자동화",
                    problem: "평가 기준은 바뀌지만 개인별 결과 전달과 DM 이의제기 관리는 반복되는 업무였습니다. 평가 기준까지 시스템에 넣으면 기준이 바뀔 때마다 코드를 수정해야 할 수 있었습니다.",
                    action: "인사팀과 기획자에게 업무 흐름을 듣고 자동화할 범위를 정했습니다. 평가 기준과 계산은 기존 Excel 양식에 남겼습니다. 업로드한 결과를 구성원별로 연결해 전달하고 이의제기를 관리하는 기능을 개발했습니다.",
                    result: "기존 평가 방식을 유지하면서 결과 전달과 질문·답변을 ERP에서 관리할 수 있게 했습니다. 업로드는 해당 업무의 Excel 양식을 기준으로 구현했습니다.",
                },
                {
                    title: "현재 결과와 실제 전달한 결과를 구분",
                    problem: "Excel을 다시 업로드하거나 평가 결과를 수정해도 이미 전달한 결과는 기록으로 남아야 했습니다. 현재 값만 덮어쓰면 전달 당시의 결과를 확인하기 어렵습니다.",
                    action: "발송 시점의 결과를 별도 스냅샷으로 저장하도록 설계했습니다. 이의제기는 기획자와 논의해 한 번의 질문·답변 이후에도 추가 질문과 답변을 쌓을 수 있게 했습니다.",
                    result: "현재 입력 데이터와 발송 당시의 결과를 구분해 보존했습니다. 구성원은 전달받은 결과에 대해 추가 질문과 답변을 이어갈 수 있습니다.",
                },
                {
                    title: "평가 데이터 저장과 외부 알림 처리 분리",
                    problem: "대량 평가 처리 중 간헐적으로 오류가 발생했습니다. 업로드 한도와 DB 처리 시간, 외부 알림 처리 과정을 함께 확인해야 했습니다.",
                    action: "Nginx 전송 한도와 Prisma 트랜잭션 제한 시간을 조정했습니다. DB 저장과 WORKS 알림 처리를 분리하고 알림 재시도, 기존 알림 확인, 실패 로그 추적을 적용했습니다.",
                    result: "합성 데이터 테스트에서 1,000명의 평가 데이터가 모두 DB에 저장되는지 확인했습니다. 검증 범위는 데이터 저장이며 실제 1,000명의 알림 수신 여부까지 확인한 것은 아닙니다.",
                },
            ],
            responsibilities: [
                "인사팀·기획자와 자동화 범위 협의, Excel 결과 매칭과 개인별 전달 구현",
                "발송 결과 보존을 위한 스냅샷 구조 및 관리자·구성원 화면 설계",
                "이의제기 상태 관리·질문과 답변 목록·첨부파일·13개 API 개발",
                "DB 저장과 외부 알림 분리, 오류 추적과 재시도 개선",
            ],
        },
    },
    "snn-cms": {
        category: "사내 프로젝트 · 콘텐츠 관리",
        comparison: ["구축 과제", "구현 결과"],
        before: [
            "운영자가 기사와 주요 노출 영역을 직접 관리할 도구 필요",
            "기사와 기자·태그·첨부파일을 함께 저장할 구조 필요",
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
        scope: "뉴스 플랫폼에서 관리자 CMS의 DB 구조와 API, 화면 개발을 담당했습니다.",
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
            "기업·의료기관 2개 프로젝트의 관리자 기능 개발 · 고객사 사용 중",
            "관리 기능을 정의하고 화면·API·입력 검증 연결",
            "공통 모듈과 데이터 접근 계층을 후속 개발 기반으로 분리",
        ],
        flow: [
            { label: "관리 항목 결정", value: "운영 규칙" },
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
        scope: "기업·의료기관 홈페이지의 관리자 기능을 개발해 고객사가 사용하고 있습니다. 의료기관에서는 관리자 영역을 담당했고 기업 홈페이지에서는 일부 사용자 화면도 개발했습니다. 공통 보일러플레이트는 목데이터를 사용합니다. 실제 DB 연결과 콘텐츠 기능은 프로젝트별로 구현합니다.",
        overrides: {
            metrics: [
                { value: "2개", label: "기업·의료기관 관리자 시스템 개발" },
                { value: "실사용", label: "고객사 운영 중" },
                { value: "공통 모듈", label: "인증·권한·UI·업로드 기반 분리" },
            ],
        },
    },
    "recruitment": {
        category: "사내 서비스 · 채용 업무",
        comparison: ["구축 과제", "구현 결과"],
        before: ["5단계 지원서의 입력 보존과 검증 필요", "지원서 제출·첨부파일·관리자 검토 흐름 연결", "지원자 검색과 중복 확인, 검토 상태 관리 필요"],
        after: ["공개 화면부터 지원서·제출 API·관리자 기능 개발", "sessionStorage 입력 보존과 단계별 검증 적용", "지원자 검색·날짜 필터·읽음·합격 상태 관리 구현"],
        flow: [
            { label: "공고·작성", value: "공개 화면" },
            { label: "입력·검증", value: "5단계 지원서" },
            { label: "첨부·접수", value: "제출 API" },
            { label: "검색·상태", value: "관리자 검토" },
        ],
        architecture: [
            { label: "지원자 화면", value: "공개 채용 화면 · 5단계 지원서" },
            { label: "입력 보존", value: "sessionStorage · 단계별 검증" },
            { label: "서버 처리", value: "제출 API · 기존 암·복호화 방식 · S3 첨부파일" },
            { label: "관리자 업무", value: "검색 · 날짜 필터 · 중복 지원 확인 · 읽음·합격 상태" },
        ],
        quality: [
            "지원서 입력 보존과 단계별 검증 구현",
            "기존 암·복호화 방식과 S3 첨부파일 처리 흐름 적용",
            "읽음·합격 상태와 중복 지원 확인을 포함한 관리자 검토 흐름 구현",
        ],
        scope: "디자이너와 협업해 공개 채용 화면과 지원서, 제출 API, 관리자 기능을 개발했습니다. 개인정보와 첨부파일 처리는 기존 암·복호화 방식과 S3 업로드 방식을 따랐습니다. 월평균 공고·지원서 수는 시스템의 운영 규모입니다.",
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
            "상담 신청 흐름의 출시 전 내부 테스트 수행",
            "사용자 상담 신청과 관리자 질문지 기능 구현",
            "회사 일정으로 외부 출시 보류",
        ],
        scope: "사용자·관리자 화면을 개발하고 API·DB 개선에 참여했습니다. 일부 서비스는 내부 테스트까지 완료했으며 회사 일정으로 외부 출시가 보류된 상태입니다.",
        overrides: {
            challenges: [
                {
                    title: "상황 입력부터 상담 신청까지 구현",
                    problem:
                        "사용자가 상황을 입력하고 질문지에 답한 뒤 변호사를 선택해 상담을 신청할 수 있어야 했습니다.",
                    action: "상황 입력과 질문지 응답, 변호사 선택, 상담 신청 화면을 개발했습니다.",
                    result: "상담 신청 흐름을 내부 테스트했습니다.",
                },
                {
                    title: "사용자와 관리자 기능 연결",
                    problem: "사용자가 답하는 질문 구성을 운영자가 관리할 수 있어야 했습니다.",
                    action: "관리자 질문지 기능을 개발하고 API Routes와 PostgreSQL 데이터 구조 개선에 참여했습니다.",
                    result: "운영자가 사용자에게 표시할 질문 구성을 관리할 수 있도록 했습니다.",
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
            { label: "기존 인프라", value: "Jenkins · Amazon ECR · Kubernetes · Kafka" },
        ],
        quality: [
            "개발 서버에서 알림 API와 DB 저장 확인",
            "미인증 요청의 401 응답 검증",
            "Kafka 이벤트 수신과 사용자 데이터 반영 확인",
            "이미지 빌드부터 재배포까지 실행 흐름 검증",
        ],
        scope: "이미 구축된 VPC·Kubernetes·Jenkins·Kafka 환경에서 알림 API와 사용자 정보 동기화, 해당 서비스의 배포 구성을 담당했습니다. 현재 개발 서버 QA 단계이며 운영 트래픽 전환 전입니다. 인사평가 API의 이관 코드는 작성 중입니다.",
        overrides: {
            metrics: [
                { value: "Spring Boot", label: "알림 서비스 API 구현" },
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
