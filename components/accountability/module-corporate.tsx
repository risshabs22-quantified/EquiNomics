"use client"

import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ScanFace,
} from "lucide-react"
import {
  CANDIDATES,
  HIRE_BASE_SCORE,
  HIRE_PENALTIES,
  LEDGER,
  type CompanyRow,
} from "@/lib/accountability-data"
import { ChartTooltip } from "@/components/models/model-shell"
import { FeaturePanel, StatCell, StatGrid, Segmented } from "@/components/lifespan/ui"
import { cn } from "@/lib/utils"

export function ModuleCorporate() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <HiringBiasSimulator />
      <DisparityLedger />
    </div>
  )
}

/* ─────────────────── 3 · Algorithmic Hiring Bias Simulator ─────────────────── */

interface Factor {
  label: string
  points: number
}

function HiringBiasSimulator() {
  const [candidateId, setCandidateId] = useState(CANDIDATES[0].id)
  const [maskName, setMaskName] = useState(false)
  const [maskGaps, setMaskGaps] = useState(false)
  const [blind, setBlind] = useState(false)

  const candidate = CANDIDATES.find((c) => c.id === candidateId)!

  const { factors, biasedScore } = useMemo(() => {
    const factors: Factor[] = []
    if (!blind) {
      if (!maskName && candidate.nameSignal === "feminine")
        factors.push({ label: "Perceived-female name", points: HIRE_PENALTIES.feminineName })
      if (!maskGaps && candidate.employmentGapYears > 0)
        factors.push({
          label: `${candidate.employmentGapYears}-yr caregiving gap`,
          points: HIRE_PENALTIES.perGapYear * candidate.employmentGapYears,
        })
      if (!maskGaps && candidate.partTime)
        factors.push({ label: "Part-time history", points: HIRE_PENALTIES.partTime })
      if (candidate.affinitySignal)
        factors.push({ label: "“Women in Tech” affinity signal", points: HIRE_PENALTIES.affinity })
    }
    const total = factors.reduce((s, f) => s + f.points, 0)
    return { factors, biasedScore: Math.max(0, HIRE_BASE_SCORE - total) }
  }, [candidate, maskName, maskGaps, blind])

  const delta = HIRE_BASE_SCORE - biasedScore
  const meterColor = biasedScore >= 78 ? "var(--color-chart-2)" : biasedScore >= 65 ? "var(--color-chart-3)" : "var(--color-chart-4)"

  return (
    <FeaturePanel
      index="03"
      kicker="Corporate Auditing · Simulation"
      title="Algorithmic Hiring Bias Simulator"
      blurb="An AI résumé screener scores identical candidates. Toggle the structural-bias parameters to watch the same qualifications get penalized — and see how a blind process closes the gap."
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <h4 className="eyebrow mb-2">Candidate (identical qualifications)</h4>
            <div className="flex flex-wrap gap-2">
              {CANDIDATES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCandidateId(c.id)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-colors",
                    candidateId === c.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {c.alias}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 bg-secondary/30">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ScanFace className="h-4 w-4 text-primary" />
              {candidate.alias}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{candidate.resumeLine}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
              <Sig label={`Name: ${candidate.nameSignal}`} />
              {candidate.employmentGapYears > 0 && <Sig label={`${candidate.employmentGapYears}-yr gap`} />}
              {candidate.partTime && <Sig label="Part-time" />}
              {candidate.affinitySignal && <Sig label="Affinity signal" />}
            </div>
          </div>

          <div className="space-y-2">
            <ToggleRow label="Mask candidate name" desc="Remove gendered name signal" checked={maskName} disabled={blind} onChange={() => setMaskName((v) => !v)} />
            <ToggleRow label="Mask employment gaps" desc="Hide caregiving gaps & part-time history" checked={maskGaps} disabled={blind} onChange={() => setMaskGaps((v) => !v)} />
            <ToggleRow label="Full blind screening" desc="Structured evaluation — all demographic signals removed" checked={blind} onChange={() => setBlind((v) => !v)} accent />
          </div>
        </div>

        {/* Score */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-5">
            <div className="eyebrow mb-1">Hiring Probability Index</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold tabular-nums" style={{ color: meterColor }}>
                {biasedScore}
              </span>
              <span className="text-muted-foreground text-lg">/ 100</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-secondary overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${biasedScore}%`, background: meterColor }} />
            </div>
          </div>

          <StatGrid cols={2}>
            <StatCell label="Blind / structured" value={String(HIRE_BASE_SCORE)} tone="academic" />
            <StatCell label="Bias penalty" value={delta > 0 ? `−${delta}` : "0"} sub="same résumé" tone={delta > 0 ? "danger" : "academic"} />
          </StatGrid>

          <div className="rounded-lg border border-border p-4">
            <h4 className="eyebrow mb-2">Points deducted by signal</h4>
            {factors.length === 0 ? (
              <p className="text-sm text-academic">No penalties — evaluated on merit alone.</p>
            ) : (
              <div className="space-y-2">
                {factors.map((f) => (
                  <div key={f.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-mono text-destructive tabular-nums">−{f.points}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Identical qualifications. The signal-aware model penalizes caregiving and
            perceived gender; blind screening restores merit-only scoring.
          </p>
        </div>
      </div>
    </FeaturePanel>
  )
}

function Sig({ label }: { label: string }) {
  return (
    <span className="rounded bg-background border border-border px-1.5 py-0.5 text-muted-foreground">
      {label}
    </span>
  )
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  disabled,
  accent,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
  accent?: boolean
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      className={cn(
        "w-full flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition-colors",
        disabled ? "opacity-50" : "hover:bg-secondary/40",
        checked ? (accent ? "border-primary bg-primary/[0.06]" : "border-primary/60") : "border-border",
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        className={cn(
          "shrink-0 flex h-6 w-11 items-center rounded-full px-0.5 transition-colors",
          checked ? "bg-primary justify-end" : "bg-secondary justify-start border border-border",
        )}
      >
        <span className="h-5 w-5 rounded-full bg-background shadow-sm" />
      </span>
    </button>
  )
}

/* ─────────────────── 4 · Corporate Wage-Gap Disparity Ledger ─────────────────── */

type SortKey = keyof Pick<
  CompanyRow,
  "company" | "sector" | "revenueB" | "womenLeadershipPct" | "payGapPct" | "transparencyScore"
>
type BarMetric = "payGapPct" | "transparencyScore" | "womenLeadershipPct"

const PER_PAGE = 8

const COLUMNS: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: "company", label: "Company" },
  { key: "sector", label: "Sector" },
  { key: "revenueB", label: "Rev ($B)", numeric: true },
  { key: "womenLeadershipPct", label: "Women in Mgmt", numeric: true },
  { key: "payGapPct", label: "Pay Gap", numeric: true },
  { key: "transparencyScore", label: "Transparency", numeric: true },
]

function DisparityLedger() {
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("payGapPct")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(0)
  const [metric, setMetric] = useState<BarMetric>("payGapPct")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = LEDGER.filter(
      (r) => !q || r.company.toLowerCase().includes(q) || r.sector.toLowerCase().includes(q),
    )
    rows.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number)
      return sortDir === "asc" ? cmp : -cmp
    })
    return rows
  }, [query, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = filtered.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE)

  const sectorBars = useMemo(() => {
    const bySector: Record<string, { sum: number; n: number }> = {}
    for (const r of LEDGER) {
      bySector[r.sector] ??= { sum: 0, n: 0 }
      bySector[r.sector].sum += r[metric]
      bySector[r.sector].n += 1
    }
    return Object.entries(bySector)
      .map(([sector, { sum, n }]) => ({ sector, value: +(sum / n).toFixed(1) }))
      .sort((a, b) => b.value - a.value)
  }, [metric])

  function sort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir(key === "company" || key === "sector" ? "asc" : "desc")
    }
    setPage(0)
  }

  const lowerIsBetter = metric === "payGapPct"

  return (
    <FeaturePanel
      index="04"
      kicker="Corporate Transparency"
      title="Corporate Wage-Gap Disparity Ledger"
      blurb="A searchable, sortable ledger of sector wage data. Sort by revenue, women in management, pay gap, or transparency — and compare industries at a glance."
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search company or sector…"
            className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {filtered.length} firms
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left">
              {COLUMNS.map((c) => (
                <th key={c.key} className={cn("px-3 py-2.5 font-medium", c.numeric && "text-right")}>
                  <button
                    onClick={() => sort(c.key)}
                    className={cn("inline-flex items-center gap-1 hover:text-primary", c.numeric && "flex-row-reverse")}
                  >
                    {c.label}
                    {sortKey === c.key ? (
                      sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronsUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                <td className="px-3 py-2.5 font-medium">{r.company}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{r.sector}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">${r.revenueB}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{r.womenLeadershipPct}%</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-amber">{r.payGapPct}%</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{r.transparencyScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">
          Page {safePage + 1} of {pageCount}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="inline-flex items-center rounded-md border border-border p-2 disabled:opacity-40 hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="inline-flex items-center rounded-md border border-border p-2 disabled:opacity-40 hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sector comparison */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h4 className="eyebrow">Sector averages</h4>
          <Segmented
            size="sm"
            value={metric}
            onChange={setMetric}
            options={[
              { id: "payGapPct" as BarMetric, label: "Pay gap" },
              { id: "transparencyScore" as BarMetric, label: "Transparency" },
              { id: "womenLeadershipPct" as BarMetric, label: "Women in mgmt" },
            ]}
          />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sectorBars} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis type="category" dataKey="sector" stroke="var(--muted-foreground)" fontSize={11} width={96} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
            <Bar dataKey="value" radius={[0, 3, 3, 0]}>
              {sectorBars.map((d, i) => {
                const best = lowerIsBetter ? i === sectorBars.length - 1 : i === 0
                const worst = lowerIsBetter ? i === 0 : i === sectorBars.length - 1
                return (
                  <Cell
                    key={d.sector}
                    fill={best ? "var(--color-chart-2)" : worst ? "var(--color-chart-4)" : "var(--color-chart-1)"}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </FeaturePanel>
  )
}
