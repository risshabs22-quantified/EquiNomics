"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Check, RotateCcw } from "lucide-react"
import {
  FRAMEWORKS,
  BILLS,
  DEMO_GROUPS,
  DEMO_REFERENCE_GAP,
} from "@/lib/accountability-data"
import { useSovereignProjection } from "@/hooks/use-sovereign-projection"
import { ChartTooltip } from "@/components/models/model-shell"
import { FeaturePanel, StatCell, StatGrid } from "@/components/lifespan/ui"
import { cn } from "@/lib/utils"

export function ModuleMacroPolicy() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <SovereignStressTester />
      <BillTracker />
    </div>
  )
}

/* ─────────────────── 1 · Sovereign Policy Stress-Tester ─────────────────── */

function SovereignStressTester() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const result = useSovereignProjection(selected)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <FeaturePanel
      index="01"
      kicker="Compare countries"
      title="What if the US copied another country's policies?"
      blurb="Pick a country's policy package — paid leave, childcare, transparency — and see what might happen to GDP, workforce participation, and the pay gap over 20 years if we imported it here."
    >
      {/* Framework selector */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="eyebrow">Apply policy frameworks</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setSelected(new Set(FRAMEWORKS.map((f) => f.id)))}
            className="text-xs text-primary hover:underline"
          >
            Apply all
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {FRAMEWORKS.map((f) => {
          const on = selected.has(f.id)
          return (
            <button
              key={f.id}
              onClick={() => toggle(f.id)}
              aria-pressed={on}
              className={cn(
                "text-left rounded-lg border p-3.5 transition-colors",
                on
                  ? "border-primary bg-primary/[0.06]"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl leading-none">{f.flag}</span>
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {on ? <Check className="h-3 w-3" /> : ""}
                </span>
              </div>
              <div className="mt-2 font-semibold text-sm leading-tight">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.country}</div>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug">{f.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Projection */}
      <StatGrid cols={4}>
        <StatCell label="GDP uplift · 2046" value={`+$${result.finalGdpUplift.toFixed(2)}T`} tone="academic" size="lg" />
        <StatCell label="Women's LFPR · 2046" value={`${result.finalWomenLFPR.toFixed(1)}%`} sub="from 57.4%" tone="primary" />
        <StatCell label="Pay gap · 2046" value={`${result.finalPayGap.toFixed(1)}%`} sub="from 16.0%" tone="amber" />
        <StatCell label="Growth premium" value={`+${result.growthAddBps}bps`} sub="annual, steady-state" />
      </StatGrid>

      <div className="mt-6">
        <div className="flex items-center gap-4 mb-2 text-xs">
          <Legend color="var(--color-chart-1)" label="GDP — with policies" />
          <Legend color="var(--muted-foreground)" label="Status quo" dashed />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={result.series} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="gdpFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `$${v}T`} width={52} domain={["auto", "auto"]} />
            <Tooltip content={<ChartTooltip formatter={(v) => `$${v}T`} />} labelFormatter={(l) => `Year ${l}`} />
            <Line type="monotone" dataKey="gdpBase" name="Status quo" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
            <Area type="monotone" dataKey="gdpPolicy" name="With policies" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#gdpFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </FeaturePanel>
  )
}

/* ─────────────────── 2 · Legislative Bill Tracker ─────────────────── */

function BillTracker() {
  const [passed, setPassed] = useState<Record<string, boolean>>(
    Object.fromEntries(BILLS.map((b) => [b.id, b.status.includes("Enacted")])),
  )

  const togglePass = (id: string) =>
    setPassed((p) => ({ ...p, [id]: !p[id] }))

  const { groups, composite, baseComposite, passedCount } = useMemo(() => {
    const reduction = BILLS.reduce(
      (s, b) => s + (passed[b.id] ? b.reductionPp : 0),
      0,
    )
    const groups = DEMO_GROUPS.map((g) => {
      const applied = reduction * (g.baseGapPp / DEMO_REFERENCE_GAP)
      return {
        ...g,
        projected: Math.max(4, +(g.baseGapPp - applied).toFixed(1)),
      }
    })
    const composite = +(groups.reduce((s, g) => s + g.projected, 0) / groups.length).toFixed(1)
    const baseComposite = +(DEMO_GROUPS.reduce((s, g) => s + g.baseGapPp, 0) / DEMO_GROUPS.length).toFixed(1)
    return {
      groups,
      composite,
      baseComposite,
      passedCount: BILLS.filter((b) => passed[b.id]).length,
    }
  }, [passed])

  const maxGap = Math.max(...DEMO_GROUPS.map((g) => g.baseGapPp))

  return (
    <FeaturePanel
      index="02"
      kicker="What if it passes?"
      title="Legislation impact tracker"
      blurb="Toggle real federal bills between fail and pass and watch the projected wage gap shift across different groups — weighted so the bills that help the most-penalized people move the needle most."
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        {/* Bills */}
        <div className="space-y-2.5">
          {BILLS.map((b) => {
            const on = passed[b.id]
            return (
              <div
                key={b.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{b.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {b.status} · {b.sponsor}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{b.summary}</p>
                </div>
                <button
                  onClick={() => togglePass(b.id)}
                  aria-pressed={on}
                  className={cn(
                    "shrink-0 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    on
                      ? "bg-academic/15 text-academic border border-academic/40"
                      : "bg-secondary text-muted-foreground border border-border",
                  )}
                >
                  {on ? "PASSED" : "FAILED"}
                </button>
              </div>
            )
          })}
        </div>

        {/* Recalculated gaps */}
        <div className="space-y-4">
          <StatGrid cols={2}>
            <StatCell label="Composite gap" value={`${composite}%`} sub={`from ${baseComposite}%`} tone="primary" size="lg" />
            <StatCell label="Bills passed" value={`${passedCount}/${BILLS.length}`} tone="academic" />
          </StatGrid>
          <div className="rounded-lg border border-border p-4">
            <h4 className="eyebrow mb-3">Projected gap by group</h4>
            <div className="space-y-3">
              {groups.map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{g.label}</span>
                    <span className="font-mono tabular-nums">
                      <span className="text-foreground font-semibold">{g.projected}%</span>
                      <span className="text-muted-foreground/60 ml-1 line-through">{g.baseGapPp}%</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-muted-foreground/25" style={{ width: `${(g.baseGapPp / maxGap) * 100}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-primary transition-all duration-500" style={{ width: `${(g.projected / maxGap) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FeaturePanel>
  )
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span
        className="inline-block h-0.5 w-5"
        style={{
          background: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)`
            : color,
        }}
      />
      {label}
    </span>
  )
}
