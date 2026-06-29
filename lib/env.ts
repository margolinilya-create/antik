/**
 * Centralised env access. Reads are lazy so the app can build without a live
 * Supabase project (queries degrade gracefully when `isSupabaseConfigured` is
 * false). Server-only secrets are never imported into client components.
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  revalidateSecret: process.env.REVALIDATE_SECRET ?? "",
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
