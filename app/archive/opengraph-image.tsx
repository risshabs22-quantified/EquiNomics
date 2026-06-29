import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics Case Study Archive"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "Case Study Archive · Relational Database",
    line1: "Lived experience,",
    line2: "indexed as data.",
    subtitle: "Filter qualitative case studies by sector, phenomenon, and demographic — and correlate each to its macro statistic.",
  })
}
