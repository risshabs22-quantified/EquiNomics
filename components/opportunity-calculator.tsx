"use client"

import { useMemo, useState } from "react"
import { Calculator, Info } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

/**
 * Lifetime Opportunity-Cost model.
 *
 * Projects an individual's earnings against a counterfactual peer who faces no
 * pay gap, takes no caregiving break, and incurs no motherhood penalty. The gap
 * between the two cumulative streams is the "opportunity cost" — recomputed live
 * as the user moves any input. Illustrative, not financial advice.
 */
function project({
  salary,
  gapPct,
  years,
  breakYears,
  children,
  raisePct,
}: {
  salary: number
  gapPct: number
  years: number
  breakYears: number
  children: number
  raisePct: number
}) {
  const penalty = Math.min(children * 0.04, 0.2) // 4%/child, capped at 20%
  let actual = 0
  let counter = 0
  const g = raisePct / 100
  for (let y = 0; y < years; y++) {
    const growth = Math.pow(1 + g, y)
    // Counterfactual peer: full salary, every year worked.
    const peerWage = salary * growth
    counter += peerWage
    // Actual: pay-gap discount, motherhood penalty, and lost break years.
    const working = y >= breakYears
    const actualWage = working
      ? salary * (1 - gapPct / 100) * (1 - penalty) * growth
      : 0
    actual += actualWage
  }
  const lost = counter - actual
  return {
    actual: Math.round(actual),
    counter: Math.round(counter),
    lost: Math.round(lost),
    pctLost: counter ? (lost / counter) * 100 : 0,
  }
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

interface Field {
  key: keyof Inputs
  label: string
  min: number
  max: number
  step: number
  suffix: string
}

interface Inputs {
  salary: number
  gapPct: number
  years: number
  breakYears: number
  children: number
  raisePct: number
}

const FIELDS: Field[] = [
  { key: "salary", label: "Current annual salary", min: 25000, max: 300000, step: 5000, suffix: "" },
  { key: "gapPct", label: "Pay gap vs. male peer", min: 0, max: 40, step: 1, suffix: "%" },
  { key: "years", label: "Years until retirement", min: 5, max: 45, step: 1, suffix: " yrs" },
  { key: "breakYears", label: "Caregiving break", min: 0, max: 10, step: 1, suffix: " yrs" },
  { key: "children", label: "Number of children", min: 0, max: 5, step: 1, suffix: "" },
  { key: "raisePct", label: "Avg. annual raise", min: 0, max: 8, step: 0.5, suffix: "%" },
]

export function OpportunityCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    salary: 75000,
    gapPct: 16,
    years: 30,
    breakYears: 2,
    children: 2,
    raisePct: 3,
  })

  const result = useMemo(() => project(inputs), [inputs])
  const actualPct = result.counter
    ? Math.max(4, (result.actual / result.counter) * 100)
    : 0

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Calculator className="h-4 w-4 text-primary" />
        <h3 className="font-serif text-lg font-semibold">
          Lifetime Opportunity-Cost Estimator
        </h3>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Inputs */}
        <div className="p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-border">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm text-muted-foreground">{f.label}</Label>
                <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                  {f.key === "salary" ? fmt(inputs[f.key]) : inputs[f.key]}
                  {f.suffix}
                </span>
              </div>
              <Slider
                value={[inputs[f.key]]}
                min={f.min}
                max={f.max}
                step={f.step}
                onValueChange={([v]) =>
                  setInputs((prev) => ({ ...prev, [f.key]: v }))
                }
              />
            </div>
          ))}
        </div>

        {/* Live result */}
        <div className="p-6 flex flex-col justify-between bg-secondary/30">
          <div>
            <p className="eyebrow mb-2">Projected lifetime opportunity cost</p>
            <div className="font-mono text-4xl md:text-5xl font-bold text-primary tabular-nums tracking-tight">
              {fmt(result.lost)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              That is{" "}
              <span className="text-foreground font-semibold">
                {result.pctLost.toFixed(0)}%
              </span>{" "}
              of an unconstrained peer's cumulative earnings — forgone to the pay
              gap, caregiving breaks, and the motherhood penalty.
            </p>
          </div>

          {/* Actual vs counterfactual bar */}
          <div className="mt-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Your projected earnings</span>
                <span className="font-mono tabular-nums">{fmt(result.actual)}</span>
              </div>
              <div className="h-3 w-full rounded-sm bg-background overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${actualPct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Unconstrained peer</span>
                <span className="font-mono tabular-nums">{fmt(result.counter)}</span>
              </div>
              <div className="h-3 w-full rounded-sm bg-background overflow-hidden">
                <div className="h-full bg-muted-foreground/60 w-full" />
              </div>
            </div>
          </div>

          <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            Illustrative model using a 4%/child motherhood penalty (capped 20%) and
            compounding wage growth. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
