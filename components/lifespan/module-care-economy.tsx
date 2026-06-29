"use client"

import { useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartTooltip } from "@/components/models/model-shell"
import {
  FeaturePanel,
  SliderField,
  StatCell,
  StatGrid,
  compactMoney,
} from "@/components/lifespan/ui"
import { ShadowEconomy } from "@/components/models/shadow-economy"

export function ModuleCareEconomy() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <TimeUseTracker />
      <FeaturePanel
        index="05"
        kicker="The Care Economy, Invoiced"
        title="The Shadow GDP Invoice Generator"
        blurb="Convert your unpaid hours into localized market-rate wages and issue a formal, downloadable invoice — to society itself."
      >
        <ShadowEconomy />
      </FeaturePanel>
      <MotherhoodProjector />
    </div>
  )
}

/* ─────────────────────── 4 · Time-Use Disparity Tracker ─────────────────────── */

const SEGMENTS = [
  { id: "career", label: "Career work", color: "var(--color-chart-1)" },
  { id: "domestic", label: "Domestic labor", color: "var(--color-chart-3)" },
  { id: "childcare", label: "Childcare", color: "var(--color-chart-2)" },
  { id: "mental", label: "Mental / cognitive load", color: "var(--color-chart-4)" },
] as const

type SegId = (typeof SEGMENTS)[number]["id"]

const BENCHMARKS: Record<string, Record<SegId, number>> = {
  "Avg. woman": { career: 5.5, domestic: 2.3, childcare: 1.1, mental: 0.9 },
  "Avg. man": { career: 6.2, domestic: 1.4, childcare: 0.6, mental: 0.5 },
}

function StackedDay({
  values,
  label,
}: {
  values: Record<SegId, number>
  label: string
}) {
  const total = SEGMENTS.reduce((s, seg) => s + values[seg.id], 0)
  const secondShift = values.domestic + values.childcare + values.mental
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {secondShift.toFixed(1)}h unpaid
        </span>
      </div>
      <div className="flex h-7 w-full rounded-md overflow-hidden bg-secondary">
        {SEGMENTS.map((seg) => {
          const w = total ? (values[seg.id] / 24) * 100 : 0
          return (
            <div
              key={seg.id}
              style={{ width: `${w}%`, background: seg.color }}
              title={`${seg.label}: ${values[seg.id]}h`}
            />
          )
        })}
      </div>
    </div>
  )
}

