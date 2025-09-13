import { createSupabaseServerClient } from "@/lib/db/supabaseServer";
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

export async function insertNewRows(rows: BlogListRow[]): Promise<number> {
    console.log(`[repo] insertNewRows count=${rows.length}`);
    if (rows.length === 0) return 0;
    const supabase = createSupabaseServerClient();
    const { error, data } = await supabase.from("velog").insert(rows).select("*");
    if (error) {
        console.error(`[repo] insertNewRows error`, error);
        throw error;
    }
    const inserted = data?.length ?? rows.length;
    console.log(`[repo] insertNewRows inserted=${inserted}`);
    return inserted;
}
