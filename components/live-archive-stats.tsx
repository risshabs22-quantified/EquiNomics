"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { allStudies } from "@/lib/contributions"
import { CONTRIB_EVENT } from "@/lib/contributions"
import { archiveStats, formatUSD } from "@/lib/data"
import { CaseCard } from "@/components/case-card"

/**
 * Reads the live archive (seed + user contributions) and renders the dashboard's
 * curated case panel. Re-renders the instant a new contribution is saved.
 */
export function LiveCasePanel() {
  const [studies, setStudies] = useState(() => [] as ReturnType<typeof allStudies>)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const sync = () => setStudies(allStudies())
    sync()
    setMounted(true)
    window.addEventListener(CONTRIB_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener(CONTRIB_EVENT, sync)
      window.removeEventListener("storage", sync)
    }
  }, [])

  const stats = archiveStats(studies)
  const featured = studies.slice(0, 3)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden mb-8">
        {[
          { label: "Case studies", value: mounted ? String(stats.total) : "—" },
          {
            label: "Documented opp. cost",
            value: mounted ? formatUSD(stats.totalLost) : "—",
          },
          { label: "Sectors", value: mounted ? String(stats.sectors) : "—" },
          {
            label: "Avg. experience",
            value: mounted ? `${stats.avgYears.toFixed(0)}y` : "—",
          },
        ].map((s) => (
          <div key={s.label} className="bg-card p-4">
            <div className="font-mono text-2xl font-bold text-primary tabular-nums">
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {featured.map((study) => (
          <CaseCard key={study.slug} study={study} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/archive"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium border border-border rounded-sm hover:bg-secondary transition-colors"
        >
          Explore the full Case Study Archive →
        </Link>
      </div>
    </div>
  )
}
