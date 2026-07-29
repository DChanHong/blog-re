import { SEO_CONFIG } from "./config";
import { absoluteUrl, cleanJsonLdText, getCanonicalUrl } from "./utils";

export type JsonLdSchema = Record<string, unknown>;

interface BreadcrumbItem {
    name: string;
    path: string;
}

interface PageJsonLdInput {
    url: string;
    name: string;
    description: string;
    imageUrl?: string;
}

interface ArticleJsonLdInput extends PageJsonLdInput {
    publishedTime: string;
    modifiedTime: string;
    tags: string[];
    wordCount?: number;
}

const LANGUAGE = "ko-KR";

// JSON-LD 객체끼리 서로 참조할 수 있도록 canonical URL 기반의 안정적인 @id를 만든다.
function hashId(url: string, hash: string) {
    return `${url.replace(/#.*$/, "")}#${hash}`;
}

// 여러 Schema.org 객체를 하나의 @graph JSON-LD 문서로 묶는다.
export function createJsonLdGraph(schemas: JsonLdSchema[]) {
    return {
        "@context": "https://schema.org",
        "@graph": schemas,
    };
}

// 사이트 소유자/브랜드 정보를 표현하는 Organization 스키마를 만든다.
export function createOrganizationJsonLd(): JsonLdSchema {
    const siteUrl = getCanonicalUrl("/");
    const imageUrl = absoluteUrl(SEO_CONFIG.defaultOgImage.path);

    return {
        "@type": "Organization",
        "@id": hashId(siteUrl, "organization"),
        name: SEO_CONFIG.siteName,
        url: siteUrl,
        image: imageUrl,
        logo: imageUrl,
        description: cleanJsonLdText(SEO_CONFIG.description),
        founder: {
            "@type": "Person",
            name: SEO_CONFIG.authorName,
        },
    };
}

// 홈 페이지에 사용할 WebSite 스키마를 만들고, 블로그 검색 액션을 연결한다.
export function createWebSiteJsonLd(): JsonLdSchema {
    const siteUrl = getCanonicalUrl("/");

    return {
        "@type": "WebSite",
        "@id": hashId(siteUrl, "website"),
        url: siteUrl,
        name: SEO_CONFIG.siteName,
        description: cleanJsonLdText(SEO_CONFIG.description),
        inLanguage: LANGUAGE,
        publisher: {
            "@id": hashId(siteUrl, "organization"),
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${absoluteUrl("/blog")}?search={search_term_string}`,
            },
            "query-input": {
                "@type": "PropertyValueSpecification",
                valueName: "search_term_string",
            },
        },
    };
}

// 현재 페이지 위치를 검색엔진에 전달하는 BreadcrumbList 스키마를 만든다.
export function createBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdSchema {
    const currentUrl = getCanonicalUrl(items[items.length - 1]?.path || "/");

    return {
        "@type": "BreadcrumbList",
        "@id": hashId(currentUrl, "breadcrumb"),
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: cleanJsonLdText(item.name),
            item: getCanonicalUrl(item.path),
        })),
    };
}

// 페이지 대표 이미지를 구조화 데이터에서 참조할 수 있는 ImageObject로 만든다.
export function createImageObjectJsonLd({
    url,
    name,
    imageUrl = SEO_CONFIG.defaultOgImage.path,
}: PageJsonLdInput): JsonLdSchema {
    const canonicalUrl = getCanonicalUrl(url);
    const absoluteImageUrl = absoluteUrl(imageUrl);

    return {
        "@type": "ImageObject",
        "@id": hashId(canonicalUrl, "primaryimage"),
        url: absoluteImageUrl,
        contentUrl: absoluteImageUrl,
        width: SEO_CONFIG.defaultOgImage.width,
        height: SEO_CONFIG.defaultOgImage.height,
        caption: cleanJsonLdText(name),
        inLanguage: LANGUAGE,
    };
}

// 일반 정적 페이지에 사용할 WebPage 스키마를 만든다.
export function createWebPageJsonLd({
    url,
    name,
    description,
    imageUrl,
}: PageJsonLdInput): JsonLdSchema {
    const canonicalUrl = getCanonicalUrl(url);

    return {
        "@type": "WebPage",
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: cleanJsonLdText(name),
        description: cleanJsonLdText(description),
        inLanguage: LANGUAGE,
        isPartOf: {
            "@id": hashId(getCanonicalUrl("/"), "website"),
        },
        primaryImageOfPage: {
            "@id": hashId(canonicalUrl, "primaryimage"),
        },
        image: {
            "@id": hashId(canonicalUrl, "primaryimage"),
        },
        ...(imageUrl ? { thumbnailUrl: absoluteUrl(imageUrl) } : {}),
    };
}

// 블로그 목록처럼 여러 콘텐츠를 모아 보여주는 페이지용 CollectionPage 스키마를 만든다.
export function createCollectionPageJsonLd(input: PageJsonLdInput): JsonLdSchema {
    const canonicalUrl = getCanonicalUrl(input.url);

    return {
        ...createWebPageJsonLd(input),
        "@type": "CollectionPage",
        breadcrumb: {
            "@id": hashId(canonicalUrl, "breadcrumb"),
        },
    };
}

// 블로그 상세 글을 검색엔진이 article 콘텐츠로 이해할 수 있게 Article 스키마를 만든다.
export function createArticleJsonLd({
    url,
    name,
    description,
    imageUrl,
    publishedTime,
    modifiedTime,
    tags,
    wordCount,
}: ArticleJsonLdInput): JsonLdSchema {
    const canonicalUrl = getCanonicalUrl(url);
    const siteUrl = getCanonicalUrl("/");
    const absoluteImageUrl = absoluteUrl(imageUrl || SEO_CONFIG.defaultOgImage.path);

    return {
        "@type": "Article",
        "@id": hashId(canonicalUrl, "article"),
        mainEntityOfPage: canonicalUrl,
        headline: cleanJsonLdText(name),
        description: cleanJsonLdText(description),
        image: {
            "@id": hashId(canonicalUrl, "primaryimage"),
        },
        thumbnailUrl: absoluteImageUrl,
        datePublished: publishedTime,
        dateModified: modifiedTime,
        author: {
            "@type": "Person",
            name: SEO_CONFIG.authorName,
            url: siteUrl,
        },
        publisher: {
            "@id": hashId(siteUrl, "organization"),
        },
        keywords: tags.map(cleanJsonLdText),
        articleSection: tags.map(cleanJsonLdText),
        inLanguage: LANGUAGE,
        ...(wordCount ? { wordCount } : {}),
    };
}
