import Link from "next/link"
import { ArrowRight, BookOpen, BarChart3, Quote } from "lucide-react"
import { MACRO_INDICATORS } from "@/lib/data"
import { StatCounter } from "@/components/stat-counter"
import {
  PayGapTrendChart,
  ParticipationChart,
  SegregationChart,
} from "@/components/macro-charts"
import { OpportunityCalculator } from "@/components/opportunity-calculator"
import { LiveCasePanel } from "@/components/live-archive-stats"
import { PhenomenonBadge } from "@/components/phenomenon-badge"

function IndicatorCard({
  indicator,
}: {
  indicator: (typeof MACRO_INDICATORS)[number]
}) {
  const decimals =
    indicator.unit === "index"
      ? 2
      : indicator.numeric % 1 === 0
        ? 0
        : 1
  const suffix =
    indicator.unit === "percent"
      ? "%"
      : indicator.unit === "cents"
        ? "¢"
        : indicator.unit === "hours"
          ? " hrs"
          : ""
  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <span className="eyebrow leading-tight">{indicator.label}</span>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-bold text-foreground tabular-nums">
          <StatCounter
            value={indicator.numeric}
            decimals={decimals}
            suffix={suffix}
          />
        </span>
        {indicator.delta && (
          <span
            className={
              indicator.deltaDirection === "up"
                ? "text-xs font-mono text-chart-5"
                : indicator.deltaDirection === "down"
                  ? "text-xs font-mono text-chart-3"
                  : "text-xs font-mono text-muted-foreground"
            }
          >
            {indicator.delta}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
        {indicator.context}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <PhenomenonBadge phenomenon={indicator.phenomenon} asLink />
        <span className="text-[10px] font-mono text-muted-foreground/70 text-right">
          {indicator.source}
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main>
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-ledger opacity-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10 py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow mb-5">A Platform for Narrative Economics</p>
            <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight text-balance">
              The economy is a story we tell with{" "}
              <span className="text-primary italic">numbers.</span> Here are the
              people inside the data.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty">
              EquiNomics intersects rigorous labor economics with qualitative human
              case studies to examine gender economic inequality — from{" "}
              <span className="text-foreground">occupational segregation</span> and
              the <span className="text-foreground">motherhood penalty</span> to the
              uncounted output of the{" "}
              <span className="text-foreground">care economy</span>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/archive"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Read the Case Studies
              </Link>
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium border border-border rounded-sm hover:bg-secondary transition-colors"
              >
                Contribute Your Data
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── What is Narrative Economics ─────────────── */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-12 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div className="flex gap-4">
            <Quote className="h-8 w-8 text-primary shrink-0" />
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-balance">
              Aggregate statistics describe a population but explain no one.
              Narrative economics asks what the data <em>feels</em> like from the
              inside — and treats each lived experience as a qualitative data point
              worthy of rigorous study.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border rounded-lg overflow-hidden">
            {[
              { v: "84¢", l: "Earned per male $1" },
              { v: "4%", l: "Wage penalty / child" },
              { v: "4.2h", l: "Daily unpaid care" },
              { v: "10%", l: "Women F500 CEOs" },
            ].map((s) => (
              <div key={s.l} className="bg-card p-5">
                <div className="font-mono text-2xl font-bold text-primary">
                  {s.v}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── Macro Indicators ───────────────────── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow mb-2">Macro Dashboard</p>
            <h2 className="font-serif text-3xl font-semibold">
              Headline Indicators
            </h2>
          </div>
          <Link
            href="/methodology"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Sources & methodology <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MACRO_INDICATORS.map((ind) => (
            <IndicatorCard key={ind.id} indicator={ind} />
          ))}
        </div>
      </section>

      {/* ───────────────────────── Charts ───────────────────────── */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
          <div className="mb-8 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-3xl font-semibold">
              The Data, Over Time
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-serif text-lg font-semibold">
                The narrowing — but persistent — pay gap
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Women's earnings per $1 earned by men, 1980–2024.
              </p>
              <PayGapTrendChart />
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-serif text-lg font-semibold">
                Labor force participation, by gender
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                A convergence that stalled — shaped by the structure of care.
              </p>
              <ParticipationChart />
            </div>
            <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
              <h3 className="font-serif text-lg font-semibold">
                Occupational segregation & the devaluation of "women's work"
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Median wage by occupation. Female-dominated fields (rose) cluster
                at lower pay despite comparable skill — the devaluation thesis made
                visible.
              </p>
              <SegregationChart />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── Opportunity Calculator ─────────────────── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow mb-2">Interactive Tool</p>
          <h2 className="font-serif text-3xl font-semibold">
            What does the gap cost <span className="text-primary">you?</span>
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Move the inputs to model your own lifetime opportunity cost against an
            unconstrained peer. The estimate updates in real time.
          </p>
        </div>
        <OpportunityCalculator />
      </section>

      {/* ─────────────────── Curated Case Panel ─────────────────── */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-16">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow mb-2">Qualitative Case Studies</p>
            <h2 className="font-serif text-3xl font-semibold">
              The people inside the indicators
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Each story is treated as a data point — annotated with the economic
              theory that explains the lived experience. This panel includes
              community contributions in real time.
            </p>
          </div>
          <LiveCasePanel />
        </div>
      </section>
    </main>
  )
}
