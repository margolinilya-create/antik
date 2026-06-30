import { ImageResponse } from "next/og";
import { getJournalPost } from "@/lib/queries/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RELIQUA — журнал";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  const title = post?.title_ru ?? "Журнал RELIQUA";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          color: "#221f1b",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#806645",
          }}
        >
          RELIQUA · Журнал
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 1, width: 96, background: "#806645", marginBottom: 32 }} />
          <div style={{ fontSize: 60, lineHeight: 1.12, maxWidth: 960 }}>{title}</div>
        </div>
        <div style={{ fontSize: 24, color: "#6b6358" }}>
          Гид коллекционеру · антиквариат с экспертизой
        </div>
      </div>
    ),
    size,
  );
}
