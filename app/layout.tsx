import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { env } from "@/lib/env";

// Cyrillic-capable pairing: editorial serif display + clean sans body.
const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--ff-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Антик — антикварный магазин: подбор и продажа",
    template: "%s — Антик",
  },
  description:
    "Курируемый антиквариат с провенансом и экспертизой: самовары, иконы, фарфор, мебель, монеты, живопись. Подбор и продажа предметов в наличии.",
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
    <html
      lang="ru"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
