import { ImageResponse } from "next/og";
import { getItemBySlug } from "@/lib/queries/items";
import { imageUrl } from "@/lib/supabase/storage";
import { formatPrice } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Антик — предмет";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  const title = item?.title_ru ?? "Антик — антикварная галерея";
  const price =
    item && item.status === "in_stock"
      ? formatPrice(item.price, item.currency, item.price_on_request)
      : item?.status === "sold"
        ? "Продано"
        : item?.status === "reserved"
          ? "В резерве"
          : "";
  const cover = item?.images?.[0]
    ? imageUrl(item.images[0].storage_path, { width: 700 })
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f0f10",
          color: "#f2efe9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#c8a96a",
            }}
          >
            Антик · Галерея
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ height: 1, width: 96, background: "#c8a96a", marginBottom: 28 }} />
            <div style={{ fontSize: 58, lineHeight: 1.1, maxWidth: 560 }}>{title}</div>
            {price && (
              <div style={{ marginTop: 28, fontSize: 34, color: "#c8a96a" }}>{price}</div>
            )}
          </div>
          <div style={{ fontSize: 22, color: "#9c968b" }}>
            Антиквариат с провенансом и экспертизой
          </div>
        </div>
        {cover && (
          <img
            src={cover}
            alt=""
            width={500}
            height={630}
            style={{ width: 500, height: 630, objectFit: "cover" }}
          />
        )}
      </div>
    ),
    size,
  );
}
