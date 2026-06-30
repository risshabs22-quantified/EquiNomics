import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics Interactive Models"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "Interactive tools",
    line1: "Don't just read",
    line2: "the data.",
    subtitle: "Policy simulator, care-work invoice, intersectional pay chart, pink tax calculator.",
  })
}
