import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getCanonicalUrl, SEO_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
    title: "API Docs",
    description: "개발 확인용 API 문서입니다.",
    alternates: {
        canonical: getCanonicalUrl("/api-docs"),
    },
    robots: SEO_CONFIG.robots.noIndex,
};

interface ApiDocsLayoutProps {
    children: ReactNode;
}

export default function ApiDocsLayout({ children }: ApiDocsLayoutProps) {
    return children;
}
