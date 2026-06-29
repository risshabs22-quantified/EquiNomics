"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Clock } from "lucide-react"
import {
  RADAR_PROFILES,
  RADAR_VECTORS,
  DEFICIT_ANNUAL_USD,
} from "@/lib/accountability-data"
import { ChartTooltip } from "@/components/models/model-shell"
import { FeaturePanel, SliderField, StatCell, StatGrid } from "@/components/lifespan/ui"
import { cn } from "@/lib/utils"

export function ModuleRadar() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <WealthEquityRadar />
      <DeficitClock />
    </div>
  )
}

/* ─────────────────── 5 · Compounding Wealth Equity Radar ─────────────────── */

function WealthEquityRadar() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["men", "white", "black"]),
  )

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      // Always keep at least one profile visible.
      if (next.has(id)) {
        if (next.size > 1) next.delete(id)
      } else next.add(id)
      return next
    })

  const profiles = RADAR_PROFILES.filter((p) => selected.has(p.id))

  const data = useMemo(
    () =>
      RADAR_VECTORS.map((vector, i) => {
        const row: Record<string, string | number> = { vector }
        for (const p of profiles) row[p.id] = p.values[i]
        return row
      }),
    [profiles],
  )

  return (
    <FeaturePanel
      index="05"
      kicker="Intersectional · Futures"
      title="The Compounding Wealth Equity Radar"
      blurb="Five vectors of economic opportunity. Overlay demographic profiles to see the geometric shrinkage where identities — and their penalties — intersect."
    >
      <div className="flex flex-wrap gap-2 mb-5">
        {RADAR_PROFILES.map((p) => {
          const on = selected.has(p.id)
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors",
                on ? "border-foreground/30 bg-secondary" : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: on ? p.color : "var(--border)" }} />
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-center">
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="vector" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} angle={90} />
            <Tooltip content={<ChartTooltip />} />
            {profiles.map((p) => (
              <Radar
                key={p.id}
                name={p.label}
                dataKey={p.id}
                stroke={p.color}
                fill={p.color}
                fillOpacity={p.id === "men" ? 0.04 : 0.16}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>

        <div>
          <h4 className="eyebrow mb-3">Opportunity index</h4>
          <div className="space-y-2">
            {profiles.map((p) => {
              const idx = Math.round(p.values.reduce((s, v) => s + v, 0) / p.values.length)
              return (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="flex-1 text-sm text-muted-foreground truncate">{p.label}</span>
                  <span className="font-mono text-sm font-semibold tabular-nums">{idx}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            The index is the mean across all five vectors (100 = parity with the
            best-resourced group). Venture funding collapses the polygon most sharply.
          </p>
        </div>
      </div>
    </FeaturePanel>
  )
}

/* ─────────────────── 6 · Generational Wealth Deficit Clock ─────────────────── */

const YEAR_MS = 365.25 * 24 * 3600 * 1000

function DeficitClock() {
  const [annualT, setAnnualT] = useState(DEFICIT_ANNUAL_USD / 1e12)
  const [now, setNow] = useState<number | null>(null)
  const raf = useRef<number | null>(null)

  const yearStart = useMemo(
    () => new Date(new Date().getFullYear(), 0, 1).getTime(),
    [],
  )

  useEffect(() => {
    const loop = () => {
      setNow(Date.now())
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const annual = annualT * 1e12
  const perSecond = annual / (YEAR_MS / 1000)
  const value = now == null ? null : (annual * (now - yearStart)) / YEAR_MS

  return (
    <FeaturePanel
      index="06"
      kicker="Live · Futures Forecasting"
      title="The Generational Wealth Deficit Clock"
      blurb="A running estimate of the unpaid generational wealth deficit borne by women worldwide this year — compounding asset-appreciation gaps, by the millisecond."
    >
      <div className="rounded-lg border border-border bg-secondary/30 p-5 sm:p-8 text-center">
        <div className="eyebrow mb-3">Accrued deficit · {new Date().getFullYear()} to date</div>
        <div className="font-mono text-2xl sm:text-4xl lg:text-5xl font-bold text-destructive tabular-nums break-all leading-none">
          {value == null
            ? "—"
            : "$" + Math.floor(value).toLocaleString("en-US")}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          accumulating at{" "}
          <span className="font-mono text-foreground">
            ${Math.round(perSecond).toLocaleString("en-US")}/sec
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <div>
          <StatGrid cols={3}>
            <StatCell label="Per second" value={`$${(perSecond / 1000).toFixed(1)}K`} tone="amber" />
            <StatCell label="Per day" value={`$${((perSecond * 86400) / 1e9).toFixed(2)}B`} tone="primary" />
            <StatCell label="Per year" value={`$${annualT.toFixed(1)}T`} tone="danger" />
          </StatGrid>
        </div>
        <div className="space-y-4">
          <SliderField
            label="Assumed annual global deficit"
            value={annualT}
            onChange={setAnnualT}
            min={6}
            max={20}
            step={0.5}
            format={(v) => `$${v.toFixed(1)}T`}
            accent="amber"
            hint="Adjust the assumed compounding asset-appreciation gap."
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
        Illustrative model: the figure represents women's forgone wealth accumulation
        worldwide, prorated across the current calendar year. It resets each January 1.
      </p>
    </FeaturePanel>
  )
}
