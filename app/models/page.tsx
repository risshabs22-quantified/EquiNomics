import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, LineChart, FileText, GitCompareArrows, Tags } from "lucide-react"

export const metadata: Metadata = {
  title: "Interactive Models",
  description:
    "Four tools you can actually run: a policy simulator, a care-work invoice generator, an intersectional pay-gap chart, and a pink tax calculator.",
}

const MODELS = [
  {
    index: "01",
    href: "/models/policy-simulator",
    kicker: "Run the policy",
    title: "Policy Simulator",
    desc: "Move the sliders for paid leave, pay transparency, childcare, and flexible work, and watch the projected wage gap respond over ten years — with each lever's share broken out.",
    icon: LineChart,
  },
  {
    index: "02",
    href: "/models/shadow-economy",
    kicker: "Put a price on it",
    title: "Shadow Economy Invoice",
    desc: "Take your weekly hours of housework, caregiving, and mental load, price them at real market wages, and download an actual invoice addressed to the economy.",
    icon: FileText,
  },
  {
    index: "03",
    href: "/models/intersectional",
    kicker: "Stack the factors",
    title: "Intersectional Pay Gap Chart",
    desc: "Cross gender with race, education, or region and watch the penalties stack — the part a single headline average completely hides.",
    icon: GitCompareArrows,
  },
  {
    index: "04",
    href: "/models/pink-tax",
    kicker: "The pink tax",
    title: "Pink Tax Calculator",
    desc: "Add up the markups on products aimed at women across categories — what it costs you in a year, over a lifetime, and as the investment growth you never got.",
    icon: Tags,
  },
]

export default function ModelsHub() {
  return (
    <main className="mx-auto max-w-7xl px-5 lg:px-10 py-12">
      <header className="border-b border-border pb-10 mb-10 max-w-3xl">
        <p className="eyebrow mb-3">The tools</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.04] tracking-tight text-balance">
          Don't just read the data.{" "}
          <span className="text-primary italic">Poke</span> at it.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-pretty">
          Four tools that take a flat statistic and let you push on it. Each one runs
          on math I've documented in the open, so when you move something, you can see
          exactly why the answer changes.
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
                Open tool
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold">
            Plus: the Case Study Archive
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            In the archive, click any{" "}
            <span className="font-mono text-primary">#phenomenon</span> tag and
            you'll see the macro stat that goes with it — the same numbers from
            the dashboard, tied to a real story.
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
