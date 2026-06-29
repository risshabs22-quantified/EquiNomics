import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics Interactive Models"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "The Instruments",
    line1: "Don't read the data.",
    line2: "Interrogate it.",
    subtitle: "Interactive econometric models — policy simulator, shadow-economy invoice, intersectional matrix, pink-tax indexer.",
  })
}
