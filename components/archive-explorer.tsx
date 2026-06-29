"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react"
import {
  SECTORS,
  PHENOMENA,
  archiveStats,
  formatUSD,
  type CaseStudy,
  type Sector,
  type Phenomenon,
  type SeniorityLevel,
} from "@/lib/data"
import { allStudies, CONTRIB_EVENT } from "@/lib/contributions"
import { CaseCard, CaseRow } from "@/components/case-card"
import { PHENOMENON_LABEL } from "@/components/phenomenon-badge"
import { cn } from "@/lib/utils"

const SENIORITY: SeniorityLevel[] = [
  "Entry-level",
  "Mid-career",
  "Senior",
  "Executive",
  "Self-employed",
]

type SortKey = "recent" | "lostDesc" | "expDesc"

export function ArchiveExplorer() {
  const params = useSearchParams()
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [query, setQuery] = useState("")
  const [sectors, setSectors] = useState<Set<Sector>>(new Set())
  const [phenomena, setPhenomena] = useState<Set<Phenomenon>>(new Set())
  const [seniority, setSeniority] = useState<Set<SeniorityLevel>>(new Set())
  const [sort, setSort] = useState<SortKey>("recent")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Seed initial phenomenon from URL (?phenomenon=#Tag)
  useEffect(() => {
    const p = params.get("phenomenon") as Phenomenon | null
    if (p && PHENOMENA.includes(p)) setPhenomena(new Set([p]))
    const s = params.get("sector") as Sector | null
    if (s && SECTORS.includes(s)) setSectors(new Set([s]))
  }, [params])

  // Live data: seed + contributions, re-syncs on new submissions.
  useEffect(() => {
    const sync = () => setStudies(allStudies())
    sync()
    window.addEventListener(CONTRIB_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CONTRIB_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  function toggle<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    setter(next)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = studies.filter((c) => {
      if (sectors.size && !sectors.has(c.sector)) return false
      if (phenomena.size && !c.phenomena.some((p) => phenomena.has(p))) return false
      if (seniority.size && !seniority.has(c.demographics.seniority)) return false
      if (q) {
        const hay =
          `${c.headline} ${c.summary} ${c.pseudonym} ${c.sector} ${c.structuralBarriers.join(" ")} ${c.phenomena.join(" ")}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    out.sort((a, b) => {
      if (sort === "lostDesc") return b.estimatedLostWages - a.estimatedLostWages
      if (sort === "expDesc")
        return b.demographics.yearsExperience - a.demographics.yearsExperience
      return b.contributedAt.localeCompare(a.contributedAt)
    })
    return out
  }, [studies, query, sectors, phenomena, seniority, sort])

  const stats = archiveStats(filtered)
  const activeCount = sectors.size + phenomena.size + seniority.size
  const clearAll = () => {
    setSectors(new Set())
    setPhenomena(new Set())
    setSeniority(new Set())
    setQuery("")
  }

  const FilterPanel = (
    <div className="space-y-6">
      <FilterGroup title="Economic Sector">
        {SECTORS.map((s) => (
          <FilterChip
            key={s}
            active={sectors.has(s)}
            onClick={() => toggle(sectors, s, setSectors)}
          >
            {s}
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup title="Economic Phenomenon">
        {PHENOMENA.map((p) => (
          <FilterChip
            key={p}
            active={phenomena.has(p)}
            onClick={() => toggle(phenomena, p, setPhenomena)}
            mono
          >
            {p}
          </FilterChip>
        ))}
      </FilterGroup>
      <FilterGroup title="Seniority (Demographic)">
        {SENIORITY.map((s) => (
          <FilterChip
            key={s}
            active={seniority.has(s)}
            onClick={() => toggle(seniority, s, setSeniority)}
          >
            {s}
          </FilterChip>
        ))}
      </FilterGroup>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-10 py-10">
      {/* Header / aggregate readout */}
      <div className="mb-8">
        <p className="eyebrow mb-2">Case Study Archive</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">
          A structured database of lived experience
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Each entry is a qualitative data point. Filter by sector, economic
          phenomenon, and demographic indicators to interrogate the archive.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {[
            { v: String(stats.total), l: "Matching cases" },
            { v: formatUSD(stats.totalLost), l: "Aggregate opp. cost" },
            { v: String(stats.sectors), l: "Sectors represented" },
            { v: `${stats.avgYears.toFixed(0)}y`, l: "Avg. experience" },
          ].map((s) => (
            <div key={s.l} className="bg-card p-4">
              <div className="font-mono text-xl font-bold text-primary tabular-nums">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search narratives, barriers, sectors…"
            className="w-full rounded-sm border border-border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="lg:hidden inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2.5 text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-sm border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="recent">Most recent</option>
          <option value="lostDesc">Highest opportunity cost</option>
          <option value="expDesc">Most experience</option>
        </select>
        <div className="hidden sm:flex rounded-sm border border-border overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-2.5",
              view === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-2.5 border-l border-border",
              view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Active filter pills */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[...sectors].map((s) => (
            <ActivePill key={s} onClear={() => toggle(sectors, s, setSectors)}>
              {s}
            </ActivePill>
          ))}
          {[...phenomena].map((p) => (
            <ActivePill key={p} onClear={() => toggle(phenomena, p, setPhenomena)}>
              {PHENOMENON_LABEL[p]}
            </ActivePill>
          ))}
          {[...seniority].map((s) => (
            <ActivePill key={s} onClear={() => toggle(seniority, s, setSeniority)}>
              {s}
            </ActivePill>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-lg border border-border bg-card p-5">
            {FilterPanel}
          </div>
        </aside>

        {/* Mobile filters (collapsible) */}
        {filtersOpen && (
          <div className="lg:hidden rounded-lg border border-border bg-card p-5">
            {FilterPanel}
          </div>
        )}

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="font-serif text-lg">No matching data points.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try broadening your filters or{" "}
                <button onClick={clearAll} className="underline">
                  clear all
                </button>
                .
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <CaseCard key={s.slug} study={s} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-3 py-2 border-b border-border eyebrow">
                <div className="col-span-5">Case</div>
                <div className="col-span-3">Sector</div>
                <div className="col-span-2">Opp. cost</div>
                <div className="col-span-2 text-right">Experience</div>
              </div>
              {filtered.map((s) => (
                <CaseRow key={s.slug} study={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  mono,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  mono?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-sm border px-2 py-1 text-xs transition-colors text-left",
        mono && "font-mono",
        active
          ? "border-primary bg-primary/15 text-foreground"
          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function ActivePill({
  children,
  onClear,
}: {
  children: React.ReactNode
  onClear: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-primary/15 border border-primary/40 px-2 py-0.5 text-xs">
      {children}
      <button onClick={onClear} aria-label="Remove filter">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
