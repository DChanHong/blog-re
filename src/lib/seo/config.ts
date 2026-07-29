export const SEO_CONFIG = {
    siteUrl: "https://blog.dev-hong.it.kr",
    siteName: "성찬홍's Info",
    authorName: "성찬홍",
    title: {
        default: "성찬홍 | 프론트엔드 엔지니어",
        template: "%s | Chanhong Studio",
    },
    description: "성찬홍의 이력에 대한 정보",
    locale: "ko_KR",
    defaultOgImage: {
        path: "/og_front.png",
        width: 1200,
        height: 630,
        alt: "성찬홍's Info 썸네일",
    },
    robots: {
        index: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        noIndex: "noindex, nofollow",
    },
} as const;

export const SITE_URL = new URL(SEO_CONFIG.siteUrl);
