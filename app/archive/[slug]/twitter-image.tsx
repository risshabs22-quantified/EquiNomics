import { createOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og"
import { getCaseStudy, formatUSD } from "@/lib/data"

export const runtime = "nodejs"
export const alt = "EquiNomics Case Study"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = getCaseStudy(slug)

  if (!study) {
    return createOgImage({
      kicker: "Case Study Archive",
      line1: "A story",
      line2: "from the archive.",
      subtitle: "Real experience, with the economics that explains it — EquiNomics.",
    })
  }

  return createOgImage({
    kicker: `Case Study · ${study.sector}`,
    line1: study.headline,
    subtitle: `${study.pseudonym} · ${study.demographics.region}`,
    tag: `${formatUSD(study.estimatedLostWages)} lifetime opportunity cost`,
    titleSize: 46,
  })
}
