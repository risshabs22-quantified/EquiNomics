"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  GraduationCap,
  HeartHandshake,
  Building2,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TrajectoryOverview } from "@/components/lifespan/trajectory-overview"
import { ModuleEarlyCareer } from "@/components/lifespan/module-early-career"
import { ModuleCareEconomy } from "@/components/lifespan/module-care-economy"
import { ModuleCapital } from "@/components/lifespan/module-capital"
import { ModuleMicro } from "@/components/lifespan/module-micro"

const TABS = [
  {
    id: "early",
    stage: "Ages 18–30",
    label: "Early Career & Accumulation",
    short: "Early Career",
    icon: GraduationCap,
    Component: ModuleEarlyCareer,
  },
  {
    id: "care",
    stage: "Ages 28–45",
    label: "Care Economy & Domestic Arbitrage",
    short: "Care Economy",
    icon: HeartHandshake,
    Component: ModuleCareEconomy,
  },
  {
    id: "capital",
    stage: "Ages 35–55",
    label: "Capital Systems & Corporate Velocity",
    short: "Capital Systems",
    icon: Building2,
    Component: ModuleCapital,
  },
  {
    id: "micro",
    stage: "All ages",
    label: "The Micro-Intervention Toolbelt",
    short: "Interventions",
    icon: Wrench,
    Component: ModuleMicro,
  },
] as const

type TabId = (typeof TABS)[number]["id"]

function isTabId(v: string | null): v is TabId {
  return !!v && TABS.some((t) => t.id === v)
}

export function LifespanDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const param = searchParams.get("stage")
  const [active, setActive] = useState<TabId>(isTabId(param) ? param : "early")

  // Keep the active tab in sync with the URL (deep links, back/forward).
  useEffect(() => {
    const s = searchParams.get("stage")
    if (isTabId(s) && s !== active) setActive(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  function selectTab(id: TabId) {
    setActive(id)
    router.replace(`${pathname}?stage=${id}`, { scroll: false })
  }

  const current = TABS.find((t) => t.id === active)!
  const Active = current.Component

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-10 py-8 lg:py-12">
      {/* Masthead */}
      <header className="mb-8">
        <p className="eyebrow mb-3">The Macroeconomic Lifespan Trajectory Model</p>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.03] tracking-tight text-balance">
          How a gap becomes a{" "}
          <span className="text-primary italic">chasm</span> — one life stage at a time.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
          Twelve interactive instruments trace how gender economic disparities
          originate in early adulthood and compound — through caregiving years,
          corporate ladders, and capital systems — all the way to retirement.
        </p>
        <a
          href="/methodology#instruments"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          How each instrument is calculated →
        </a>
      </header>

      {/* Trajectory thesis chart */}
      <div className="mb-8">
        <TrajectoryOverview />
      </div>

      {/* Module tab bar — horizontal scroll on mobile, large hit targets */}
      <div className="sticky top-16 lg:top-24 z-30 -mx-4 sm:-mx-5 lg:mx-0 mb-8">
        <div className="bg-background/95 backdrop-blur border-y border-border lg:border lg:rounded-lg">
          <div
            className="flex gap-1 overflow-x-auto px-2 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {TABS.map((t) => {
              const Icon = t.icon
              const on = active === t.id
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => selectTab(t.id)}
                  className={cn(
                    "flex-1 min-w-[150px] flex items-center gap-3 rounded-md px-4 py-3 text-left transition-colors",
                    on
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[10px] font-mono uppercase tracking-wider",
                        on ? "text-primary-foreground/70" : "text-muted-foreground/70",
                      )}
                    >
                      {t.stage}
                    </span>
                    <span className="block text-sm font-semibold leading-tight truncate">
                      {t.short}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active module */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-6">
          <current.icon className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {current.label}
          </h2>
        </div>
        <Active />
      </div>
    </div>
  )
}
