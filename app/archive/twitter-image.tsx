import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics Case Study Archive"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "Case Study Archive",
    line1: "Real stories,",
    line2: "tagged with the economics.",
    subtitle: "Filter by industry and what happened — then see the macro stat that goes with each story.",
  })
}
