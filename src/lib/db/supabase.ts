import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../utils/env";

let sharedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (sharedClient) return sharedClient;
  sharedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });
  return sharedClient;
}

export function createSupabaseClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
