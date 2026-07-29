import { SITE_URL } from "./config";

const HTML_TAG_REGEX = /<[^>]*>?/g;
const DESCRIPTION_UNSAFE_REGEX = /["'\n\r]/g;
const JSON_LD_UNSAFE_REGEX = /<[^>]*>?|[\u0000-\u001f\u007f]/g;

export function absoluteUrl(pathOrUrl: string): string {
    try {
        return new URL(pathOrUrl).toString();
    } catch {
        return new URL(pathOrUrl, SITE_URL).toString();
    }
}

export function normalizeSeoText(text: string): string {
    return text.replaceAll("&nbsp;", " ").replace(/\s{2,}/g, " ").trim();
}

export function cleanDescription(text: string, maxLength = 155): string {
    return normalizeSeoText(
        text
            .replace(HTML_TAG_REGEX, "")
            .replace(DESCRIPTION_UNSAFE_REGEX, "")
            .replaceAll(".", ". "),
    ).slice(0, maxLength);
}

export function cleanJsonLdText(text: string): string {
    return normalizeSeoText(text.replace(JSON_LD_UNSAFE_REGEX, "").replaceAll('"', ""));
}

export function getCanonicalUrl(pathOrUrl: string): string {
    const url = new URL(absoluteUrl(pathOrUrl));
    const page = url.searchParams.get("page");

    url.search = "";

    if (page) {
        url.searchParams.set("page", page);
    }

    return url.toString();
}
