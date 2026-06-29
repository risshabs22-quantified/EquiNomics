import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics — A Narrative Economics of Gender Inequality"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "A Platform for Narrative Economics",
    line1: "The economy is a story",
    line2: "told in numbers.",
    subtitle: "Where macroeconomic data meets lived experience — the economics of gender inequality.",
  })
}
