"use client"

import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { LENSES, type Lens } from "@/lib/models-data"
import { ChartTooltip } from "@/components/models/model-shell"
import { cn } from "@/lib/utils"

type Mode = "dollars" | "cents"

export function IntersectionalExaminer() {
  const [lensId, setLensId] = useState<Lens>("race")
  const [mode, setMode] = useState<Mode>("cents")

  const lens = LENSES.find((l) => l.id === lensId)!

  const { chartData, worst, refLabel } = useMemo(() => {
    const ref = lens.referenceValue
    const chartData = lens.rows.map((r) => ({
      category: r.category,
      men: mode === "cents" ? Math.round((r.men / ref) * 100) : r.men,
      women: mode === "cents" ? Math.round((r.women / ref) * 100) : r.women,
      gap: Math.round(((r.men - r.women) / r.men) * 100),
    }))
    // Worst compounding cell = lowest women's value relative to reference.
    const worst = lens.rows.reduce((acc, r) =>
      r.women < acc.women ? r : acc,
    )
    return {
      chartData,
      worst: {
        category: worst.category,
        cents: Math.round((worst.women / ref) * 100),
        gap: Math.round(((worst.men - worst.women) / worst.men) * 100),
      },
      refLabel: lens.referenceLabel,
    }
  }, [lens, mode])

  return (
    <div className="space-y-6">
      {/* Lens toggles */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="eyebrow mr-1">Intersect with</span>
        <div className="inline-flex rounded-md border border-border overflow-hidden">
          {LENSES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLensId(l.id)}
              className={cn(
                "px-3.5 py-2 text-sm font-medium transition-colors border-r border-border last:border-r-0",
                lensId === l.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              {l.label.replace("Gender × ", "")}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-md border border-border overflow-hidden ml-auto">
          {(["cents", "dollars"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors border-r border-border last:border-r-0",
                mode === m
                  ? "bg-secondary text-foreground"
                  : "bg-background text-muted-foreground hover:bg-secondary",
              )}
            >
              {m === "cents" ? "¢ per ref. $1" : "Median $K"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground max-w-3xl">{lens.caption}</p>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Chart */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-4 mb-3 text-xs">
            <Legend color="var(--color-chart-1)" label="Men" />
            <Legend color="var(--color-chart-3)" label="Women" />
            {mode === "cents" && (
              <span className="ml-auto text-muted-foreground">
                100 = {refLabel}
              </span>
            )}
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} margin={{ top: 16, right: 8, left: -16, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickFormatter={(v) => (mode === "cents" ? `${v}` : `$${v}k`)}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    unit={mode === "cents" ? "¢" : "k"}
                    formatter={(v) => (mode === "dollars" ? `$${v}` : String(v))}
                  />
                }
                cursor={{ fill: "var(--secondary)", opacity: 0.5 }}
              />
              {mode === "cents" && (
                <ReferenceLine
                  y={100}
                  stroke="var(--color-chart-1)"
                  strokeDasharray="4 4"
                />
              )}
              <Bar dataKey="men" name="Men" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]}>
                <LabelList
                  dataKey="men"
                  position="top"
                  fontSize={10}
                  fill="var(--muted-foreground)"
                />
              </Bar>
              <Bar dataKey="women" name="Women" fill="var(--color-chart-3)" radius={[2, 2, 0, 0]}>
                <LabelList
                  dataKey="women"
                  position="top"
                  fontSize={10}
                  fill="var(--muted-foreground)"
                />
                {chartData.map((d) => (
                  <Cell key={d.category} fill="var(--color-chart-3)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compounding readout */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="eyebrow mb-2">Where the gap hits hardest</h4>
            <p className="font-display text-2xl font-bold leading-tight">
              {worst.category} women
            </p>
            <p className="mt-3 font-mono text-4xl font-bold text-amber tabular-nums">
              {worst.cents}¢
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              earned per $1.00 of {refLabel.toLowerCase()} — two penalties stacked
              together, not added up.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            {chartData.map((d) => (
              <div
                key={d.category}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
              >
                <span className="text-muted-foreground">{d.category}</span>
                <span className="font-mono tabular-nums">
                  <span className="text-foreground font-medium">{d.gap}%</span>
                  <span className="text-muted-foreground text-xs ml-1">within-group gap</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  )
}
