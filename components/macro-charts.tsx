"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PAY_GAP_SERIES, OCCUPATION_WAGE_DATA } from "@/lib/data"

const axisStyle = { fontSize: 11, fontFamily: "var(--font-mono)" }

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="font-mono font-semibold mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          {p.name}: <span className="text-foreground tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

/** Pay gap narrowing, 1980–2024 (cents earned per $1). */
export function PayGapTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={PAY_GAP_SERIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gapFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="year" tick={axisStyle} stroke="var(--muted-foreground)" />
        <YAxis
          domain={[50, 100]}
          tick={axisStyle}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}¢`}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="payGapCents"
          name="Women's ¢ per $1"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          fill="url(#gapFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

/** Labor force participation, women vs men. */
export function ParticipationChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={PAY_GAP_SERIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="year" tick={axisStyle} stroke="var(--muted-foreground)" />
        <YAxis
          domain={[45, 80]}
          tick={axisStyle}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="lfprWomen"
          name="Women"
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="lfprMen"
          name="Men"
          stroke="var(--color-chart-2)"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/**
 * Occupational segregation: median wage vs. share of women. The downward slope
 * is the devaluation thesis made visible.
 */
export function SegregationChart() {
  const data = [...OCCUPATION_WAGE_DATA].sort((a, b) => a.pctWomen - b.pctWomen)
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          tick={axisStyle}
          stroke="var(--muted-foreground)"
          tickFormatter={(v) => `$${v}k`}
        />
        <YAxis
          type="category"
          dataKey="occupation"
          tick={{ ...axisStyle, fontSize: 10 }}
          stroke="var(--muted-foreground)"
          width={120}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: "var(--secondary)", opacity: 0.4 }}
        />
        <Bar dataKey="medianWage" name="Median wage ($k)" radius={[0, 3, 3, 0]}>
          {data.map((d) => (
            <Cell
              key={d.occupation}
              // More female-dominated → cooler/lower; gradient by feminization.
              fill={
                d.pctWomen > 70
                  ? "var(--color-chart-3)"
                  : d.pctWomen > 40
                    ? "var(--color-chart-1)"
                    : "var(--color-chart-2)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
