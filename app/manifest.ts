import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** PWA manifest — brand name + light cream theme. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — антикварная галерея`,
    short_name: site.name,
    description:
      "Курируемая антикварная галерея с провенансом и экспертизой: подбор и продажа уникальных предметов.",
    start_url: "/",
    display: "standalone",
    lang: "ru",
    background_color: "#f4f1ea",
    theme_color: "#f4f1ea",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
