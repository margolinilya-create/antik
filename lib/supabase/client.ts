import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/** Browser client (anon key). RLS applies. */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
