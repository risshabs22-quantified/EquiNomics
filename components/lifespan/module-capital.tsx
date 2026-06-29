"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Play, Pause, RotateCcw, Check } from "lucide-react"
import {
  CORPORATE_LEVELS,
  CEILING_SECTORS,
  VC_ROUNDS,
  VC_FUND,
} from "@/lib/lifespan-data"
import {
  FeaturePanel,
  StatCell,
  StatGrid,
  Segmented,
  money,
  compactMoney,
} from "@/components/lifespan/ui"
import { IntersectionalExaminer } from "@/components/models/intersectional-examiner"
import { cn } from "@/lib/utils"

export function ModuleCapital() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <GlassCeilingSim />
      <VCAllocator />
      <FeaturePanel
        index="09"
        kicker="Dynamic Regression"
        title="Intersectional Regression Matrix"
        blurb="Cross gender with race, education, and geography to expose the compounding penalties that single-axis averages conceal."
      >
        <IntersectionalExaminer />
      </FeaturePanel>
    </div>
  )
}

/* ─────────────────────── 7 · Glass Ceiling Velocity Simulator ─────────────────────── */

const MAX_YEARS = 40

function levelAt(years: number, interval: number) {
  // Number of promotions achieved = completed intervals, capped at top level.
  return Math.min(CORPORATE_LEVELS.length - 1, Math.floor(years / interval))
}
function yearsToTop(interval: number) {
  return interval * (CORPORATE_LEVELS.length - 1)
}

