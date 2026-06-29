import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/**
 * On-demand ISR. Wire a Supabase Database Webhook on the `items` table to
 * POST here with the shared secret so a new/edited/sold item updates the
 * storefront immediately instead of waiting for the revalidate window.
 *
 * Body: { secret, slug?, category_slug? }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const secret = body.secret ?? req.nextUrl.searchParams.get("secret");

  if (!env.revalidateSecret || secret !== env.revalidateSecret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/sitemap.xml");
  if (body.slug) revalidatePath(`/item/${body.slug}`);
  if (body.category_slug) revalidatePath(`/category/${body.category_slug}`);

  return NextResponse.json({ revalidated: true });
}
