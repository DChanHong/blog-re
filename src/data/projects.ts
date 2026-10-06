import type { CareerProject } from "@/types/portfolio";

export const projectsData: CareerProject[] = [
    {
        id: "realtime-support",
        title: "대륜톡 — 실시간 상담 플랫폼",
        subtitle: "약 80개 홈페이지의 고객 상담을 ERP에서 관리하는 플랫폼",
        period: "2025.04 ~ 현재",
        role: "상담 위젯·ERP 콘솔 화면 개발 · 기존 Go 서버 운영 및 기능 개선",
        status: "운영 중",
        featured: true,
        summary:
            "약 80개 홈페이지에서 사용하는 고객 상담 위젯과 ERP 상담 콘솔을 개발했습니다. 실시간 변경을 화면에 반영하고 연결이 끊겼을 때 상담 상태를 복구하도록 했습니다. 이후 기존 Go 서버의 파일 업로드 API도 개발했습니다.",
        background:
            "기존 채널톡은 비용과 기능 확장, ERP 연계에 제약이 있었습니다. 여러 홈페이지에서 같은 상담 위젯을 사용하고 상담원이 ERP에서 상담을 관리할 수 있는 자체 플랫폼이 필요했습니다.",
        metrics: [
            { value: "약 80개", label: "상담 위젯 적용 홈페이지" },
            { value: "12만 건+", label: "서비스 시작 후 1년간 실제 상담 · DB 집계" },
            { value: "서버 설정", label: "사이트별 재배포 없이 문구·프로필·답변 설정 변경" },
        ],
        responsibilities: [
            "고객 채팅 위젯과 ERP 상담 관리자 주요 화면 설계·개발",
            "메시지·상담방·미확인 수·미리보기의 실시간 변경 반영",
            "기존 공통 npm 패키지에 상담 위젯 추가 및 배포",
            "Presigned URL 기반 파일 업로드와 썸네일 처리 상태 표시",
            "모바일 앱 복귀 시 Bridge로 연결 상태 확인 및 재연결",
            "기존 Go 서버의 운영 API·이벤트 응답 개선 및 AI API 연동",
            "외부 API 연동 함수 58개+와 관리자 UI 컴포넌트 43개 구현",
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
                action: "WebSocket 연결 관리와 상담방 참여 처리를 분리했습니다. 비정상 종료 시 연결을 재시도하고 소켓을 교체한 뒤 현재 상담방에 다시 참여하도록 했습니다.",
                result: "재연결 후 상담방 상태를 복구하고 화면에 연결 상태를 표시했습니다. 복구에 실패하면 새로고침을 안내했습니다.",
            },
            {
                title: "서버 상태와 실시간 UI 상태의 경계",
                problem:
                    "REST로 조회한 데이터와 WebSocket 이벤트를 한 저장소에서 관리해 조회 캐시와 실시간 변경 처리를 구분하기 어려웠습니다.",
                action: "조회와 변경 요청은 React Query로 관리했습니다. 메시지와 상담방 목록, 미리보기처럼 이벤트를 즉시 반영해야 하는 상태는 Zustand로 분리했습니다.",
                result: "조회 캐시와 실시간 상태를 나눠 관리하고 상담방 전환 시 데이터를 동기화하는 과정을 정리했습니다.",
            },
            {
                title: "다수 홈페이지의 배포 일관성",
                problem:
                    "여러 홈페이지에서 같은 위젯을 사용하므로 기능 추가와 오류 수정을 공통으로 관리할 방법이 필요했습니다.",
                action: "기존 공통 npm 패키지에 위젯을 추가했습니다. 사이트별 설정은 props로 받고 내부 API와 소켓, 사용자 상태는 Context와 Hook으로 관리했습니다.",
                result: "약 80개 Next.js 홈페이지의 상담 기능을 공통 패키지로 관리했습니다. 코드 변경 시에는 각 사이트의 패키지 버전을 갱신하고 배포해야 합니다.",
            },
        ],
        achievements: [
            "약 80개 홈페이지에 고객 상담 위젯 적용",
            "외부 상담 서비스 대신 사내 업무에 맞춘 상담 기능 개발",
            "고객 위젯과 관리자 콘솔에 파일 첨부·AI 답변 기능 연동",
            "실제 운영 문제를 재현해 데스크톱·WebView 연결 복구 개선",
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
            "처음에는 메시지를 실시간으로 주고받는 기능에 집중했습니다. 운영하면서 연결이 끊긴 동안의 메시지와 상담 상태를 복구하는 일이 중요하다는 것을 알게 됐습니다. 다시 설계한다면 연결 관리와 상담방 참여, 모바일 앱 복귀와 복구 실패 안내를 초기 요구사항에 포함하겠습니다.",
        scopeNote:
            "기존 Go 백엔드와 WebSocket 서버의 구조를 확인해 신규 엔드포인트와 운영 API를 개발했습니다. 파일 업로드와 AI 연동에 필요한 서버 기능도 수정했습니다.",
    },
    {
        id: "snn-cms",
        title: "SNN 뉴스 플랫폼 관리자 CMS",
        subtitle: "기사 작성부터 메인 노출까지 연결한 콘텐츠 운영 시스템",
        period: "2024.11 ~ 2025.03",
        role: "관리자 화면·API 개발 및 DB 설계",
        status: "완료",
        featured: false,
        summary:
            "기사와 기자, 카테고리를 관리하는 뉴스 CMS를 개발했습니다. 배너와 검색 키워드, 관리자 권한도 같은 시스템에서 설정할 수 있도록 했습니다.",
        background:
            "운영자가 기사와 메인 노출 영역을 직접 관리할 도구가 필요했습니다. 기획서를 바탕으로 필요한 데이터와 관계를 정리하고 DB 구조와 관리자 화면, API를 개발했습니다.",
        metrics: [
            { value: "DB · API · UI", label: "DB · API · UI 연결" },
            { value: "Transaction", label: "기사와 관계 데이터 함께 저장" },
            { value: "WebP", label: "이미지 최적화" },
        ],
        responsibilities: [
            "기사, 카테고리, 기자, 첨부파일, 권한 중심의 PostgreSQL 관계 구조 설계·개선",
            "Prisma 기반 기사 등록·조회·수정·삭제 및 관계 데이터 조회 API 개발",
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
                title: "기사와 관계 데이터 함께 저장",
                problem:
                    "기사를 저장할 때 본문과 여러 기자, 관련 기사, 태그, 첨부파일 정보가 함께 바뀝니다. 일부만 저장되면 데이터가 서로 맞지 않을 수 있었습니다.",
                action: "Prisma 트랜잭션으로 기사와 관계 데이터를 함께 저장하도록 했습니다. 기사 수정과 삭제 시 관련 데이터를 처리하는 방식도 정리했습니다.",
                result: "기사와 관련 데이터가 일부만 저장되는 일을 방지하고 수정·삭제 API의 처리 기준을 정했습니다.",
            },
            {
                title: "원본 품질과 렌더링 성능의 균형",
                problem:
                    "모든 기사 이미지에 같은 변환 규칙을 적용하면 필요한 품질이 떨어지거나 파일 용량이 불필요하게 커질 수 있었습니다.",
                action: "sharp로 이미지를 WebP로 변환하고 썸네일은 별도로 등록할 수 있게 했습니다. 이미지의 용도와 중요도에 따라 처리 방식을 나눴습니다.",
                result: "이미지 용도에 맞춰 원본과 썸네일을 처리하고 뉴스 화면에서 사용할 이미지를 제공했습니다.",
            },
        ],
        achievements: [
            "기획 요구사항을 바탕으로 관리자 CMS의 DB·API·화면 개발",
            "운영자가 기사와 메인 노출 영역을 직접 관리하는 기능 구현",
            "기사·관계 데이터의 트랜잭션 저장 및 이미지 처리 방식 정리",
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
            "뉴스와 오피니언을 나눠 저장했을 때 검색 쿼리가 복잡해져 동료와 논의한 뒤 공통 콘텐츠 모델로 통합했습니다. 이 경험을 통해 데이터 구조를 정할 때 화면뿐 아니라 검색과 노출, 운영 중 수정 방식도 함께 살펴봐야 한다는 것을 배웠습니다.",
    },
    {
        id: "erp-groupware",
        title: "인사평가 배포·이의제기 시스템",
        subtitle: "평가 결과 전달과 이의제기를 연결한 ERP 업무 시스템",
        period: "2026.02 ~ 2026.03 · 이후 유지보수",
        role: "인사팀·기획자와 요구사항 협의 · 화면·API·DB 설계 및 개발",
        status: "운영 중",
        featured: true,
        summary:
            "개인별 Excel 파일로 전달하던 평가 결과를 ERP에서 조회하도록 했습니다. DM으로 받던 이의제기도 ERP에서 관리할 수 있게 했습니다. 발송 시점의 결과를 보존하는 데이터 구조와 화면·API를 개발하고 대량 저장과 외부 알림 처리를 개선했습니다.",
        background:
            "인사팀은 개인별 Excel 파일을 만들어 전달하고 DM으로 이의제기를 받았습니다. 평가 기준 변경에는 기존 Excel 작업이 적합해 양식을 유지했습니다. 대신 업로드한 평가 결과를 구성원별로 연결하고 전달하는 작업과 이의제기 관리를 ERP에서 처리하도록 했습니다.",
        metrics: [
            { value: "Excel + ERP", label: "평가 양식 유지 · 결과 전달과 이의제기 관리" },
            { value: "1,000명", label: "합성 평가 데이터 전체 DB 저장 확인" },
            { value: "13개", label: "이의제기 REST API" },
            { value: "3단계", label: "대기·응답 중·완료 상태 관리" },
            { value: "상시", label: "운영 요청 대응" },
        ],
        responsibilities: [
            "인사팀·기획자와 자동화 범위 협의 및 Excel 결과 매칭·개인별 전달 구현",
            "발송 시점의 평가 결과를 보존하는 스냅샷 구조 설계",
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
                title: "전달한 평가 결과 보존과 추가 질문",
                problem: "평가 결과가 수정돼도 구성원에게 이미 전달한 결과는 남아 있어야 했습니다. 이의제기도 한 번의 질문·답변 이후 추가 질문을 주고받을 수 있어야 했습니다.",
                action: "발송 시점의 결과를 별도 스냅샷으로 보존하도록 설계했습니다. 기획자와 논의해 추가 질문과 답변을 쌓을 수 있는 메시지 구조도 만들었습니다.",
                result: "전달 당시의 평가 결과를 보존하고 해당 결과에 대한 질문과 답변을 이어갈 수 있게 했습니다.",
            },
            {
                title: "대량 저장과 외부 알림 처리 분리",
                problem: "인사팀으로부터 대량 평가 처리 중 간헐적인 오류가 보고됐습니다.",
                action: "Nginx 전송 한도와 Prisma 트랜잭션 제한 시간을 조정했습니다. DB 저장 후 WORKS 알림을 보내도록 처리를 분리하고 재시도와 기존 알림 확인, 실패 로그 추적을 적용했습니다.",
                result: "합성 데이터 테스트에서 1,000명의 평가 데이터가 모두 DB에 저장되는지 확인했습니다. 개선 후 실제 사용에서도 같은 오류가 재발하지 않았습니다. 검증 범위는 데이터 저장이며 실제 1,000명의 알림 수신 여부까지 확인한 것은 아닙니다.",
            },
        ],
        achievements: [
            "Excel 파일 하나를 업로드해 평가 결과 전달과 ERP 이의제기 관리",
            "1,000명 합성 평가 데이터의 DB 저장 확인 및 운영 오류 개선",
            "평가 결과 조회·이의제기 화면과 관련 API·DB 개발",
            "기존 ERP에 기능 추가 및 운영 오류 대응",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Nginx", "Zod", "AWS S3"],
        scopeNote:
            "기존 ERP의 인사평가 기능을 설계하고 개발했습니다. 1,000명은 합성 평가 데이터의 DB 저장 테스트 규모입니다. 사이드바 개인화와 AICC 화면 등 기존 ERP 유지보수도 담당했습니다.",
    },
    {
        id: "recruitment",
        title: "채용사이트·관리자 시스템 개편",
        subtitle: "지원서 작성·제출과 지원자 검토를 관리하는 채용 시스템",
        period: "2023.11 · 약 3주 개발 후 유지보수",
        role: "디자이너 협업 · 공개 화면·지원서·제출 API·관리자 기능 개발",
        status: "운영 중",
        featured: false,
        summary: "디자이너와 협업해 공개 채용 화면과 5단계 지원서, 제출 API, 관리자 기능을 개발했습니다. 작성 중 입력을 보존하고 단계별로 검증했습니다. 관리자는 지원자를 검색하고 검토 상태를 관리할 수 있도록 했습니다.",
        background: "지원자는 여러 단계의 지원서를 작성해 제출하고 관리자는 접수된 지원서를 찾아 검토할 수 있어야 했습니다. 채용 공고 확인부터 지원서 제출과 검토까지 필요한 기능을 개발했습니다.",
        metrics: [
            { value: "5단계", label: "입력 보존·단계별 검증을 적용한 지원서" },
            { value: "약 6~7개", label: "월평균 관리 공고 · 운영 규모" },
            { value: "약 100건", label: "월평균 접수 지원서 · 운영 규모" },
        ],
        responsibilities: [
            "디자이너와 협업해 공개 채용 화면과 지원서 작성 UI 개발",
            "5단계 지원서의 sessionStorage 입력 보존과 단계별 검증 구현",
            "지원서 제출 API와 기존 암·복호화 방식 적용",
            "S3 기반 첨부파일 처리 흐름 연결",
            "지원자 검색·날짜 필터·중복 지원 확인 기능 구현",
            "읽음·합격 상태를 관리하는 관리자 기능 개발",
        ],
        challenges: [
            {
                title: "작성 중 입력 보존과 검증",
                problem: "지원서가 5단계로 나뉘어 있어 작성 중 입력한 내용을 유지하고 각 단계의 필수 값과 형식을 확인해야 했습니다.",
                action: "sessionStorage에 입력 내용을 보존하고 단계별 검증을 적용했습니다. 제출 API는 기존 암·복호화 방식과 S3 첨부파일 처리 방식을 사용했습니다.",
                result: "작성한 지원서와 첨부파일을 제출 API로 접수할 수 있도록 구현했습니다.",
            },
            {
                title: "접수한 지원서 검색과 검토",
                problem: "관리자가 지원서를 검색하고 중복 지원 여부를 확인할 수 있어야 했습니다. 읽음 여부와 합격 상태도 관리해야 했습니다.",
                action: "지원자 검색과 날짜 필터를 적용했습니다. 중복 지원 확인과 읽음 여부, 합격 상태 관리 기능도 만들었습니다.",
                result: "월평균 약 6~7개 공고와 약 100건의 지원서를 한 시스템에서 검토하고 관리할 수 있게 했습니다. 수치는 해당 시스템의 운영 규모입니다.",
            },
        ],
        achievements: ["공개 화면·지원서·제출 API·관리자 기능 통합 개발", "약 3주 개발 후 유지보수"],
        techStack: ["Next.js", "React", "sessionStorage", "AWS S3"],
        scopeNote: "공개 채용 화면과 지원서, 제출 API, 관리자 기능을 담당했습니다. 개인정보와 첨부파일 처리는 기존 암·복호화 방식과 S3 파일 저장 방식을 따랐습니다.",
    },
    {
        id: "legal-platform",
        title: "법률 상담 유입 및 변호사 플랫폼",
        subtitle: "상황 입력과 질문지 응답을 거쳐 상담을 신청하는 서비스",
        period: "2023 ~ 2024",
        role: "사용자·관리자 화면 개발 및 API·DB 개선 참여",
        status: "출시 보류",
        featured: false,
        summary:
            "상황 입력과 질문지 응답, 변호사 선택, 상담 신청 화면을 개발했습니다. 운영자가 질문 구성을 관리하는 관리자 기능도 맡았습니다.",
        background:
            "사용자와 변호사를 연결하는 상담 서비스입니다. 하나의 Next.js 프로젝트에서 화면과 API Routes, 데이터 처리와 외부 알림 연동을 함께 다뤘습니다.",
        metrics: [
            { value: "사용자·관리자", label: "사용자 화면 및 관리자 기능 개발" },
            { value: "API Routes", label: "API·데이터 구조 개선 참여" },
            { value: "내부 테스트", label: "출시 전 검증 완료" },
        ],
        responsibilities: [
            "상황 입력·질문지 응답·변호사 선택·상담 신청 화면 개발",
            "운영자가 질문 구성을 관리하는 관리자 질문지 기능 구현",
            "Next.js API Routes 기반 API와 PostgreSQL 데이터 구조 개선 참여",
            "로그인, 정적 페이지, 사용자·관리자 화면 개발",
            "푸시 알림·알림톡·NCP 등 외부 서비스 연동",
        ],
        challenges: [],
        achievements: [
            "사용자·관리자 화면 개발 및 API·DB 개선 참여",
            "화면에서 API·DB·외부 알림까지 처리 과정 확인",
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
            "일부 서비스는 내부 테스트까지 완료했습니다. 회사 일정으로 외부 출시가 보류된 상태입니다.",
    },
    {
        id: "admin-platform",
        title: "외주 관리자 시스템과 공통 개발 기반",
        subtitle: "기업·의료기관의 관리자 기능 개발과 공통 모듈 분리",
        period: "2026.06 ~ 현재",
        role: "관리자 기능·운영 규칙 협의 · 화면·API 개발 · 공통 모듈 제작",
        status: "운영 중",
        featured: true,
        summary:
            "기업·의료기관 홈페이지의 관리자 화면과 API를 개발해 고객사가 사용하고 있습니다. 관리할 항목과 처리 규칙을 정하고 인증·권한·업로드·공통 UI는 후속 프로젝트에서도 사용할 수 있도록 보일러플레이트로 분리했습니다.",
        background:
            "관리자 기획서가 명확하지 않아 디자인을 보고 편집 가능한 항목과 처리 규칙을 정해야 했습니다. PM과 함께 고객사 요청을 확인하고 중간 배포본을 검수받아 피드백을 반영했습니다.",
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
                title: "디자인을 바탕으로 관리 항목과 규칙 결정",
                problem: "디자인만으로는 어떤 항목을 수정할 수 있는지, 상담과 게시물을 어떻게 처리해야 하는지 알기 어려웠습니다.",
                action: "상담 상태와 메모, 검색과 블랙리스트 처리 방식을 정했습니다. 이벤트 기간과 게시 여부, 의료진 정보의 편집 범위도 정리해 화면과 API로 구현했습니다.",
                result: "고객사가 중간 배포본에서 관리 기능을 확인하도록 하고 검수 중 나온 추가 요청을 반영했습니다.",
            },
            {
                title: "반복되는 관리자 기능을 공통 모듈로 분리",
                problem: "외주 프로젝트마다 인증과 권한, 파일 업로드, 공통 화면을 다시 구현해야 했습니다.",
                action: "반복되는 기능을 공통 보일러플레이트로 분리했습니다. 목데이터를 실제 DB 연결로 교체할 수 있도록 데이터 접근 계층을 나누고 사용 가이드를 작성했습니다.",
                result: "후속 관리자 프로젝트의 초기 구성에 사용하고 있습니다. 각 프로젝트의 콘텐츠 기능과 실제 DB 연결은 별도로 구현합니다.",
            },
        ],
        achievements: [
            "기업·의료기관 두 프로젝트의 관리자 기능을 개발해 고객사에서 실제 사용 중",
            "편집할 항목과 처리 규칙을 정해 관리자 화면·API 개발",
            "인증·권한·계정·로그·UI·업로드 기능을 공통 모듈로 분리",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Prisma", "Zod", "React Hook Form", "Vercel"],
        scopeNote:
            "기업·의료기관 두 프로젝트의 관리자 시스템을 개발해 고객사가 사용하고 있습니다. 의료기관에서는 관리자 영역을 담당했고 기업 홈페이지에서는 일부 사용자 화면도 개발했습니다. 별도의 후속 프로젝트는 초기 구성 중입니다. 공통 보일러플레이트는 목데이터를 사용하며 프로젝트마다 실제 DB 연결이 필요합니다.",
    },
    {
        id: "spring-msa",
        title: "Spring Boot 서비스 이관과 Kubernetes 배포",
        subtitle: "알림 기능 이관과 사용자 정보 동기화 · 개발 서버 검증",
        period: "2026 · 진행 중",
        role: "알림 서비스 이관 · Kafka 연동 · 서비스 배포 구성 및 개발 서버 QA",
        status: "이관 진행 중",
        featured: true,
        summary:
            "기존 백엔드의 알림 기능을 Spring Boot 서비스로 이관하고 Kafka로 사용자 정보를 동기화했습니다. 서비스의 Helm·ArgoCD 배포 구성을 추가해 Kubernetes 개발 서버에서 기능과 재배포를 확인했습니다. 운영 트래픽 전환 전 단계입니다.",
        background:
            "기존 Next.js 백엔드를 Java·Spring Boot 서비스로 나누는 팀 프로젝트입니다. 이미 구축된 Kubernetes와 CI/CD 환경을 사용해 알림 서비스를 구현하고 개발 서버에서 동작과 배포 과정을 확인했습니다.",
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
                title: "사용자 변경 정보를 알림 서비스에 반영",
                problem: "다른 서비스에서 사용자 정보가 변경되면 알림 서비스의 사용자 정보도 갱신해야 했습니다.",
                action: "Kafka로 사용자 변경 이벤트를 받아 알림 서비스의 사용자 정보 테이블에 반영하도록 구현했습니다.",
                result: "개발 서버에서 Kafka 메시지 수신과 데이터 반영을 확인했습니다.",
            },
            {
                title: "개발 서버에서 기능과 재배포 확인",
                problem: "새 알림 서비스를 기존 Kubernetes와 CI/CD 환경에 배포하고 기능이 동작하는지 확인해야 했습니다.",
                action: "서비스의 Helm·ArgoCD 구성을 추가했습니다. Jenkins 빌드와 이미지 생성을 확인하고 배포 후 API 응답과 DB 저장, 인증 처리를 검사했습니다.",
                result: "개발 서버에서 알림 기능과 미인증 요청의 401 응답을 확인했습니다. 변경 후 다시 빌드하고 배포하는 과정도 검증했습니다.",
            },
        ],
        achievements: ["알림 도메인의 Spring Boot API 및 Kafka 동기화 구현", "서비스 단위 배포 구성 추가와 개발 서버 기능·재배포 검증"],
        techStack: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Kubernetes", "Helm", "ArgoCD", "Jenkins", "Amazon ECR"],
        scopeNote:
            "이미 구축된 VPC·Kubernetes·Jenkins·Kafka 환경에서 알림 서비스와 해당 서비스의 배포 구성을 담당했습니다. 현재 개발 서버 QA 단계이며 운영 트래픽 전환 전입니다. 인사평가 API의 이관 코드는 작성 중입니다.",
    },
];

export function getProjectBySlug(slug: string): CareerProject | undefined {
    return projectsData.find((project) => project.id === slug);
}
