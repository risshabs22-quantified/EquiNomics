"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { RotateCcw, MessageSquare, ArrowRight } from "lucide-react"
import {
  MAJORS,
  MAJOR_ROI_YEARS,
  NEGOTIATION_TREE,
  NEGOTIATION_RAISE,
  NEGOTIATION_CAREER_YEARS,
  NEGOTIATION_OPENING_BASE,
  NEGOTIATION_BEST_BASE,
} from "@/lib/lifespan-data"
import { ChartTooltip } from "@/components/models/model-shell"
import {
  FeaturePanel,
  SliderField,
  StatCell,
  StatGrid,
  money,
  compactMoney,
} from "@/components/lifespan/ui"
import { cn } from "@/lib/utils"

export function ModuleEarlyCareer() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <MajorROI />
      <NegotiationArena />
      <DebtDelta />
    </div>
  )
}

/* ─────────────────────── 1 · Major ROI Calculator ─────────────────────── */

function MajorROI() {
  const [majorId, setMajorId] = useState(MAJORS[0].id)
  const major = MAJORS.find((m) => m.id === majorId)!

  const { series, cumulativeGap, entryGap, menEnd, womenEnd } = useMemo(() => {
    const series = Array.from({ length: MAJOR_ROI_YEARS + 1 }, (_, t) => {
      const men = major.menStart * Math.pow(1 + major.menGrowth, t)
      const women = major.womenStart * Math.pow(1 + major.womenGrowth, t)
      return { year: t, men: +men.toFixed(1), women: +women.toFixed(1) }
    })
    const cumulativeGap =
      series.reduce((s, p) => s + (p.men - p.women), 0) * 1000
    const entryGap = ((major.menStart - major.womenStart) / major.menStart) * 100
    return {
      series,
      cumulativeGap,
      entryGap,
      menEnd: series[series.length - 1].men,
      womenEnd: series[series.length - 1].women,
    }
  }, [major])

  return (
    <FeaturePanel
      index="01"
      kicker="Wage Elasticity"
      title="Major ROI & Wage Elasticity Calculator"
      blurb="Choose a field of study and trace the gendered wage trajectory over the first decade of work — the segregation premium begins on day one."
    >
      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">College major</label>
            <select
              value={majorId}
              onChange={(e) => setMajorId(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {MAJORS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} · {m.field}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-lg border border-border p-4 bg-secondary/30">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Women in field</span>
              <span className="font-mono font-semibold tabular-nums">
                {major.womenShare}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
              <div
                className="h-full bg-chart-3"
                style={{ width: `${major.womenShare}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {major.womenShare > 60
                ? "A feminized field — associated with wage devaluation."
                : major.womenShare < 30
                  ? "A male-dominated field — higher pay, steeper entry barriers."
                  : "A relatively balanced field at entry."}
            </p>
          </div>
        </div>

        <div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="year"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickFormatter={(v) => `Yr ${v}`}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickFormatter={(v) => `$${v}k`}
                width={44}
              />
              <Tooltip content={<ChartTooltip unit="k" formatter={(v) => `$${v}`} />} />
              <Line type="monotone" dataKey="men" name="Men" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="women" name="Women" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-5">
            <StatGrid cols={3}>
              <StatCell label="Entry gap" value={`${entryGap.toFixed(1)}%`} tone="amber" />
              <StatCell label="Yr-10 salaries" value={`$${menEnd.toFixed(0)}k`} sub={`vs $${womenEnd.toFixed(0)}k women`} tone="primary" />
              <StatCell label="10-yr cumulative gap" value={compactMoney(cumulativeGap)} tone="danger" />
            </StatGrid>
          </div>
        </div>
      </div>
    </FeaturePanel>
  )
}

/* ─────────────────────── 2 · Negotiation Arena ─────────────────────── */

const LIFETIME_FACTOR =
  (Math.pow(1 + NEGOTIATION_RAISE, NEGOTIATION_CAREER_YEARS) - 1) / NEGOTIATION_RAISE

function lifetime(base: number) {
  return base * LIFETIME_FACTOR
}

function NegotiationArena() {
  const [nodeId, setNodeId] = useState("start")
  const [path, setPath] = useState<string[]>([])
  const node = NEGOTIATION_TREE[nodeId]
  const isTerminal = node.finalBase !== undefined

  function choose(next: string, label: string) {
    setPath((p) => [...p, label])
    setNodeId(next)
  }
  function restart() {
    setPath([])
    setNodeId("start")
  }

  const result = useMemo(() => {
    if (node.finalBase === undefined) return null
    const chosen = node.finalBase
    const vsSettle = lifetime(chosen) - lifetime(NEGOTIATION_OPENING_BASE)
    const vsBest = lifetime(NEGOTIATION_BEST_BASE) - lifetime(chosen)
    const bars = [
      { label: "Accept as-is", base: NEGOTIATION_OPENING_BASE },
      { label: "Your outcome", base: chosen },
      { label: "Best achievable", base: NEGOTIATION_BEST_BASE },
    ].map((b) => ({ ...b, lifetime: lifetime(b.base) }))
    const maxLt = Math.max(...bars.map((b) => b.lifetime))
    return { chosen, vsSettle, vsBest, bars, maxLt }
  }, [node])

  return (
    <FeaturePanel
      index="02"
      kicker="Branching State Engine"
      title="The First Negotiation Arena"
      blurb="A salary negotiation is a 40-year decision disguised as a 5-minute conversation. Make your choices — the engine compounds the consequences."
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Dialogue */}
        <div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div
              className={cn(
                "px-4 py-3 border-b border-border flex items-center gap-2",
                node.speaker === "Recruiter"
                  ? "bg-primary/[0.06]"
                  : node.speaker === "Narrator"
                    ? "bg-amber/[0.08]"
                    : "bg-secondary/40",
              )}
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="eyebrow">{node.speaker}</span>
            </div>
            <p className="p-4 font-read text-[15px] leading-relaxed">{node.text}</p>
          </div>

          {!isTerminal && node.choices && (
            <div className="mt-4 space-y-2.5">
              {node.choices.map((c) => (
                <button
                  key={c.label}
                  onClick={() => choose(c.next, c.label)}
                  className="group w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3.5 text-left text-sm font-medium hover:border-primary hover:bg-secondary/40 transition-colors"
                >
                  {c.label}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}

          {path.length > 0 && (
            <div className="mt-4">
              <button
                onClick={restart}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Restart negotiation
              </button>
            </div>
          )}
        </div>

        {/* Outcome */}
        <div>
          {result ? (
            <div className="space-y-4">
              <StatGrid cols={2}>
                <StatCell label="Negotiated base" value={money(result.chosen)} tone="primary" size="lg" />
                <StatCell
                  label="Left on the table"
                  value={compactMoney(result.vsBest)}
                  sub="vs. best achievable, lifetime"
                  tone="amber"
                />
              </StatGrid>
              <div className="rounded-lg border border-border p-4">
                <p className="eyebrow mb-3">40-year lifetime earnings</p>
                <div className="space-y-2.5">
                  {result.bars.map((b) => (
                    <div key={b.label} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 text-xs text-muted-foreground">{b.label}</span>
                      <div className="flex-1 h-5 rounded bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500",
                            b.label === "Your outcome" ? "bg-primary" : "bg-muted-foreground/40",
                          )}
                          style={{ width: `${(b.lifetime / result.maxLt) * 100}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-mono text-xs tabular-nums">
                        {compactMoney(b.lifetime)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {node.insight && (
                <p className="rounded-lg bg-secondary/50 border border-border p-3 text-xs text-muted-foreground leading-relaxed">
                  {node.insight}
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground h-full flex flex-col justify-center">
              <p className="font-display text-lg text-foreground mb-1">
                Opening offer: {money(NEGOTIATION_OPENING_BASE)}
              </p>
              Your 40-year outcome will be calculated once you reach the end of the
              conversation.
            </div>
          )}
        </div>
      </div>
    </FeaturePanel>
  )
}

/* ─────────────────────── 3 · Student Debt Delta ─────────────────────── */

function amortize(principal: number, apr: number, payment: number) {
  const r = apr / 12
  if (payment <= principal * r) {
    return { months: Infinity, totalInterest: Infinity, schedule: [] as { m: number; bal: number }[] }
  }
  const n = -Math.log(1 - (r * principal) / payment) / Math.log(1 + r)
  const months = Math.ceil(n)
  const schedule: { m: number; bal: number }[] = []
  let bal = principal
  for (let m = 0; m <= months; m++) {
    schedule.push({ m, bal: Math.max(0, Math.round(bal)) })
    bal = bal * (1 + r) - payment
  }
  const totalInterest = payment * months - principal
  return { months, totalInterest, schedule }
}

function DebtDelta() {
  const [principal, setPrincipal] = useState(38000)
  const [apr, setApr] = useState(6.5)
  const [salary, setSalary] = useState(60000)
  const [gap, setGap] = useState(16)
  const [share, setShare] = useState(10)

  const data = useMemo(() => {
    const menPay = ((salary / 12) * share) / 100
    const womenPay = (((salary * (1 - gap / 100)) / 12) * share) / 100
    const men = amortize(principal, apr / 100, menPay)
    const women = amortize(principal, apr / 100, womenPay)

    const maxLen = Math.max(men.schedule.length, women.schedule.length)
    const merged = Array.from({ length: Math.ceil(maxLen / 6) + 1 }, (_, i) => {
      const m = i * 6
      return {
        month: m,
        men: men.schedule[m]?.bal ?? 0,
        women: women.schedule[m]?.bal ?? (m < women.schedule.length ? 0 : null),
      }
    })

    return {
      menPay,
      womenPay,
      menYears: men.months / 12,
      womenYears: women.months / 12,
      menInt: men.totalInterest,
      womenInt: women.totalInterest,
      deltaYears: (women.months - men.months) / 12,
      deltaInt: women.totalInterest - men.totalInterest,
      merged,
      neverWoman: !isFinite(women.months),
    }
  }, [principal, apr, salary, gap, share])

  return (
    <FeaturePanel
      index="03"
      kicker="Amortization Delta"
      title="Student Debt Amortization Delta"
      blurb="A lower entry wage means smaller payments, a longer payoff, and more interest paid — the gender pay gap quietly taxes student debt too."
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-5">
          <SliderField label="Loan principal" value={principal} onChange={setPrincipal} min={5000} max={150000} step={1000} format={(v) => money(v)} />
          <SliderField label="Interest rate (APR)" value={apr} onChange={setApr} min={3} max={11} step={0.1} format={(v) => `${v.toFixed(1)}%`} />
          <SliderField label="Entry salary (men)" value={salary} onChange={setSalary} min={35000} max={120000} step={1000} format={(v) => money(v)} />
          <SliderField label="Gender pay gap" value={gap} onChange={setGap} min={0} max={30} step={1} format={(v) => `${v}%`} accent="amber" />
          <SliderField label="Income toward loan" value={share} onChange={setShare} min={5} max={25} step={1} format={(v) => `${v}%`} hint="Share of gross income allocated to repayment." />
        </div>

        <div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.merged} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${Math.round(v / 12)}y`} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => compactMoney(v)} width={46} />
              <Tooltip content={<ChartTooltip formatter={(v) => compactMoney(v)} />} labelFormatter={(l) => `Month ${l}`} />
              <Area type="monotone" dataKey="men" name="Men · balance" stroke="var(--color-chart-1)" fill="transparent" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="women" name="Women · balance" stroke="var(--color-chart-3)" fill="transparent" strokeWidth={2.5} dot={false} connectNulls />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-5">
            <StatGrid cols={3}>
              <StatCell
                label="Payoff time"
                value={data.neverWoman ? "—" : `${data.menYears.toFixed(1)}y`}
                sub={data.neverWoman ? "women: never amortizes" : `vs ${data.womenYears.toFixed(1)}y women`}
                tone="primary"
              />
              <StatCell
                label="Extra time (women)"
                value={data.neverWoman ? "∞" : `+${data.deltaYears.toFixed(1)}y`}
                tone="amber"
              />
              <StatCell
                label="Extra interest (women)"
                value={data.neverWoman ? "∞" : compactMoney(data.deltaInt)}
                tone="danger"
              />
            </StatGrid>
            {data.neverWoman && (
              <p className="mt-3 text-xs text-destructive">
                At this wage and repayment share, the woman's payment doesn't cover
                monthly interest — the balance never amortizes. Raise income share or
                lower the gap.
              </p>
            )}
          </div>
        </div>
      </div>
    </FeaturePanel>
  )
}
