import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/_next/image", "/writing?page=", "/robots.txt", "/sitemap.xml"],
                disallow: ["/api/", "/admin", "/login", "/test", "/*?*", "/writing?page=0"],
            },
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
