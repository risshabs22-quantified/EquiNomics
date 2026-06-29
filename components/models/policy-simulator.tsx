"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { RotateCcw, TrendingDown } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { POLICY_LEVERS, POLICY_BASE_GAP } from "@/lib/models-data"
import { usePolicySimulation, type PolicyInputs } from "@/hooks/use-policy-simulation"
import { ChartTooltip } from "@/components/models/model-shell"

const DEFAULTS: PolicyInputs = {
  leave: POLICY_LEVERS.find((l) => l.id === "leave")!.default,
  transparency: POLICY_LEVERS.find((l) => l.id === "transparency")!.default,
  childcare: POLICY_LEVERS.find((l) => l.id === "childcare")!.default,
  flex: POLICY_LEVERS.find((l) => l.id === "flex")!.default,
}

export function PolicySimulator({ compact = false }: { compact?: boolean }) {
  const [inputs, setInputs] = useState<PolicyInputs>(DEFAULTS)
  const result = usePolicySimulation(inputs)

  const set = (id: keyof PolicyInputs, v: number) =>
    setInputs((prev) => ({ ...prev, [id]: v }))

  return (
    <div className="grid lg:grid-cols-[minmax(0,360px)_1fr] gap-px bg-border border border-border rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="bg-background p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="eyebrow">Policy Levers</h3>
          <button
            onClick={() => setInputs(DEFAULTS)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

        <div className="space-y-6">
          {POLICY_LEVERS.map((lever) => {
            const value = inputs[lever.id]
            return (
              <div key={lever.id}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className="text-sm font-medium">{lever.label}</label>
                  <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                    {value}
                    <span className="text-muted-foreground text-xs ml-1">
                      {lever.unit}
                    </span>
                  </span>
                </div>
                <Slider
                  value={[value]}
                  min={lever.min}
                  max={lever.max}
                  step={lever.step}
                  onValueChange={([v]) => set(lever.id, v)}
                />
                {!compact && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {lever.blurb}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Output */}
      <div className="bg-background p-6">
        <div className="grid grid-cols-3 gap-px bg-border border border-border rounded-md overflow-hidden mb-6">
          <Stat
            label="Projected gap · 2036"
            value={`${result.finalGap.toFixed(1)}%`}
            tone="primary"
          />
          <Stat
            label="Reduction vs. today"
            value={`−${result.reductionPP.toFixed(1)}pp`}
            sub={`${result.reductionPct.toFixed(0)}% smaller`}
            tone="academic"
          />
          <Stat
            label="Halve-the-gap year"
            value={result.yearsToHalfGap ? `${2026 + result.yearsToHalfGap}` : "—"}
            sub={result.yearsToHalfGap ? `in ${result.yearsToHalfGap} yrs` : "not within 10 yrs"}
            tone="amber"
          />
        </div>

        <div className="flex items-center gap-4 mb-2 text-xs">
          <Legend color="var(--color-chart-1)" label="With your policy mix" />
          <Legend color="var(--muted-foreground)" label="Status quo" dashed />
        </div>

        <ResponsiveContainer width="100%" height={compact ? 240 : 300}>
          <AreaChart
            data={result.series}
            margin={{ top: 8, right: 12, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="polyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis
              domain={[0, POLICY_BASE_GAP + 1]}
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<ChartTooltip unit="%" formatter={(v) => v.toFixed(1)} />} />
            <ReferenceLine
              y={POLICY_BASE_GAP / 2}
              stroke="var(--color-chart-3)"
              strokeDasharray="4 4"
              label={{
                value: "½ today's gap",
                position: "insideTopRight",
                fontSize: 10,
                fill: "var(--color-chart-3)",
              }}
            />
            <Line
              type="monotone"
              dataKey="statusQuo"
              name="Status quo"
              stroke="var(--muted-foreground)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="projected"
              name="With your policy mix"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              fill="url(#polyFill)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Contribution decomposition */}
        <div className="mt-6">
          <h4 className="eyebrow mb-3 flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5" /> Long-run contribution by lever
          </h4>
          <div className="space-y-2.5">
            {result.contributions.map((c) => {
              const pct = result.totalEffect
                ? (c.effect / result.totalEffect) * 100
                : 0
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-sm text-muted-foreground truncate">
                    {c.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.max(2, pct)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-xs tabular-nums">
                    −{c.effect.toFixed(2)}pp
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub?: string
  tone: "primary" | "academic" | "amber"
}) {
  const color =
    tone === "primary"
      ? "text-primary"
      : tone === "academic"
        ? "text-academic"
        : "text-amber"
  return (
    <div className="bg-background p-3">
      <div className="eyebrow leading-tight mb-1.5">{label}</div>
      <div className={`font-mono text-2xl font-bold tabular-nums ${color}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  )
}

function Legend({
  color,
  label,
  dashed,
}: {
  color: string
  label: string
  dashed?: boolean
}) {
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
