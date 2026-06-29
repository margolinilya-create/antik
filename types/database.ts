/**
 * Domain types. Hand-written for the foundation; once a live Supabase project
 * is connected, regenerate with `supabase gen types typescript` and replace.
 */
export type ItemStatus = "draft" | "in_stock" | "reserved" | "sold" | "archived";
export type Currency = "RUB" | "USD" | "EUR";
export type InquiryType = "reserve" | "buy" | "question";
export type InquiryStatus = "new" | "in_progress" | "won" | "lost";
export type ConditionGrade =
  | "mint"
  | "excellent"
  | "good"
  | "fair"
  | "restored"
  | "as_is";

export interface ItemImage {
  storage_path: string;
  alt_ru: string | null;
  width: number | null;
  height: number | null;
  blurhash: string | null;
}

/** Shape returned by the `search_items` RPC for each list row. */
export interface ItemListRow {
  id: string;
  slug: string;
  title_ru: string;
  subtitle_ru: string | null;
  price: number | null;
  currency: Currency;
  price_on_request: boolean;
  status: ItemStatus;
  category: string | null;
  era: string | null;
  maker: string | null;
  image: ItemImage | null;
}

export interface FacetValue {
  slug: string;
  name: string;
  count: number;
}

export interface Facets {
  categories: FacetValue[];
  eras: FacetValue[];
  makers: FacetValue[];
  materials: FacetValue[];
  price: { min: number | null; max: number | null } | null;
}

export interface SearchResult {
  items: ItemListRow[];
  total: number;
  facets: Facets;
}

/** Full item detail (item page). */
export interface ItemDetail {
  id: string;
  slug: string;
  title_ru: string;
  subtitle_ru: string | null;
  description_ru: string | null;
  condition: ConditionGrade | null;
  condition_note_ru: string | null;
  provenance_ru: string | null;
  year_made_text: string | null;
  height_mm: number | null;
  width_mm: number | null;
  depth_mm: number | null;
  diameter_mm: number | null;
  weight_g: number | null;
  price: number | null;
  currency: Currency;
  price_on_request: boolean;
  status: ItemStatus;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
  category: { slug: string; name_ru: string } | null;
  era: { slug: string; name_ru: string } | null;
  maker: { slug: string; name_ru: string } | null;
  materials: { slug: string; name_ru: string }[];
  techniques: { slug: string; name_ru: string }[];
  images: ItemImage[];
}
