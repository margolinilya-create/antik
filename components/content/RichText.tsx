/**
 * Minimal markdown-lite renderer for editorial bodies (landing pages, journal).
 * Supported syntax, intentionally tiny:
 *   - a line starting with "## " becomes an <h2>
 *   - a line starting with "### " becomes an <h3>
 *   - everything else is a paragraph; single newlines are preserved
 * Blocks are separated by blank lines.
 */
export function RichText({
  text,
  className = "",
}: {
  text: string | null | undefined;
  className?: string;
}) {
  if (!text || !text.trim()) return null;
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  return (
    <div
      className={`space-y-5 text-[1.02rem] leading-[1.85] text-ink/85 ${className}`}
    >
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="pt-2 font-display text-xl font-medium tracking-tight text-ink"
            >
              {block.slice(3).trim()}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="pt-1 font-display text-base font-medium tracking-tight text-ink"
            >
              {block.slice(4).trim()}
            </h3>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}
