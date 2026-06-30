import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
