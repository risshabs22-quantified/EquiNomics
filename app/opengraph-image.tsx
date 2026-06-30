import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "EquiNomics — The Economics of Gender Inequality"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "An economics project",
    line1: "Behind every statistic",
    line2: "is someone's life.",
    subtitle: "Charts, models, and real stories about gender inequality in the labor market.",
  })
}
