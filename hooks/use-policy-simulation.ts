"use client"

import { useMemo } from "react"
import {
  POLICY_BASE_GAP,
  POLICY_RESIDUAL_FLOOR,
  POLICY_HORIZON_YEARS,
  POLICY_LEVERS,
  leaveResponse,
} from "@/lib/models-data"

export interface PolicyInputs {
  leave: number
  transparency: number
  childcare: number
  flex: number
}

export interface PolicyContribution {
  id: string
  label: string
  effect: number // long-run pp reduction from this lever
}

export interface PolicyResult {
  series: { year: number; projected: number; statusQuo: number }[]
  contributions: PolicyContribution[]
  totalEffect: number
  finalGap: number
  reductionPP: number
  reductionPct: number
  yearsToHalfGap: number | null
}

/**
 * Mock econometric model: each policy lever contributes a long-run reduction in
 * the gender wage gap, realized gradually via a logistic-style adoption curve
 * (1 − e^(−t/τ)). Parental leave follows an inverted-U response. The status-quo
 * counterfactual drifts down only slightly, reflecting the observed stall in
 * convergence.
 */
export function usePolicySimulation(inputs: PolicyInputs): PolicyResult {
  return useMemo(() => {
    const get = (id: string) => POLICY_LEVERS.find((l) => l.id === id)!

    const leaveEffect = leaveResponse(inputs.leave, get("leave").maxEffect)
    const transparencyEffect =
      (inputs.transparency / 100) * get("transparency").maxEffect
    const childcareEffect = (inputs.childcare / 100) * get("childcare").maxEffect
    const flexEffect = (inputs.flex / 100) * get("flex").maxEffect

    const contributions: PolicyContribution[] = [
      { id: "childcare", label: "Subsidized Childcare", effect: childcareEffect },
      { id: "transparency", label: "Wage Transparency", effect: transparencyEffect },
      { id: "leave", label: "Paid Parental Leave", effect: leaveEffect },
      { id: "flex", label: "Flexible-Work Protections", effect: flexEffect },
    ].sort((a, b) => b.effect - a.effect)

    const totalEffect = contributions.reduce((s, c) => s + c.effect, 0)
    const tau = 3.2 // adoption time constant (years)

    const series = Array.from({ length: POLICY_HORIZON_YEARS + 1 }, (_, year) => {
      const adoption = 1 - Math.exp(-year / tau)
      const reducible = POLICY_BASE_GAP - POLICY_RESIDUAL_FLOOR
      const realized = Math.min(totalEffect, reducible) * adoption
      const projected = Math.max(
        POLICY_RESIDUAL_FLOOR,
        POLICY_BASE_GAP - realized,
      )
      const statusQuo = POLICY_BASE_GAP - year * 0.06 // slow secular drift
      return {
        year: 2026 + year,
        projected: +projected.toFixed(2),
        statusQuo: +statusQuo.toFixed(2),
      }
    })

    const finalGap = series[series.length - 1].projected
    const reductionPP = +(POLICY_BASE_GAP - finalGap).toFixed(2)
    const reductionPct = +((reductionPP / POLICY_BASE_GAP) * 100).toFixed(1)

    // First year the projected gap reaches half the base gap, if ever.
    const halfTarget = POLICY_BASE_GAP / 2
    const hitsHalf = series.find((p) => p.projected <= halfTarget)
    const yearsToHalfGap = hitsHalf ? hitsHalf.year - 2026 : null

    return {
      series,
      contributions,
      totalEffect,
      finalGap,
      reductionPP,
      reductionPct,
      yearsToHalfGap,
    }
  }, [inputs])
}
