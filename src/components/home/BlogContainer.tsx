import { getRecentPosts } from "@/lib/services/velogService";
import type { VelogPostDto } from "@/types/blog";
import Section3 from "@/components/domain/home/Section3";

export default async function BlogContainer() {
    const recentRows = await getRecentPosts(12);

    // DTO 매핑: 최근 블로그 포스트
    const recentPosts: VelogPostDto[] = (recentRows || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        img_src: row.img_src,
        created_at:
            typeof row.created_at === "string"
                ? row.created_at
                : row.created_at
                  ? new Date(row.created_at).toISOString()
                  : "",
        tags: Array.isArray(row.tags) ? row.tags : [],
        detail_link: row.detail_link,
        intro: row.intro,
        inserted_at:
            typeof row.inserted_at === "string"
                ? row.inserted_at
                : row.inserted_at
                  ? new Date(row.inserted_at).toISOString()
                  : undefined,
    }));

    return <Section3 blogList={recentPosts} />;
}
