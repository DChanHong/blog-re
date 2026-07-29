import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/_next/image",
                    "/blog?page=",
                    "/robots.txt",
                    "/sitemap.xml",
                ],
                disallow: [
                    "/api/",
                    "/api-docs",
                    "/admin",
                    "/login",
                    "/test",
                    "/*?*",
                    "/blog?page=0",
                ],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
