import type { Metadata } from "next"
import Link from "next/link"
import { DocPage, H2, P } from "@/components/doc-page"

export const metadata: Metadata = {
  title: "About",
  description:
    "EquiNomics is an academic platform examining gender economic inequality through the lens of narrative economics.",
}

export default function AboutPage() {
  return (
    <DocPage
      eyebrow="About"
      title="A narrative economics of gender inequality"
      intro="EquiNomics exists to close the distance between the aggregate and the individual — between a statistic about the gender pay gap and the person whose career it quietly reshaped."
    >
      <H2>The thesis</H2>
      <P>
        Economist Robert Shiller coined &ldquo;narrative economics&rdquo; to describe
        how stories drive economic outcomes. We borrow the frame and invert it:
        rather than asking how narratives move markets, we ask what the market's
        movements feel like from inside a single life. A 16% pay gap is a number. The
        pediatrician who priced her own flexibility is a mechanism — and the two
        explain each other.
      </P>

      <H2>What this platform does</H2>
      <P>
        It holds two kinds of evidence side by side. The{" "}
        <Link href="/" className="text-primary hover:underline">
          Macro Dashboard
        </Link>{" "}
        presents quantitative labor-economics indicators with their sources. The{" "}
        <Link href="/archive" className="text-primary hover:underline">
          Case Study Archive
        </Link>{" "}
        treats lived experiences as structured qualitative data — each annotated
        with the economic theory that frames it. Anyone can{" "}
        <Link href="/contribute" className="text-primary hover:underline">
          contribute a data point
        </Link>
        , adding to the archive in real time.
      </P>

      <H2>Who it is for</H2>
      <P>
        Students and researchers in labor economics and gender studies; journalists
        seeking grounded human context for the data; and anyone who has felt a gap
        between what the headline statistics describe and what they have lived.
      </P>

      <H2>A note on rigor and humility</H2>
      <P>
        We take the economics seriously and the people more seriously still. Figures
        are labeled, simplified, and sourced; narratives are anonymized and treated
        with care. This is a passion project built to provoke better questions, not
        to issue final answers. Read our{" "}
        <Link href="/methodology" className="text-primary hover:underline">
          methodology
        </Link>{" "}
        and{" "}
        <Link href="/ethics" className="text-primary hover:underline">
          data ethics protocol
        </Link>{" "}
        to see exactly how.
      </P>
    </DocPage>
  )
}
