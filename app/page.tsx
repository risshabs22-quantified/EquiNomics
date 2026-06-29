import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  LineChart,
  FileText,
  GitCompareArrows,
  Tags,
} from "lucide-react"
import { MACRO_INDICATORS } from "@/lib/data"
import { StatCounter } from "@/components/stat-counter"
import {
  PayGapTrendChart,
  ParticipationChart,
  SegregationChart,
} from "@/components/macro-charts"
import { PolicySimulator } from "@/components/models/policy-simulator"
import { LiveCasePanel } from "@/components/live-archive-stats"
import { PhenomenonBadge } from "@/components/phenomenon-badge"

const MODEL_LINKS = [
  { href: "/models/policy-simulator", label: "Policy Simulator", icon: LineChart },
  { href: "/models/shadow-economy", label: "Shadow Economy Invoice", icon: FileText },
  { href: "/models/intersectional", label: "Intersectional Examiner", icon: GitCompareArrows },
  { href: "/models/pink-tax", label: "Pink Tax Indexer", icon: Tags },
]

function IndicatorTile({ indicator }: { indicator: (typeof MACRO_INDICATORS)[number] }) {
  const decimals =
    indicator.unit === "index" ? 2 : indicator.numeric % 1 === 0 ? 0 : 1
  const suffix =
    indicator.unit === "percent"
      ? "%"
      : indicator.unit === "cents"
        ? "¢"
        : indicator.unit === "hours"
          ? " hrs"
          : ""
  return (
    <div className="group bg-card p-5 transition-colors hover:bg-secondary/40">
      <span className="eyebrow leading-tight block min-h-8">{indicator.label}</span>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold tabular-nums">
          <StatCounter value={indicator.numeric} decimals={decimals} suffix={suffix} />
        </span>
        {indicator.delta && (
          <span
            className={
              indicator.deltaDirection === "up"
                ? "text-xs font-mono text-academic"
                : indicator.deltaDirection === "down"
                  ? "text-xs font-mono text-chart-4"
                  : "text-xs font-mono text-muted-foreground"
            }
          >
            {indicator.delta}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
        {indicator.context}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <PhenomenonBadge phenomenon={indicator.phenomenon} asLink />
        <span className="text-[10px] font-mono text-muted-foreground/60 text-right">
          {indicator.source}
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main>
      {/* ───────────── Masthead hero (asymmetric) ───────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 grid lg:grid-cols-12 gap-0">
          <div className="lg:col-span-8 lg:border-r border-border lg:pr-10 py-14 lg:py-20 animate-fade-up">
            <p className="eyebrow mb-5">A Platform for Narrative Economics</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.0] tracking-tight text-balance">
              The economy is a story told in{" "}
              <span className="text-primary italic">numbers.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
              EquiNomics pairs rigorous labor-economics data with the people inside
              it — and turns static statistics into interactive models you can
              interrogate: occupational segregation, the motherhood penalty, the care
              economy, and the gender wealth gap.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/models"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <LineChart className="h-4 w-4" />
                Explore the Models
              </Link>
              <Link
                href="/archive"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Read the Case Archive
              </Link>
            </div>
          </div>

          {/* Vertical key-figures rail */}
          <aside className="lg:col-span-4 lg:pl-10 py-10 lg:py-20">
            <p className="eyebrow mb-4">Today's Indicators</p>
            <div className="divide-rule border-y border-border">
              {[
                { v: "84¢", l: "Earned per male $1", d: "median, full-time" },
                { v: "4.2h", l: "Daily unpaid care (women)", d: "vs 2.6h men" },
                { v: "−4%", l: "Wage penalty per child", d: "motherhood penalty" },
                { v: "10.4%", l: "Women F500 CEOs", d: "the leaky pipeline" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline justify-between gap-4 py-3.5">
                  <div>
                    <div className="text-sm font-medium">{s.l}</div>
                    <div className="text-xs text-muted-foreground">{s.d}</div>
                  </div>
                  <div className="font-mono text-2xl font-bold text-primary tabular-nums">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/methodology"
              className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Sources & methodology <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </div>
      </section>

      {/* ───────────── Featured instrument: live simulator ───────────── */}
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <p className="eyebrow mb-2">Interactive · Predictive Model</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                What would actually close the gap?
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                This is not a chart you read — it's a model you run. Pull the policy
                levers and watch the projected national wage gap respond over a decade.
              </p>
            </div>
            <Link
              href="/models/policy-simulator"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Open full simulator <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <PolicySimulator compact />
        </div>
      </section>

      {/* ───────────── Macro indicators (bordered grid) ───────────── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-2">Macro Dashboard</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Headline Indicators
            </h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {MACRO_INDICATORS.map((ind) => (
            <IndicatorTile key={ind.id} indicator={ind} />
          ))}
        </div>
      </section>

      {/* ───────────── Charts ───────────── */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-8">
            The Data, Over Time
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-display text-lg font-bold">
                The narrowing — but persistent — pay gap
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Women's earnings per $1 earned by men, 1980–2024.
              </p>
              <PayGapTrendChart />
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-display text-lg font-bold">
                Labor force participation, by gender
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                A convergence that stalled — shaped by the structure of care.
              </p>
              <ParticipationChart />
            </div>
            <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
              <h3 className="font-display text-lg font-bold">
                Occupational segregation & the devaluation of "women's work"
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Median wage by occupation — female-dominated fields cluster at lower
                pay despite comparable skill.
              </p>
              <SegregationChart />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Models suite ───────────── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-2">The Instruments</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Five ways to interrogate the data
            </h2>
          </div>
          <Link
            href="/models"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            All models <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {MODEL_LINKS.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group bg-card p-6 transition-colors hover:bg-secondary/40"
              >
                <Icon className="h-5 w-5 text-primary mb-4" />
                <div className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                  {m.label}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary">
                  Open <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ───────────── Live case panel ───────────── */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-2">Qualitative Case Studies</p>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              The people inside the indicators
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Each story is a data point, annotated with the economic theory that
              explains it — and updated in real time as the community contributes.
            </p>
          </div>
          <LiveCasePanel />
        </div>
      </section>
    </main>
  )
}
