import { ImageResponse } from "next/og";
import { getSiteHost, site } from "@/lib/site";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

const siteTitleFontFamily =
  '"HiraMinProN-W6", "Source Han Serif CN", "Source Han Serif SC", "Source Han Serif TC", serif';

interface OgImageOptions {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function createOgImage({ title, description, eyebrow }: OgImageOptions) {
  const summary = description ? trimText(description, 82) : site.description;
  const siteHost = getSiteHost();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          overflow: "hidden",
          backgroundColor: "#1f1e1c",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "#f7f3ec",
          fontFamily: "serif",
          padding: 68,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background:
              "radial-gradient(circle at 18% 10%, rgba(246, 238, 220, 0.12), transparent 32%), radial-gradient(circle at 78% 72%, rgba(255, 255, 255, 0.08), transparent 34%)",
          }}
        />
        <main
          style={{
            position: "relative",
            width: 820,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#d9d2c6",
                fontSize: 24,
                lineHeight: 1,
                marginBottom: 32,
              }}
            >
              {eyebrow ?? siteHost}
            </div>
            <h1
              style={{
                display: "flex",
                margin: 0,
                color: "#fffdfa",
                fontSize: getTitleSize(title),
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 1.06,
              }}
            >
              {trimText(title, 34)}
            </h1>
            <p
              style={{
                display: "flex",
                margin: "36px 0 0",
                width: 720,
                color: "#d9d2c6",
                fontSize: 30,
                lineHeight: 1.5,
              }}
            >
              {summary}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#f3ede3",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            <span>{siteHost}</span>
            <span style={{ margin: "0 16px", color: "#9f988c" }}>/</span>
            <span>{site.title}</span>
          </div>
        </main>
        <aside
          style={{
            position: "relative",
            marginLeft: "auto",
            width: 230,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 2,
              height: 360,
              backgroundColor: "#f7f3ec",
              marginRight: 28,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#fffdfa",
              fontFamily: siteTitleFontFamily,
              fontSize: 46,
              fontWeight: 800,
              lineHeight: 0.92,
            }}
          >
            {Array.from(site.title).map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#f1eadf",
              fontFamily: siteTitleFontFamily,
              fontSize: 25,
              fontWeight: 700,
              lineHeight: 1.1,
              marginLeft: 20,
            }}
          >
            {Array.from(site.subtitle).map((char, index) => (
              <span key={`${char}-${index}`}>{char}</span>
            ))}
          </div>
        </aside>
      </div>
    ),
    ogImageSize,
  );
}

function getTitleSize(title: string) {
  const length = Array.from(title).length;

  if (length > 22) {
    return 68;
  }

  if (length > 14) {
    return 78;
  }

  return 92;
}

function trimText(value: string, length: number) {
  const chars = Array.from(value.replace(/\s+/g, " ").trim());

  if (chars.length <= length) {
    return chars.join("");
  }

  return `${chars.slice(0, length).join("")}...`;
}
