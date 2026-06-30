import type { Metadata } from "next"
import Link from "next/link"
import { DocPage, H2, P } from "@/components/doc-page"

export const metadata: Metadata = {
  title: "About",
  description:
    "Why I built EquiNomics — a high school economics project about gender inequality, real stories, and the numbers behind them.",
}

export default function AboutPage() {
  return (
    <DocPage
      eyebrow="About"
      title="Why I built this"
      intro="I kept reading that the gender pay gap is 16%, and I kept thinking — okay, but what does that actually do to someone's life over forty years? EquiNomics is my attempt to answer that."
    >
      <H2>The thesis</H2>
      <P>
        Economist Robert Shiller wrote about how stories move markets. I'm doing
        something simpler: starting from the stories and working backward to the
        economics. A 16% pay gap is a number. The pediatrician who took a lower
        salary for flexibility is a mechanism — and the two explain each other.
      </P>

      <H2>What this site does</H2>
      <P>
        It holds two things side by side. The{" "}
        <Link href="/" className="text-primary hover:underline">
          Macro Dashboard
        </Link>{" "}
        has the labor-market numbers with their sources. The{" "}
        <Link href="/archive" className="text-primary hover:underline">
          Case Study Archive
        </Link>{" "}
        has real people's experiences, each tagged with the economic concept that
        helps explain what happened. Anyone can{" "}
        <Link href="/contribute" className="text-primary hover:underline">
          add their own story
        </Link>
        , and it shows up in the archive right away.
      </P>

      <H2>Who it's for</H2>
      <P>
        Other students who've taken econ and want to see the theory connect to
        something real. Teachers looking for a project that mixes data and narrative.
        Anyone who's looked at a headline stat and thought, that doesn't sound like
        what I've seen happen to people I know.
      </P>

      <H2>What I'm not claiming</H2>
      <P>
        I take the economics seriously and the people more seriously still. The
        numbers are rounded and sourced; the stories are anonymized. This is a
        student project meant to ask better questions, not to settle anything. Read
        the{" "}
        <Link href="/methodology" className="text-primary hover:underline">
          methodology
        </Link>{" "}
        and{" "}
        <Link href="/ethics" className="text-primary hover:underline">
          ethics page
        </Link>{" "}
        if you want to see exactly how it works.
      </P>
    </DocPage>
  )
}
