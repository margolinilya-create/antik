import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Cookieless anon client for PUBLIC reads (catalog, item, taxonomy). Because it
 * never touches `cookies()`, storefront pages stay statically generated / ISR
 * and `generateStaticParams` can call these queries at build time. RLS still
 * restricts results to publicly-visible rows.
 */
export function createStaticClient() {
  return createSupabaseClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
