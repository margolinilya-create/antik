import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebsiteJsonLd } from "@/lib/seo/jsonld";
import { YandexMetrica } from "@/components/analytics/YandexMetrica";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const ymId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;
const gaId = process.env.NEXT_PUBLIC_GA_ID;
const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

// Body / UI — modern, Cyrillic-capable geometric sans.
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--ff-sans",
  display: "swap",
});

// Display — classical high-contrast serif (Cyrillic) for headings & wordmark.
const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "RELIQUA — антикварная галерея: подбор и продажа",
    template: "%s — RELIQUA",
  },
  description:
    "Курируемая антикварная галерея с провенансом и экспертизой: самовары, иконы, фарфор, мебель, монеты, живопись. Подбор и продажа уникальных предметов.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "RELIQUA",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  robots: { index: true, follow: true },
  verification: {
    ...(yandexVerification ? { yandex: yandexVerification } : {}),
    ...(googleVerification ? { google: googleVerification } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <JsonLd data={buildWebsiteJsonLd()} />
        {children}
        {ymId && <YandexMetrica id={ymId} />}
        {gaId && <GoogleAnalytics id={gaId} />}
      </body>
    </html>
  );
}
