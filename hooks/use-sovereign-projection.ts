"use client"

import { useMemo } from "react"
import {
  FRAMEWORKS,
  US_BASE,
  SOVEREIGN_HORIZON,
  type PolicyFramework,
} from "@/lib/accountability-data"

export interface SovereignPoint {
  year: number
  gdpBase: number
  gdpPolicy: number
  womenLFPR: number
  payGap: number
}

export interface SovereignResult {
  series: SovereignPoint[]
  applied: PolicyFramework[]
  finalGdpUplift: number // $T at horizon
  finalWomenLFPR: number
  finalPayGap: number
  growthAddBps: number // steady-state basis points added to growth
}

/** Diminishing-returns combiner: stacking policies saturates toward a ceiling. */
function saturate(sum: number, ceiling: number) {
  return ceiling * (1 - Math.exp(-sum / ceiling))
}

/**
 * Projects the US economy 20 years out under a chosen bundle of sovereign
 * policy frameworks. Each framework contributes to (a) closing the pay gap,
 * (b) raising women's labor-force participation, and (c) lifting GDP growth —
 * all phased in via an adoption curve and combined with diminishing returns.
 */
export function useSovereignProjection(selected: Set<string>): SovereignResult {
  return useMemo(() => {
    const applied = FRAMEWORKS.filter((f) => selected.has(f.id))

    const sumGap = applied.reduce((s, f) => s + f.gapEffect, 0)
    const sumLfpr = applied.reduce((s, f) => s + f.lfprEffect, 0)
    const sumBps = applied.reduce((s, f) => s + f.gdpBps, 0)

    const effGap = saturate(sumGap, 12) // can't erase the full 16pp gap
    const effLfpr = saturate(sumLfpr, 12)
    const effBps = saturate(sumBps, 90)
    const growthAddSteady = effBps / 10000

    const tau = 4
    let gdpBase = US_BASE.gdpTrillions
    let gdpPolicy = US_BASE.gdpTrillions
    const series: SovereignPoint[] = []

    for (let t = 0; t <= SOVEREIGN_HORIZON; t++) {
      const adoption = 1 - Math.exp(-t / tau)
      if (t > 0) {
        gdpBase = gdpBase * (1 + US_BASE.baseGrowth)
        gdpPolicy = gdpPolicy * (1 + US_BASE.baseGrowth + growthAddSteady * adoption)
      }
      series.push({
        year: 2026 + t,
        gdpBase: +gdpBase.toFixed(2),
        gdpPolicy: +gdpPolicy.toFixed(2),
        womenLFPR: +(US_BASE.womenLFPR + effLfpr * adoption).toFixed(1),
        payGap: +(US_BASE.payGap - effGap * adoption).toFixed(1),
      })
    }

    const last = series[series.length - 1]
    return {
      series,
      applied,
      finalGdpUplift: +(last.gdpPolicy - last.gdpBase).toFixed(2),
      finalWomenLFPR: last.womenLFPR,
      finalPayGap: last.payGap,
      growthAddBps: Math.round(effBps),
    }
  }, [selected])
}
