"use client"

import { useMemo, useState } from "react"
import { RotateCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import {
  PINK_TAX_CATEGORIES,
  PINK_TAX_INVEST_RATE,
} from "@/lib/models-data"

const LIFETIME_YEARS = 50

function money(n: number, max = 0) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  })
}

export function PinkTaxIndexer() {
  const [spend, setSpend] = useState<Record<string, number>>(
    Object.fromEntries(PINK_TAX_CATEGORIES.map((c) => [c.id, c.defaultMonthly])),
  )

  const reset = () =>
    setSpend(
      Object.fromEntries(PINK_TAX_CATEGORIES.map((c) => [c.id, c.defaultMonthly])),
    )

  const result = useMemo(() => {
    const rows = PINK_TAX_CATEGORIES.map((c) => {
      const annualSpend = (spend[c.id] ?? 0) * 12
      // Premium = portion of spend attributable to the markup vs. neutral baseline.
      const premium = annualSpend * (c.markup / (1 + c.markup))
      return { ...c, annualSpend, premium }
    })
    const annualPremium = rows.reduce((s, r) => s + r.premium, 0)
    const annualSpendTotal = rows.reduce((s, r) => s + r.annualSpend, 0)
    const blendedRate = annualSpendTotal
      ? (annualPremium / (annualSpendTotal - annualPremium)) * 100
      : 0
    const lifetime = annualPremium * LIFETIME_YEARS
    // Future value of investing each year's premium for 50 yrs at 6%.
    const r = PINK_TAX_INVEST_RATE
    const invested = annualPremium * ((Math.pow(1 + r, LIFETIME_YEARS) - 1) / r)
    const maxPremium = Math.max(...rows.map((r) => r.premium), 1)
    return { rows, annualPremium, blendedRate, lifetime, invested, maxPremium }
  }, [spend])

  return (
    <div className="grid lg:grid-cols-[minmax(0,380px)_1fr] gap-8">
      {/* Inputs */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="eyebrow">Monthly spend by category</h3>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="space-y-6">
          {PINK_TAX_CATEGORIES.map((c) => (
            <div key={c.id}>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-sm font-medium">
                  {c.label}
                  <span className="ml-2 font-mono text-xs text-amber">
                    +{Math.round(c.markup * 100)}%
                  </span>
                </label>
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  {money(spend[c.id])}/mo
                </span>
              </div>
              <Slider
                value={[spend[c.id]]}
                min={0}
                max={300}
                step={5}
                onValueChange={([v]) => setSpend((p) => ({ ...p, [c.id]: v }))}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded-md overflow-hidden">
            <HeadStat
              label="Annual pink tax total"
              value={money(result.annualPremium)}
              tone="amber"
              big
            />
            <HeadStat
              label="Blended surcharge rate"
              value={`${result.blendedRate.toFixed(1)}%`}
            />
            <HeadStat
              label={`Lifetime (${LIFETIME_YEARS} yrs)`}
              value={money(result.lifetime)}
            />
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-md bg-secondary/60 border border-border p-3">
            <span className="font-mono text-academic text-lg font-bold tabular-nums">
              {money(result.invested)}
            </span>
            <p className="text-xs text-muted-foreground">
              — what that same premium could become if invested annually over{" "}
              {LIFETIME_YEARS} years at {Math.round(PINK_TAX_INVEST_RATE * 100)}%. It's
              not just what you overpaid — it's what that money never got to become.
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h4 className="eyebrow mb-4">Premium by category · per year</h4>
          <div className="space-y-3">
            {[...result.rows]
              .sort((a, b) => b.premium - a.premium)
              .map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm truncate">{r.label}</span>
                  <div className="flex-1 h-6 rounded bg-secondary overflow-hidden relative">
                    <div
                      className="h-full bg-amber/80 transition-all duration-300"
                      style={{ width: `${(r.premium / result.maxPremium) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right font-mono text-sm tabular-nums">
                    {money(r.premium)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeadStat({
  label,
  value,
  tone,
  big,
}: {
  label: string
  value: string
  tone?: "amber"
  big?: boolean
}) {
  return (
    <div className="bg-card p-4">
      <div className="eyebrow leading-tight mb-1.5">{label}</div>
      <div
        className={`font-mono font-bold tabular-nums ${big ? "text-3xl" : "text-2xl"} ${
          tone === "amber" ? "text-amber" : "text-foreground"
        }`}
      >
        {value}
      </div>
    </div>
  )
}
