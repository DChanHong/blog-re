export const SEO_CONFIG = {
    siteUrl: "https://portfolio.dev-hong.it.kr",
    siteName: "성찬홍의 포트폴리오",
    authorName: "성찬홍",
    title: {
        default: "성찬홍 | Web Developer",
        template: "%s | 성찬홍",
    },
    description: "웹 개발자 성찬홍의 포트폴리오입니다. 고객 상담 서비스와 사내 업무 시스템을 개발하며 해결한 문제와 개발 기록을 소개합니다.",
    locale: "ko_KR",
    defaultOgImage: {
        path: "/og/portfolio-s.png",
        width: 1200,
        height: 630,
        alt: "SUNGCHANHONG — Web Developer 성찬홍의 포트폴리오",
    },
    robots: {
        index: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        noIndex: "noindex, nofollow",
    },
} as const;

export const SITE_URL = new URL(SEO_CONFIG.siteUrl);
