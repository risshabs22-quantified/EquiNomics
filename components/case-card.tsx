"use client"

import Link from "next/link"
import { ArrowUpRight, Briefcase, Clock } from "lucide-react"
import type { CaseStudy, Phenomenon } from "@/lib/data"
import { formatUSD } from "@/lib/data"
import { PhenomenonBadge } from "@/components/phenomenon-badge"

export function CaseCard({
  study,
  onTagClick,
}: {
  study: CaseStudy
  /** When provided, phenomenon tags become buttons that drive relational lookups. */
  onTagClick?: (p: Phenomenon) => void
}) {
  return (
    <Link
      href={`/archive/${study.slug}`}
      className="group flex flex-col h-full rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/60 hover:shadow-[0_2px_16px_-8px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="eyebrow">{study.sector}</span>
        {study.userContributed && (
          <span className="rounded-sm bg-academic/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-academic">
            New · Contributed
          </span>
        )}
      </div>

      <h3 className="font-display text-xl font-bold leading-snug text-balance group-hover:text-primary transition-colors">
        {study.headline}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
        {study.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {study.phenomena.slice(0, 3).map((p) =>
          onTagClick ? (
            <button
              key={p}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onTagClick(p)
              }}
              className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] tracking-tight text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {p}
            </button>
          ) : (
            <PhenomenonBadge key={p} phenomenon={p} />
          ),
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="font-mono text-sm font-semibold text-primary tabular-nums">
            {formatUSD(study.estimatedLostWages)}
          </div>
          <div className="text-muted-foreground">Opp. cost</div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums">
            <Clock className="h-3 w-3 text-muted-foreground" />
            {study.demographics.yearsExperience}y
          </div>
          <div className="text-muted-foreground">Experience</div>
        </div>
        <div className="flex items-center justify-end self-end">
          <span className="inline-flex items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
            Read
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function CaseRow({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/archive/${study.slug}`}
      className="group grid grid-cols-12 items-center gap-3 border-b border-border px-3 py-4 transition-colors hover:bg-secondary/50 last:border-0"
    >
      <div className="col-span-12 md:col-span-5">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold group-hover:text-primary transition-colors">
            {study.headline}
          </span>
          {study.userContributed && (
            <span className="rounded-sm bg-academic/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-academic">
              New
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Briefcase className="h-3 w-3" />
          {study.pseudonym} · {study.demographics.region}
        </div>
      </div>
      <div className="col-span-6 md:col-span-3 text-sm text-muted-foreground">
        {study.sector}
      </div>
      <div className="col-span-3 md:col-span-2 font-mono text-sm tabular-nums text-primary">
        {formatUSD(study.estimatedLostWages)}
      </div>
      <div className="col-span-3 md:col-span-2 font-mono text-sm tabular-nums text-right text-muted-foreground">
        {study.demographics.yearsExperience} yrs
      </div>
    </Link>
  )
}
