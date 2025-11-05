import { ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
    /** 외부 컨테이너 클래스명 (기본값: "min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-blue-50") */
    outerClassName?: string;
    /** 내부 컨테이너 클래스명 (기본값: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-12") */
    innerClassName?: string;
}

/**
 * PageContainer - 페이지 공통 레이아웃 컨테이너
 *
 * 페이지의 기본 레이아웃 구조를 제공합니다.
 * 외부/내부 컨테이너의 스타일을 props로 커스터마이징할 수 있습니다.
 */
export default function PageContainer({
    children,
    outerClassName = "min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-blue-50",
    innerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px] pb-12",
}: PageContainerProps) {
    return (
        <div className={outerClassName}>
            <div className={innerClassName}>{children}</div>
        </div>
    );
}
