import {
    createSupabaseServerClient,
    createSupabaseServiceRoleClient,
} from "@/lib/db/supabaseServer";
import type { BlogListRow } from "@/types/blog";

export async function getExistingTitles(): Promise<string[]> {
    console.log(`[repo] getExistingTitles`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("title");
    if (error) {
        console.error(`[repo] getExistingTitles error`, error);
        throw error;
    }
    const titles = (data ?? []).map((row: any) => row.title as string);
    console.log(`[repo] getExistingTitles count=${titles.length}`);
    return titles;
}

export async function getExistingKeys(): Promise<Set<string>> {
    console.log(`[repo] getExistingKeys`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("title, detail_link");
    if (error) {
        console.error(`[repo] getExistingKeys error`, error);
        throw error;
    }
    const keys = new Set<string>();
    for (const row of data ?? []) {
        keys.add(`${(row as any).title}|${(row as any).detail_link}`);
    }
    console.log(`[repo] getExistingKeys count=${keys.size}`);
    return keys;
}

export async function insertRows(rows: BlogListRow[]): Promise<number> {
    console.log(`[repo] insertRows count=${rows.length}`);
    if (rows.length === 0) return 0;
    const supabase = createSupabaseServiceRoleClient();
    const { error, data } = await supabase.from("velog").insert(rows).select("*");
    if (error) {
        console.error(`[repo] insertRows error`, error);
        throw error;
    }
    const inserted = data?.length ?? rows.length;
    console.log(`[repo] insertRows inserted=${inserted}`);
    return inserted;
}

export async function fetchAllTags(): Promise<string[]> {
    console.log(`[repo] fetchAllTags`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("tags");
    if (error) {
        console.error(`[repo] fetchAllTags error`, error);
        throw error;
    }
    const set = new Set<string>();
    for (const row of data ?? []) {
        for (const tag of ((row as any).tags || []) as string[]) set.add(tag);
    }
    const tags = Array.from(set).sort((a, b) => a.localeCompare(b));
    console.log(`[repo] fetchAllTags distinct=${tags.length}`);
    return tags;
}

export async function fetchPostsByTagsAny(tags: string[]) {
    console.log(`[repo] fetchPostsByTagsAny tags=${tags.join(",")}`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("*").overlaps("tags", tags);
    if (error) throw error;
    return data;
}

export async function fetchPostsByTagsAll(tags: string[]) {
    console.log(`[repo] fetchPostsByTagsAll tags=${tags.join(",")}`);
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("velog").select("*").contains("tags", tags);
    if (error) throw error;
    return data;
}
