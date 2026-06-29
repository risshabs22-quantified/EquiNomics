import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, LineChart, FileText, GitCompareArrows, Tags } from "lucide-react"

export const metadata: Metadata = {
  title: "Interactive Models",
  description:
    "A suite of interactive econometric instruments: the Policy Simulator, Shadow Economy Invoice, Intersectional Cross-Examiner, and Pink Tax Indexer.",
}

const MODELS = [
  {
    index: "01",
    href: "/models/policy-simulator",
    kicker: "Predictive Modeling",
    title: "Econometric Policy Simulator",
    desc: "Adjust paid leave, wage transparency, childcare and flexible-work levers; watch the projected gender wage gap respond over ten years, decomposed by lever.",
    icon: LineChart,
  },
  {
    index: "02",
    href: "/models/shadow-economy",
    kicker: "The Care Economy, Quantified",
    title: "Shadow Economy Invoice Generator",
    desc: "Map weekly hours of domestic labor, caregiving and mental load to localized market wages — and download a formal SVG 'Invoice to the Economy'.",
    icon: FileText,
  },
  {
    index: "03",
    href: "/models/intersectional",
    kicker: "Dynamic Regression",
    title: "Intersectional Disparity Cross-Examiner",
    desc: "Toggle gender against race, education or region to isolate the compounding penalties that single-axis averages conceal.",
    icon: GitCompareArrows,
  },
  {
    index: "04",
    href: "/models/pink-tax",
    kicker: "Consumer Price Discrimination",
    title: "Pink Tax Inflation Indexer",
    desc: "Index your personal 'Gender Inflation Premium' across categories — annually, over a lifetime, and as forgone investment growth.",
    icon: Tags,
  },
]

export default function ModelsHub() {
  return (
    <main className="mx-auto max-w-7xl px-5 lg:px-10 py-12">
      <header className="border-b border-border pb-10 mb-10 max-w-3xl">
        <p className="eyebrow mb-3">The Instruments</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.04] tracking-tight text-balance">
          Don't read the data.{" "}
          <span className="text-primary italic">Interrogate</span> it.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-pretty">
          Four interactive econometric instruments turn static statistics into
          state-driven models you can manipulate. Each is built on a transparent,
          documented algorithm — move an input, and the output recomputes in real time.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden">
        {MODELS.map((m) => {
          const Icon = m.icon
          return (
            <Link
              key={m.href}
              href={m.href}
              className="group relative bg-card p-7 lg:p-9 transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-display text-5xl font-black text-border group-hover:text-primary/30 transition-colors leading-none">
                  {m.index}
                </span>
                <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="eyebrow mb-2">{m.kicker}</p>
              <h2 className="font-display text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                {m.title}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {m.desc}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open instrument
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold">
            Plus: the Relational Case Archive
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            In the archive, clicking any <span className="font-mono text-primary">#phenomenon</span>{" "}
            tag surfaces the exact macro statistic that correlates with that lived
            experience — the fifth interactive instrument.
          </p>
        </div>
        <Link
          href="/archive"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Explore the Archive <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}
