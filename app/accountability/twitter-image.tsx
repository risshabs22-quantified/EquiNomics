import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "The Systemic & Institutional Accountability Matrix — EquiNomics"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "Systemic & Institutional Accountability Matrix",
    line1: "Hold the system",
    line2: "to account.",
    subtitle: "Stress-test national policy, audit algorithmic hiring bias, and forecast intersectional wealth equity.",
  })
}