function TimeUseTracker() {
  const [hours, setHours] = useState<Record<SegId, number>>({
    career: 6,
    domestic: 2.5,
    childcare: 1.5,
    mental: 1.5,
  })

  const total = SEGMENTS.reduce((s, seg) => s + hours[seg.id], 0)
  const secondShift = hours.domestic + hours.childcare + hours.mental
  const vsMan = secondShift - (BENCHMARKS["Avg. man"].domestic + BENCHMARKS["Avg. man"].childcare + BENCHMARKS["Avg. man"].mental)
  const weeklyUnpaid = secondShift * 7

  return (
    <FeaturePanel
      index="04"
      kicker="Daily Allocation"
      title="Time-Use Disparity Tracker"
      blurb="Log a typical day. The 'second shift' — domestic labor, childcare, and the invisible cognitive load — is work that no paycheck records."
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-5">
          {SEGMENTS.map((seg) => (
            <SliderField
              key={seg.id}
              label={seg.label}
              value={hours[seg.id]}
              onChange={(v) => setHours((h) => ({ ...h, [seg.id]: v }))}
              min={0}
              max={16}
              step={0.5}
              format={(v) => `${v.toFixed(1)}h`}
            />
          ))}
          <div
            className={
              total > 24
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            Total logged: <span className="font-mono">{total.toFixed(1)}h</span> / 24h
            {total > 24 && " — over a 24-hour day"}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-4">
            <StackedDay values={hours} label="You" />
            {Object.entries(BENCHMARKS).map(([name, v]) => (
              <StackedDay key={name} values={v} label={name} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {SEGMENTS.map((seg) => (
              <span key={seg.id} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: seg.color }} />
                {seg.label}
              </span>
            ))}
          </div>
          <StatGrid cols={3}>
            <StatCell label="Your second shift" value={`${secondShift.toFixed(1)}h`} sub="per day, unpaid" tone="amber" />
            <StatCell label="vs. avg. man" value={`${vsMan >= 0 ? "+" : ""}${vsMan.toFixed(1)}h`} sub="daily unpaid gap" tone={vsMan >= 0 ? "danger" : "academic"} />
            <StatCell label="Weekly unpaid" value={`${weeklyUnpaid.toFixed(0)}h`} sub="≈ a second job" tone="primary" />
          </StatGrid>
        </div>
      </div>
    </FeaturePanel>
  )
}

/* ─────────────────────── 6 · Motherhood Penalty Projector ─────────────────────── */

function MotherhoodProjector() {
  const [salary, setSalary] = useState(70000)
  const [children, setChildren] = useState(2)
  const [breakMonths, setBreakMonths] = useState(12)

  const { series, motherEnd, fatherEnd, cumPenalty } = useMemo(() => {
    const years = 15
    const growth = 0.04
    const fatherBonus = 0.06 // "fatherhood premium"
    const perChildPenalty = 0.04
    const breakYears = breakMonths / 12

    let cumPenalty = 0
    const series = Array.from({ length: years + 1 }, (_, t) => {
      const counterfactual = salary * Math.pow(1 + growth, t)
      const father = salary * (1 + fatherBonus) * Math.pow(1 + growth, t)

      let mother: number
      if (t < breakYears) {
        mother = salary * 0.15 * Math.pow(1 + growth, t) // near-zero during break
      } else {
        const penalty = Math.min(0.4, children * perChildPenalty + Math.max(0, 0.1 - (t - breakYears) * 0.01))
        mother = salary * (1 - penalty) * Math.pow(1 + growth, t)
      }
      cumPenalty += counterfactual - mother
      return {
        year: t,
        mother: Math.round(mother),
        father: Math.round(father),
        counterfactual: Math.round(counterfactual),
      }
    })
    return {
      series,
      motherEnd: series[series.length - 1].mother,
      fatherEnd: series[series.length - 1].father,
      cumPenalty,
    }
  }, [salary, children, breakMonths])

  return (
    <FeaturePanel
      index="06"
      kicker="Earnings Velocity"
      title="The Motherhood Penalty Projector"
      blurb="Children bend two trajectories in opposite directions: mothers absorb a wage penalty while fathers often receive a premium. Watch the divergence."
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-5">
          <SliderField label="Pre-birth salary" value={salary} onChange={setSalary} min={35000} max={200000} step={5000} format={(v) => compactMoney(v)} />
          <SliderField label="Number of children" value={children} onChange={setChildren} min={1} max={4} step={1} format={(v) => String(v)} />
          <SliderField label="Career break" value={breakMonths} onChange={setBreakMonths} min={0} max={48} step={1} format={(v) => `${v} mo`} accent="amber" />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `+${v}y`} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => compactMoney(v)} width={46} />
              <Tooltip content={<ChartTooltip formatter={(v) => compactMoney(v)} />} labelFormatter={(l) => `${l} yrs after first birth`} />
              <Line type="monotone" dataKey="father" name="Father" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="counterfactual" name="No-child counterfactual" stroke="var(--muted-foreground)" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
              <Line type="monotone" dataKey="mother" name="Mother" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-5">
            <StatGrid cols={3}>
              <StatCell label="Mother · yr 15" value={compactMoney(motherEnd)} tone="primary" />
              <StatCell label="Father · yr 15" value={compactMoney(fatherEnd)} tone="academic" />
              <StatCell label="15-yr cumulative penalty" value={compactMoney(cumPenalty)} tone="danger" />
            </StatGrid>
          </div>
        </div>
      </div>
    </FeaturePanel>
  )
}
