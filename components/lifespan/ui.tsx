"use client"

import type { ReactNode } from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function money(n: number, max = 0) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
  })
}
export function compactMoney(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${Math.round(n)}`
}

/** A titled, bordered feature panel — the editorial unit of the dashboard. */
export function FeaturePanel({
  index,
  kicker,
  title,
  blurb,
  children,
  id,
}: {
  index: string
  kicker: string
  title: string
  blurb?: string
  children: ReactNode
  id?: string
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-xl border border-border bg-card overflow-hidden"
    >
      <header className="border-b border-border p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="font-mono text-xs text-amber font-semibold">{index}</span>
          <span className="eyebrow">{kicker}</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight leading-tight">
          {title}
        </h3>
        {blurb && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {blurb}
          </p>
        )}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

/** Mobile-first labeled slider with a live readout. */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  hint,
  accent,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  format?: (v: number) => string
  hint?: string
  accent?: "amber" | "academic"
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span
          className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            accent === "amber"
              ? "text-amber"
              : accent === "academic"
                ? "text-academic"
                : "text-primary",
          )}
        >
          {format ? format(value) : value}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="py-1.5"
      />
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

/** Stat readout cell; cells tile into a divided grid. */
export function StatCell({
  label,
  value,
  sub,
  tone = "default",
  size = "md",
}: {
  label: string
  value: string
  sub?: string
  tone?: "default" | "primary" | "amber" | "academic" | "danger"
  size?: "md" | "lg"
}) {
  const color =
    tone === "primary"
      ? "text-primary"
      : tone === "amber"
        ? "text-amber"
        : tone === "academic"
          ? "text-academic"
          : tone === "danger"
            ? "text-destructive"
            : "text-foreground"
  return (
    <div className="bg-card p-4">
      <div className="eyebrow leading-tight mb-1.5">{label}</div>
      <div
        className={cn(
          "font-mono font-bold tabular-nums",
          size === "lg" ? "text-3xl" : "text-2xl",
          color,
        )}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  )
}

/** Responsive divided stat grid wrapper. */
export function StatGrid({
  cols = 3,
  children,
}: {
  cols?: 2 | 3 | 4
  children: ReactNode
}) {
  const grid =
    cols === 2
      ? "grid-cols-2"
      : cols === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-3"
  return (
    <div className={cn("grid gap-px bg-border border border-border rounded-lg overflow-hidden", grid)}>
      {children}
    </div>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  size?: "sm" | "md"
}) {
  return (
    <div className="inline-flex flex-wrap rounded-md border border-border overflow-hidden">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "border-r border-border last:border-r-0 font-medium transition-colors",
            size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
            value === o.id
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-secondary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
