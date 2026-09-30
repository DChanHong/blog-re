export const SEO_CONFIG = {
    siteUrl: "https://blog.dev-hong.it.kr",
    siteName: "성찬홍의 포트폴리오",
    authorName: "성찬홍",
    title: {
        default: "성찬홍 | 프론트엔드 엔지니어",
        template: "%s | 성찬홍",
    },
    description: "성찬홍의 이력에 대한 정보",
    locale: "ko_KR",
    defaultOgImage: {
        path: "/og_front.png",
        width: 1200,
        height: 630,
        alt: "성찬홍의 포트폴리오 썸네일",
    },
    robots: {
        index: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        noIndex: "noindex, nofollow",
    },
} as const;

export const SITE_URL = new URL(SEO_CONFIG.siteUrl);
