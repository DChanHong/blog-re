import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getPostsForSitemap } from "@/lib/services/velogService";
import { projectsData } from "@/data/projects";

export const revalidate = 86400;

function toLastModified(dateLike?: string | null) {
    if (!dateLike) return new Date();

    const date = new Date(dateLike);
    return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: absoluteUrl("/"),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: absoluteUrl("/writing"),
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: absoluteUrl("/resume"),
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    let posts: Awaited<ReturnType<typeof getPostsForSitemap>> = [];

    try {
        posts = await getPostsForSitemap();
    } catch (error) {
        console.error("[sitemap] failed to fetch blog posts", error);
    }

    const blogRoutes: MetadataRoute.Sitemap = posts
        .filter((post) => post.slug)
        .map((post) => ({
            url: absoluteUrl(`/blog/${post.slug}`),
            lastModified: toLastModified(
                post.detail_crawled_at || post.inserted_at || post.created_at,
            ),
            changeFrequency: "weekly",
            priority: 0.6,
        }));

    const projectRoutes: MetadataRoute.Sitemap = projectsData.map((project) => ({
        url: absoluteUrl(`/project/${project.id}`),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [
        ...staticRoutes,
        { url: absoluteUrl("/work"), changeFrequency: "monthly", priority: 0.8 },
        ...projectRoutes,
        ...blogRoutes,
    ];
}
