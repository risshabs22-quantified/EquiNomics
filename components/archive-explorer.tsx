"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"
import {
  SECTORS,
  PHENOMENA,
  MACRO_INDICATORS,
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
  // Relational tagging: the phenomenon currently "examined" drives the macro panel.
  const [focusTag, setFocusTag] = useState<Phenomenon | null>(null)

  useEffect(() => {
    const p = params.get("phenomenon") as Phenomenon | null
    if (p && PHENOMENA.includes(p)) {
      setPhenomena(new Set([p]))
      setFocusTag(p)
    }
    const s = params.get("sector") as Sector | null
    if (s && SECTORS.includes(s)) setSectors(new Set([s]))
  }, [params])

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

  function clickPhenomenon(p: Phenomenon) {
    toggle(phenomena, p, setPhenomena)
    setFocusTag((cur) => (cur === p ? null : p))
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
    setFocusTag(null)
    setQuery("")
  }

  // Relational correlation: macro indicators tied to the focused phenomenon.
  const correlated = focusTag
    ? MACRO_INDICATORS.filter((m) => m.phenomenon === focusTag)
    : []
  const focusMatchCount = focusTag
    ? studies.filter((c) => c.phenomena.includes(focusTag)).length
    : 0

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
      <FilterGroup title="What happened · click to see the matching stat">
        {PHENOMENA.map((p) => (
          <FilterChip
            key={p}
            active={phenomena.has(p)}
            focused={focusTag === p}
            onClick={() => clickPhenomenon(p)}
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
      <header className="border-b border-border pb-8 mb-8">
        <p className="eyebrow mb-3">Case Study Archive</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
          Real stories, tagged with the economics
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty">
          Each entry is someone's experience — filtered by sector, what happened to
          them, and where they are in their career. Click any{" "}
          <span className="font-mono text-sm text-primary">#phenomenon</span> tag to
          pull up the macro stat that matches.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border border-border rounded-lg overflow-hidden">
          {[
            { v: String(stats.total), l: "Matching cases" },
            { v: formatUSD(stats.totalLost), l: "Aggregate opp. cost" },
            { v: String(stats.sectors), l: "Sectors" },
            { v: `${stats.avgYears.toFixed(0)}y`, l: "Avg. experience" },
          ].map((s) => (
            <div key={s.l} className="bg-card p-4">
              <div className="font-mono text-2xl font-bold text-primary tabular-nums">
                {s.v}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search narratives, barriers, sectors…"
            className="w-full rounded-md border border-border bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="lg:hidden inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="recent">Most recent</option>
          <option value="lostDesc">Highest opportunity cost</option>
          <option value="expDesc">Most experience</option>
        </select>
        <div className="hidden sm:flex rounded-md border border-border overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={cn("p-2.5", view === "grid" ? "bg-secondary" : "text-muted-foreground")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-2.5 border-l border-border",
              view === "list" ? "bg-secondary" : "text-muted-foreground",
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[...sectors].map((s) => (
            <ActivePill key={s} onClear={() => toggle(sectors, s, setSectors)}>
              {s}
            </ActivePill>
          ))}
          {[...phenomena].map((p) => (
            <ActivePill key={p} onClear={() => clickPhenomenon(p)}>
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

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">{FilterPanel}</div>
        </aside>
        {filtersOpen && (
          <div className="lg:hidden rounded-lg border border-border bg-card p-5">
            {FilterPanel}
          </div>
        )}

        {/* Results + relational signal */}
        <div className="min-w-0">
          {/* Relational Macro Signal */}
          {focusTag && correlated.length > 0 && (
            <div className="mb-6 rounded-lg border border-primary/40 bg-primary/[0.04] overflow-hidden animate-fade-up">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-primary/20 bg-primary/[0.06]">
                <Activity className="h-4 w-4 text-primary" />
                <span className="eyebrow text-primary/90">
                  Matching macro stat · {PHENOMENON_LABEL[focusTag]}
                </span>
                <button
                  onClick={() => setFocusTag(null)}
                  className="ml-auto text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-[auto_1fr] gap-4 p-4">
                {correlated.map((m) => (
                  <div key={m.id} className="contents">
                    <div className="font-mono text-4xl font-bold text-primary tabular-nums">
                      {m.value}
                    </div>
                    <div>
                      <p className="font-medium">{m.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        {m.context}
                      </p>
                      <p className="mt-1.5 text-[11px] font-mono text-muted-foreground/70">
                        {m.source}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="sm:col-span-2 text-sm border-t border-border pt-3 text-muted-foreground">
                  <span className="text-foreground font-semibold tabular-nums">
                    {focusMatchCount}
                  </span>{" "}
                  case {focusMatchCount === 1 ? "study lines up with" : "studies line up with"}{" "}
                  this signal in the archive — the number on the dashboard, in someone's actual life.
                </p>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="font-display text-xl">No matching stories.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Broaden your filters or{" "}
                <button onClick={clearAll} className="underline">
                  clear all
                </button>
                .
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((s) => (
                <CaseCard key={s.slug} study={s} onTagClick={clickPhenomenon} />
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="eyebrow mb-3">{title}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({
  active,
  focused,
  onClick,
  children,
  mono,
}: {
  active: boolean
  focused?: boolean
  onClick: () => void
  children: React.ReactNode
  mono?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1 text-xs transition-colors text-left",
        mono && "font-mono",
        focused
          ? "border-primary bg-primary text-primary-foreground"
          : active
            ? "border-primary bg-primary/10 text-foreground"
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
    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 border border-primary/40 px-2 py-0.5 text-xs">
      {children}
      <button onClick={onClear} aria-label="Remove filter">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
