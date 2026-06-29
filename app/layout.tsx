import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

// Modern, Cyrillic-capable geometric sans — used across the whole UI.
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--ff-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Антик — антикварная галерея: подбор и продажа",
    template: "%s — Антик",
  },
  description:
    "Курируемая антикварная галерея с провенансом и экспертизой: самовары, иконы, фарфор, мебель, монеты, живопись. Подбор и продажа уникальных предметов.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Антик",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-ink">{children}</body>
    </html>
  );
}
