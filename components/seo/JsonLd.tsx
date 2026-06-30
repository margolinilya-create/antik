/** Renders a JSON-LD <script> tag server-side. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is structured data we build ourselves, but escape "<" so an
      // admin-entered "</script>" in any field can't break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
