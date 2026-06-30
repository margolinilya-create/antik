import type { Metadata } from "next";
import { FavoritesView } from "./FavoritesView";

export const metadata: Metadata = {
  title: "Избранное",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-medium tracking-tight">Избранное</h1>
      <FavoritesView />
    </div>
  );
}
