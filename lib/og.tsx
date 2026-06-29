import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

/** Standard Open Graph / Twitter large-image dimensions. */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

const PALETTE = {
  paper: "#FBFAF7",
  ink: "#262A31",
  slate: "#2E4068",
  amber: "#C8881F",
  muted: "#6B7280",
  border: "#E3E1DB",
}

/**
 * Fetch Playfair Display (700) as a TTF subset for the requested glyphs.
 * Returns null on any failure so callers fall back to the system serif/sans —
 * the image still renders, just without the display face.
 */
async function loadPlayfair(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&text=${encodeURIComponent(
      text,
    )}`
    const css = await (await fetch(url)).text()
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (src) {
      const res = await fetch(src)
      if (res.ok) return await res.arrayBuffer()
    }
  } catch {
    /* fall through to default font */
  }
  return null
}

async function loadLogo(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "equinomics-logo.png"))
    return `data:image/png;base64,${buf.toString("base64")}`
  } catch {
    return null
  }
}

export interface OgContent {
  kicker: string
  line1: string
  line2: string
  subtitle: string
}

export async function createOgImage({ kicker, line1, line2, subtitle }: OgContent) {
  const [font, logo] = await Promise.all([
    loadPlayfair(`${kicker}${line1}${line2}EquiNomics`),
    loadLogo(),
  ])
  const display = font ? "Playfair" : "serif"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PALETTE.paper,
          padding: "60px 70px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* slate masthead rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            backgroundColor: PALETTE.slate,
            display: "flex",
          }}
        />

        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={72} height={72} style={{ borderRadius: 14 }} alt="" />
          ) : null}
          <div style={{ display: "flex", fontSize: 38, fontFamily: display, fontWeight: 700 }}>
            <span style={{ color: PALETTE.ink }}>Equi</span>
            <span style={{ color: PALETTE.slate }}>Nomics</span>
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 19,
              letterSpacing: 4,
              color: PALETTE.muted,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: display,
              fontWeight: 700,
              fontSize: 72,
              lineHeight: 1.04,
            }}
          >
            <div style={{ display: "flex", color: PALETTE.ink }}>{line1}</div>
            <div style={{ display: "flex", color: PALETTE.slate }}>{line2}</div>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${PALETTE.border}`,
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex", fontSize: 23, color: PALETTE.muted, maxWidth: 820 }}>
            {subtitle}
          </div>
          <div style={{ display: "flex", fontSize: 21, color: PALETTE.slate, fontWeight: 600 }}>
            equinomics.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font
        ? [{ name: "Playfair", data: font, weight: 700 as const, style: "normal" as const }]
        : [],
    },
  )
}
