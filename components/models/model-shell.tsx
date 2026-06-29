import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"

/** Consistent editorial header for each interactive model page. */
export function ModelShell({
  index,
  kicker,
  title,
  lede,
  children,
}: {
  index: string
  kicker: string
  title: string
  lede: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto max-w-7xl px-5 lg:px-10 py-10">
      <Link
        href="/models"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Interactive Models
      </Link>

      <header className="grid lg:grid-cols-[1fr_auto] items-end gap-6 border-b border-border pb-8 mb-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-sm text-amber">{index}</span>
            <span className="eyebrow">{kicker}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-pretty">
            {lede}
          </p>
        </div>
        <div className="hidden lg:block text-right">
          <span className="font-display text-7xl font-black text-border leading-none select-none">
            {index}
          </span>
        </div>
      </header>

      {children}
    </main>
  )
}

/** Shared themed Recharts tooltip. */
export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  unit = "",
}: {
  active?: boolean
  payload?: any[]
  label?: string | number
  formatter?: (v: number) => string
  unit?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label !== undefined && (
        <div className="font-mono font-semibold mb-1 text-foreground">{label}</div>
      )}
      {payload.map((p: any) => (
        <div
          key={p.dataKey ?? p.name}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color ?? p.fill }}
          />
          {p.name}:{" "}
          <span className="text-foreground tabular-nums font-medium">
            {formatter ? formatter(p.value) : p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}
