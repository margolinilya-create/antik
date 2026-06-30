import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RELIQUA — антикварная галерея";

// Default social-share card for the site (home + any page without its own).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f1ea",
          color: "#221f1b",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#806645",
          }}
        >
          {`Антикварная галерея · с ${site.founded}`}
        </div>
        <div style={{ fontSize: 132, letterSpacing: 18, marginTop: 28 }}>
          {site.name}
        </div>
        <div style={{ height: 1, width: 120, background: "#806645", marginTop: 28 }} />
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#6b6358",
            marginTop: 28,
          }}
        >
          {site.wordmarkTagline}
        </div>
      </div>
    ),
    size,
  );
}
