import type { Metadata } from "next"
import { getCaseStudy } from "@/lib/data"
import { StoryView } from "@/components/story-view"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return { title: "Case Study" }
  return {
    title: study.headline,
    description: study.summary,
  }
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Seed studies are known at build time → render server-side for SEO and to
  // avoid a loading flash. Contributed studies (localStorage) resolve on the
  // client inside StoryView.
  const seed = getCaseStudy(slug) ?? null
  return <StoryView slug={slug} initialStudy={seed} />
}
