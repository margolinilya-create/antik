import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CyrillicToTranslitImport from "cyrillic-to-translit-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The package ships a CommonJS constructor with loose types; pin a shape.
const CyrillicToTranslit = CyrillicToTranslitImport as unknown as new () => {
  transform: (input: string, separator?: string) => string;
};
const translit = new CyrillicToTranslit();

/** Russian title -> ASCII, SEO-friendly slug. */
export function slugify(input: string): string {
  return translit
    .transform(input, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
