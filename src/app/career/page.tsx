import { Metadata } from "next";
import { Suspense } from "react";
import CareerPage from "./CareerPage";
import PageContainer from "@/components/layout/PageContainer";
import { SparklesCore } from "@/components/ui/sparkles";

// 정적 페이지로 생성
export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "성찬홍 경력 | Chanhong Studio",
    description: "성찬홍의 개발 경력과 프로젝트 이력을 소개합니다.",
    keywords: ["성찬홍", "개발자", "경력", "프로젝트", "포트폴리오"],
    openGraph: {
        title: "성찬홍 경력 | Chanhong Studio",
        description: "성찬홍의 개발 경력과 프로젝트 이력을 소개합니다.",
        type: "website",
        locale: "ko_KR",
    },
    twitter: {
        card: "summary_large_image",
        title: "성찬홍 경력 | Chanhong Studio",
        description: "성찬홍의 개발 경력과 프로젝트 이력을 소개합니다.",
    },
};

/**
 * Career 페이지 - 서버 컴포넌트
 *
 * 성찬홍의 경력 정보를 보여주는 페이지입니다.
 * 메타데이터와 SEO 최적화를 위한 서버 컴포넌트로 구성되어 있습니다.
 */
export default function Career() {
    return (
        <>
            {/* SparklesCore 배경 */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-black">
                <SparklesCore
                    id="tsparticlescareer"
                    background="black"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <PageContainer outerClassName="min-h-[calc(100vh)] relative z-10">
                <Suspense
                    fallback={
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    }
                >
                    <CareerPage />
                </Suspense>
            </PageContainer>
        </>
    );
}
