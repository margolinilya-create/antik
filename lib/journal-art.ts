/**
 * Branded illustration system for journal posts.
 *
 * The catalogue has no editorial cover photography, so each article gets a
 * deterministic, on-brand generated cover + avatar derived from its topic.
 * When a real photo is later uploaded to `cover_path`, the cover component
 * prefers it automatically — this is purely the fallback art.
 */

export interface JournalTheme {
  key: string;
  /** Human rubric label shown on the cover / avatar chip. */
  label: string;
  /** Deep accent used for the motif, frame and initial. */
  ink: string;
  /** Soft tinted background for the cover ground. */
  ground: string;
}

const THEMES = {
  farfor: { key: "farfor", label: "Фарфор", ink: "#3b5b6e", ground: "#eaf0f2" },
  ikony: { key: "ikony", label: "Иконы", ink: "#7a4a24", ground: "#f3ebdf" },
  serebro: { key: "serebro", label: "Серебро", ink: "#4a5560", ground: "#edeff1" },
  samovary: { key: "samovary", label: "Самовары", ink: "#8a5a2b", ground: "#f4ebdd" },
  steklo: { key: "steklo", label: "Стекло", ink: "#3f6f63", ground: "#e7f0ec" },
  gzhel: { key: "gzhel", label: "Гжель", ink: "#2f4d8a", ground: "#e8edf6" },
  provenans: { key: "provenans", label: "Провенанс", ink: "#6b5a3e", ground: "#f1ebdf" },
  ekspertiza: { key: "ekspertiza", label: "Экспертиза", ink: "#806645", ground: "#f0ece2" },
} satisfies Record<string, JournalTheme>;

/** Pick a theme from the post slug (topic keywords), with a sane default. */
export function journalTheme(post: { slug: string }): JournalTheme {
  const s = post.slug.toLowerCase();
  if (/(farfor|lfz|dulevo)/.test(s)) return THEMES.farfor;
  if (/ikon/.test(s)) return THEMES.ikony;
  if (/(serebr|kleym)/.test(s)) return THEMES.serebro;
  if (/samovar/.test(s)) return THEMES.samovary;
  if (/(steklo|galle|modern)/.test(s)) return THEMES.steklo;
  if (/gzhel/.test(s)) return THEMES.gzhel;
  if (/provenans/.test(s)) return THEMES.provenans;
  return THEMES.ekspertiza;
}

/** Rough reading time in minutes from the body length (~1000 chars/min ru). */
export function readingMinutes(body: string | null | undefined): number {
  if (!body) return 1;
  return Math.max(1, Math.round(body.trim().length / 900));
}
