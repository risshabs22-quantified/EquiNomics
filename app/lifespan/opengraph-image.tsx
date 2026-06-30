import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"

export const runtime = "nodejs"
export const alt = "The Macroeconomic Lifespan Trajectory Model — EquiNomics"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return createOgImage({
    kicker: "Lifespan trajectory model",
    line1: "How a gap becomes",
    line2: "a chasm.",
    subtitle: "Twelve tools you can play with — from your first salary to retirement savings.",
  })
}
