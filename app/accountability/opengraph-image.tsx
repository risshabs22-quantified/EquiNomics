import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics Accountability Matrix"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "Institutional accountability",
    line1: "Look at what",
    line2: "makes the gap.",
    subtitle: "Policy comparisons, hiring bias, corporate pay gaps, and where wealth penalties stack up.",
  })
}
