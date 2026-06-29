/** Renders a JSON-LD <script> tag server-side. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, structured data we build ourselves.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
