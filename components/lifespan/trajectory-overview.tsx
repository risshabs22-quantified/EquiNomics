"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartTooltip } from "@/components/models/model-shell"
import { StatCell, StatGrid, compactMoney } from "@/components/lifespan/ui"
import { cn } from "@/lib/utils"

interface Scenario {
  negotiates: boolean
  hasChildren: boolean
  transparency: boolean
}

const START_AGE = 22
const END_AGE = 65
const SAVINGS_RATE = 0.12
const RETURN = 0.06

/** Project lifetime earnings + accumulated wealth for both tracks. */
function useTrajectory(s: Scenario) {
  return useMemo(() => {
    const baseStart = 68000
    const entryGap = 0.1 - (s.negotiates ? 0.07 : 0) - (s.transparency ? 0.02 : 0)
    const menGrowth = 0.035
    const womenGrowth = 0.035 - (s.transparency ? 0 : 0.006)
    const childAge = 31

    let menCum = 0
    let womenCum = 0
    let menWealth = 0
    let womenWealth = 0

    const rows = []
    for (let age = START_AGE; age <= END_AGE; age++) {
      const t = age - START_AGE
      const menWage = baseStart * Math.pow(1 + menGrowth, t)

      let womenWage = baseStart * (1 - entryGap) * Math.pow(1 + womenGrowth, t)
      if (s.hasChildren && age >= childAge) {
        const yearsSince = age - childAge
        // Career break (2 yrs near-zero) then a persistent, slowly-recovering penalty.
        const breakFactor = yearsSince < 2 ? 0.25 : 1
        const penalty = Math.max(0.12, 0.28 - yearsSince * 0.012)
        womenWage = womenWage * breakFactor * (1 - penalty)
      }

      menCum += menWage
      womenCum += womenWage
      menWealth = menWealth * (1 + RETURN) + menWage * SAVINGS_RATE
      womenWealth = womenWealth * (1 + RETURN) + womenWage * SAVINGS_RATE

      rows.push({
        age,
        men: Math.round(menCum),
        women: Math.round(womenCum),
      })
    }

    const lifetimeGap = menCum - womenCum
    const wealthGap = menWealth - womenWealth
    const womenPct = menCum ? (womenCum / menCum) * 100 : 100
    return {
      rows,
      lifetimeGap,
      wealthGap,
      womenPct,
      menWealth,
      womenWealth,
    }
  }, [s])
}

const TOGGLES: { key: keyof Scenario; label: string }[] = [
  { key: "negotiates", label: "Negotiates first salary" },
  { key: "hasChildren", label: "Has children" },
  { key: "transparency", label: "Pay transparency in effect" },
]

const STAGES = [
  { age: 22, label: "First job" },
  { age: 31, label: "Children" },
  { age: 45, label: "Mid-career" },
  { age: 60, label: "Pre-retirement" },
]

export function TrajectoryOverview() {
  const [scenario, setScenario] = useState<Scenario>({
    negotiates: false,
    hasChildren: true,
    transparency: false,
  })
  const data = useTrajectory(scenario)

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <p className="eyebrow mb-2">The Thesis · Cumulative Lifetime Earnings</p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          One gap doesn't close. It compounds — for 43 years.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Toggle the life events below to watch how small early divergences accumulate
          across an entire working life, from the first job to retirement.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              onClick={() =>
                setScenario((s) => ({ ...s, [t.key]: !s[t.key] }))
              }
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                scenario[t.key]
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="menFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="womenFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="age"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickFormatter={(v) => compactMoney(v)}
              width={48}
            />
            <Tooltip
              content={<ChartTooltip formatter={(v) => compactMoney(v)} />}
              labelFormatter={(l) => `Age ${l}`}
            />
            {STAGES.map((st) => (
              <ReferenceLine
                key={st.age}
                x={st.age}
                stroke="var(--border)"
                label={{
                  value: st.label,
                  position: "top",
                  fontSize: 9,
                  fill: "var(--muted-foreground)",
                }}
              />
            ))}
            <Area
              type="monotone"
              dataKey="men"
              name="Men (cumulative)"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              fill="url(#menFill)"
            />
            <Area
              type="monotone"
              dataKey="women"
              name="Women (cumulative)"
              stroke="var(--color-chart-3)"
              strokeWidth={2.5}
              fill="url(#womenFill)"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-6">
          <StatGrid cols={3}>
            <StatCell
              label="Lifetime earnings gap"
              value={compactMoney(data.lifetimeGap)}
              tone="amber"
              size="lg"
            />
            <StatCell
              label="Women earn, per male $1"
              value={`${(data.womenPct).toFixed(0)}¢`}
              sub="cumulative, age 65"
              tone="primary"
            />
            <StatCell
              label="Projected wealth gap · 65"
              value={compactMoney(data.wealthGap)}
              sub={`at ${Math.round(SAVINGS_RATE * 100)}% savings, ${Math.round(RETURN * 100)}% return`}
              tone="danger"
            />
          </StatGrid>
        </div>
      </div>
    </div>
  )
}
