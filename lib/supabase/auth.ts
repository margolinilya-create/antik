import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | null;
  role: string;
  full_name: string | null;
}

/** Returns the current admin (owner/manager) or null. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "owner" && role !== "manager") return null;

  return {
    id: user.id,
    email: user.email ?? null,
    role,
    full_name: (profile as { full_name?: string } | null)?.full_name ?? null,
  };
}

/** Guard for admin pages — redirects to /login if not an admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/login?next=/admin");
  return admin;
}
