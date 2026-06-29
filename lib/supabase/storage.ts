import { env } from "@/lib/env";

const BUCKET = "item-images";

/**
 * Public URL for an image stored in the `item-images` bucket.
 * Uses Supabase's image transformation endpoint when width is given.
 * Returns a local placeholder when Supabase isn't configured (build/dev).
 */
export function imageUrl(
  storagePath: string | null | undefined,
  opts?: { width?: number; quality?: number },
): string {
  if (!storagePath) return "/placeholder.svg";
  if (!env.supabaseUrl) return "/placeholder.svg";
  const base = env.supabaseUrl.replace(/\/$/, "");
  if (opts?.width) {
    const q = new URLSearchParams({
      width: String(opts.width),
      quality: String(opts.quality ?? 75),
      resize: "contain",
    });
    return `${base}/storage/v1/render/image/public/${BUCKET}/${storagePath}?${q}`;
  }
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
