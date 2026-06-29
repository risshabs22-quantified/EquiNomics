import type { Metadata } from "next"
import { DocPage, H2, P, UL, LI } from "@/components/doc-page"
import { InstrumentMethodology } from "@/components/instrument-methodology"
import { GLOSSARY, MACRO_INDICATORS } from "@/lib/data"

export const metadata: Metadata = {
  title: "Methodology & Sources",
  description:
    "How EquiNomics sources its macroeconomic indicators and structures qualitative case studies, plus a glossary of the economic concepts used throughout.",
}

export default function MethodologyPage() {
  return (
    <DocPage
      eyebrow="Methodology"
      title="How we read the data — and the people in it"
      intro="EquiNomics is a mixed-methods research platform. It pairs quantitative labor-economics indicators with qualitative case studies, treating each as a distinct but complementary form of evidence."
      updated="June 2026"
    >
      <H2>Quantitative indicators</H2>
      <P>
        The macro indicators on the dashboard are approximate, rounded reference
        values compiled from public datasets and peer-reviewed labor economics.
        They are intended to orient the reader and to frame the case studies — not
        to serve as official statistics. Figures are illustrative and should be
        verified against primary sources before citation.
      </P>
      <P>Primary source families include:</P>
      <UL>
        <LI>
          <strong>U.S. Bureau of Labor Statistics (BLS)</strong> — Current
          Population Survey (earnings, labor force participation) and the American
          Time Use Survey (unpaid care hours).
        </LI>
        <LI>
          <strong>U.S. Census Bureau</strong> — American Community Survey
          (occupation-level earnings and gender composition).
        </LI>
        <LI>
          <strong>OECD</strong> — comparative gender wage gap and pensions data.
        </LI>
        <LI>
          <strong>Peer-reviewed research</strong> — including Budig &amp; England
          (2001) on the motherhood penalty; Kleven, Landais &amp; Søgaard (2019) on
          child penalties; and Goldin (2014, 2021) on greedy work and the grand
          gender convergence.
        </LI>
      </UL>

      <H2>The indicators, sourced</H2>
      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full min-w-[440px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left">
              <th className="px-4 py-3 font-medium">Indicator</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Source family</th>
            </tr>
          </thead>
          <tbody>
            {MACRO_INDICATORS.map((m) => (
              <tr key={m.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{m.label}</td>
                <td className="px-4 py-3 font-mono text-primary tabular-nums">
                  {m.value}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {m.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="instruments">Interactive instruments — algorithms</H2>
      <P>
        Every interactive model on EquiNomics is driven by a transparent, documented
        algorithm — move an input and the output recomputes deterministically. The
        coefficients below are illustrative and directionally calibrated to the
        labor-economics literature; they are not official statistics, and the models
        are pedagogical instruments rather than forecasting tools.
      </P>
      <InstrumentMethodology />

      <H2>Qualitative case studies</H2>
      <P>
        Each case study is treated as a qualitative data point. Contributors submit
        their experience through a structured intake that captures economic sector,
        years of experience, demographic indicators, self-estimated opportunity
        cost, and the structural barriers they faced. Submissions are anonymized by
        the contributor before publication.
      </P>
      <P>
        Every narrative is then <em>annotated</em>: specific phrases are linked to
        the established economic concepts that help explain them. This is the core
        method of narrative economics — using theory to interpret lived experience,
        and lived experience to stress-test theory.
      </P>
      <UL>
        <LI>
          <strong>Self-reported opportunity cost</strong> is a contributor estimate,
          not an audited figure. It is most useful in aggregate and as a relative
          signal.
        </LI>
        <LI>
          <strong>No causal claims</strong> are made from individual narratives;
          they illustrate mechanisms documented in the quantitative literature.
        </LI>
        <LI>
          <strong>Selection effects</strong> apply — contributors self-select, so
          the archive is not a representative sample.
        </LI>
      </UL>

      <H2 id="concepts">Glossary of economic concepts</H2>
      <P>
        These are the analytical lenses applied throughout the platform. They appear
        as footnotes in the Economic Sidebar of each case study.
      </P>
      <div className="space-y-4 not-prose">
        {Object.values(GLOSSARY).map((c) => (
          <div key={c.term} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-lg font-semibold">{c.term}</h3>
              {c.theorist && (
                <span className="font-mono text-xs text-muted-foreground">
                  cf. {c.theorist}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {c.definition}
            </p>
          </div>
        ))}
      </div>

      <H2>Limitations &amp; commitments</H2>
      <P>
        This is an academic and educational project. Macro figures are simplified
        for clarity; the care-economy and wealth-gap estimates in particular vary
        meaningfully by methodology and source year. We commit to labeling every
        indicator's provenance, never presenting an estimate as a precise official
        statistic, and prioritizing the dignity and anonymity of contributors above
        all else.
      </P>
    </DocPage>
  )
}
