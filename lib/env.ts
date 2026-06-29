/**
 * Centralised env access. Reads are lazy so the app can build without a live
 * Supabase project (queries degrade gracefully when `isSupabaseConfigured` is
 * false). Server-only secrets are never imported into client components.
 */
/**
 * Absolute site URL for canonical links / sitemap / OG. Prefers an explicit
 * NEXT_PUBLIC_SITE_URL, then Vercel's auto-injected production/preview domains,
 * then localhost — so a Vercel deploy gets correct absolute URLs with no config.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  siteUrl: resolveSiteUrl(),
  revalidateSecret: process.env.REVALIDATE_SECRET ?? "",
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
