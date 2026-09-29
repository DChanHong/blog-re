import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
    children: ReactNode;
    outerClassName?: string;
    innerClassName?: string;
}

export default function PageContainer({
    children,
    outerClassName,
    innerClassName,
}: PageContainerProps) {
    return (
        <div className={outerClassName}>
            <div className={cn("portfolio-container page-content", innerClassName)}>{children}</div>
        </div>
    );
}