function GlassCeilingSim() {
  const [sectorId, setSectorId] = useState(CEILING_SECTORS[0].id)
  const [years, setYears] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(2) // years per second
  const raf = useRef<number | null>(null)
  const last = useRef<number | null>(null)

  const sector = CEILING_SECTORS.find((s) => s.id === sectorId)!
  const menInterval = sector.baseInterval
  const womenInterval = sector.baseInterval * sector.womenDelay

  useEffect(() => {
    if (!playing) return
    const tick = (now: number) => {
      if (last.current != null) {
        const dt = (now - last.current) / 1000
        setYears((y) => {
          const next = y + dt * speed
          if (next >= MAX_YEARS) {
            setPlaying(false)
            return MAX_YEARS
          }
          return next
        })
      }
      last.current = now
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      last.current = null
    }
  }, [playing, speed])

  function reset() {
    setPlaying(false)
    setYears(0)
  }

  const menLevel = levelAt(years, menInterval)
  const womenLevel = levelAt(years, womenInterval)
  const menTop = yearsToTop(menInterval)
  const womenTop = yearsToTop(womenInterval)

  return (
    <FeaturePanel
      index="07"
      kicker="Live Simulation"
      title="Glass Ceiling Velocity Simulator"
      blurb="Two identical hires start on the same day. Press play and watch how fast each climbs the Fortune 500 ladder — sector by sector."
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={sectorId}
          onChange={(e) => {
            setSectorId(e.target.value)
            reset()
          }}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {CEILING_SECTORS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/90"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : years > 0 ? "Resume" : "Play"}
        </button>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="eyebrow">Speed</span>
          <Segmented
            size="sm"
            value={String(speed) as "1" | "2" | "4"}
            onChange={(v) => setSpeed(Number(v))}
            options={[
              { id: "1", label: "1×" },
              { id: "2", label: "2×" },
              { id: "4", label: "4×" },
            ]}
          />
        </div>
      </div>

      {/* Elapsed clock */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <span className="eyebrow">Years elapsed</span>
          <div className="font-mono text-4xl font-bold text-primary tabular-nums">
            {years.toFixed(1)}
          </div>
        </div>
        <p className="text-xs text-muted-foreground max-w-[50%] text-right">
          {sector.label}: women wait{" "}
          <span className="text-amber font-semibold">
            {Math.round((sector.womenDelay - 1) * 100)}%
          </span>{" "}
          longer between promotions.
        </p>
      </div>

      {/* Two ladders */}
      <div className="space-y-5">
        <Ladder label="Male hire" level={menLevel} color="var(--color-chart-1)" />
        <Ladder label="Female hire" level={womenLevel} color="var(--color-chart-3)" />
      </div>

      <div className="mt-6">
        <StatGrid cols={3}>
          <StatCell label="His current rank" value={CORPORATE_LEVELS[menLevel]} tone="primary" />
          <StatCell label="Her current rank" value={CORPORATE_LEVELS[womenLevel]} tone="amber" />
          <StatCell
            label="Years to C-Suite"
            value={`${menTop.toFixed(0)}y`}
            sub={`vs ${womenTop.toFixed(0)}y · +${(womenTop - menTop).toFixed(0)}y`}
            tone="danger"
          />
        </StatGrid>
      </div>
    </FeaturePanel>
  )
}

function Ladder({
  label,
  level,
  color,
}: {
  label: string
  level: number
  color: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {CORPORATE_LEVELS[level]}
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {CORPORATE_LEVELS.map((lvl, i) => {
          const reached = i <= level
          return (
            <div key={lvl} className="text-center">
              <div
                className={cn(
                  "h-9 rounded-md flex items-center justify-center transition-colors duration-300",
                  reached ? "" : "bg-secondary",
                )}
                style={reached ? { background: color } : undefined}
              >
                {i === level && (
                  <span className="text-[10px] font-bold text-white">●</span>
                )}
              </div>
              <span className="mt-1 block text-[9px] sm:text-[10px] text-muted-foreground truncate">
                {lvl}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────── 8 · VC Allocator Game ─────────────────────── */

function VCAllocator() {
  // split[i] = % of round i's pot allocated to founder B (women/female-led).
  const [split, setSplit] = useState<number[]>(VC_ROUNDS.map(() => 50))
  const [revealed, setRevealed] = useState(false)
  const pot = VC_FUND / VC_ROUNDS.length

  const result = useMemo(() => {
    let userWomen = 0
    let marketWomen = 0
    VC_ROUNDS.forEach((round, i) => {
      userWomen += (pot * split[i]) / 100
      const ratio = round.b.marketShare / (round.a.marketShare + round.b.marketShare)
      marketWomen += pot * ratio
    })
    const userPct = (userWomen / VC_FUND) * 100
    const marketPct = (marketWomen / VC_FUND) * 100
    return {
      userWomen,
      marketWomen,
      userPct,
      marketPct,
      gapClosed: userWomen - marketWomen,
    }
  }, [split, pot])

  return (
    <FeaturePanel
      index="08"
      kicker="Bias Exposure · Micro-Game"
      title="Venture Capital Allocator Game"
      blurb="You're the investor. Each pair of founders has identical fundamentals — only the team differs. Allocate your $10M fund, then see how the real market would have."
    >
      <div className="space-y-5">
        {VC_ROUNDS.map((round, i) => (
          <div key={round.id} className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/40">
              <span className="eyebrow">{round.sector}</span>
              <span className="font-mono text-xs text-muted-foreground">
                Pot: {compactMoney(pot)}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {[round.a, round.b].map((f, idx) => {
                const share = idx === 0 ? 100 - split[i] : split[i]
                return (
                  <div key={f.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold">{f.name}</span>
                      <span className="font-mono text-sm text-primary tabular-nums">
                        {money((pot * share) / 100)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.demo}</p>
                    <p className="text-sm mt-2">{f.pitch}</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span>TAM: {f.fundamentals.tam}</span>
                      <span>Rev: {f.fundamentals.revenue}</span>
                      <span>Growth: {f.fundamentals.growth}</span>
                      <span>Team: {f.fundamentals.team}</span>
                    </div>
                    {revealed && (
                      <p className="mt-2 font-mono text-[11px] text-amber">
                        Real market share: {(f.marketShare * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>← {round.a.name}</span>
                <span>{round.b.name} →</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={split[i]}
                onChange={(e) =>
                  setSplit((s) => s.map((v, j) => (j === i ? Number(e.target.value) : v)))
                }
                className="w-full accent-[var(--primary)]"
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90"
          >
            <Check className="h-4 w-4" /> Reveal the market
          </button>
          {revealed && (
            <button
              onClick={() => {
                setRevealed(false)
                setSplit(VC_ROUNDS.map(() => 50))
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> Play again
            </button>
          )}
        </div>

        {revealed && (
          <div className="animate-fade-up">
            <StatGrid cols={3}>
              <StatCell label="You → women-led" value={`${result.userPct.toFixed(0)}%`} sub={compactMoney(result.userWomen)} tone="primary" />
              <StatCell label="Real market → women-led" value={`${result.marketPct.toFixed(1)}%`} sub={compactMoney(result.marketWomen)} tone="amber" />
              <StatCell label="Capital you'd redirect" value={compactMoney(result.gapClosed)} sub="vs. the market baseline" tone="academic" />
            </StatGrid>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The fundamentals were <strong>identical</strong> in every pairing — only the
              founders' demographics differed. All-women teams receive roughly{" "}
              <span className="text-amber font-semibold">2%</span> of U.S. venture dollars.
              The gap is not a pipeline problem; it is an allocation choice.
            </p>
          </div>
        )}
      </div>
    </FeaturePanel>
  )
}
