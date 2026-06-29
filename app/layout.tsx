import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/lib/env";

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
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
