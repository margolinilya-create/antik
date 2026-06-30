import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF (smaller) with WebP fallback for all optimized images.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage (public objects + image transformations)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/**" },
    ],
  },
};

export default nextConfig;
