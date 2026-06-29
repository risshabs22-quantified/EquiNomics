"use client"

import { useEffect, useState } from "react"
import { Globe2, Building2, Radar as RadarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModuleMacroPolicy } from "@/components/accountability/module-macro-policy"
import { ModuleCorporate } from "@/components/accountability/module-corporate"
import { ModuleRadar } from "@/components/accountability/module-radar"

const TABS = [
  {
    id: "macro",
    badge: "Module 05",
    label: "Macro-Policy & Global Benchmarking",
    short: "Macro-Policy",
    icon: Globe2,
    Component: ModuleMacroPolicy,
  },
  {
    id: "corporate",
    badge: "Module 06",
    label: "Corporate Transparency & Auditing",
    short: "Corporate Audit",
    icon: Building2,
    Component: ModuleCorporate,
  },
  {
    id: "radar",
    badge: "Module 07",
    label: "Intersectional Radar & Futures",
    short: "Radar & Futures",
    icon: RadarIcon,
    Component: ModuleRadar,
  },
] as const

type TabId = (typeof TABS)[number]["id"]
const isTabId = (v: string | null): v is TabId => !!v && TABS.some((t) => t.id === v)

export function AccountabilityDashboard() {
  const [active, setActive] = useState<TabId>("macro")

  useEffect(() => {
    const apply = () => {
      const s = new URLSearchParams(window.location.search).get("layer")
      if (isTabId(s)) setActive(s)
    }
    apply()
    window.addEventListener("popstate", apply)
    return () => window.removeEventListener("popstate", apply)
  }, [])

  function selectTab(id: TabId) {
    setActive(id)
    const url = new URL(window.location.href)
    url.searchParams.set("layer", id)
    window.history.replaceState(null, "", url.toString())
  }

  const current = TABS.find((t) => t.id === active)!
  const Active = current.Component

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-10 py-8 lg:py-12">
      <header className="mb-8">
        <p className="eyebrow mb-3">The Systemic &amp; Institutional Accountability Matrix</p>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.03] tracking-tight text-balance">
          Stop measuring the gap.{" "}
          <span className="text-primary italic">Audit the system</span> that makes it.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed text-pretty">
          Six instruments that turn the lens from individuals to institutions:
          stress-test national policy, predict legislation, audit algorithmic hiring,
          benchmark corporate disclosure, and forecast intersectional wealth equity.
        </p>
      </header>

      {/* Tab bar — horizontal scroll on mobile, large hit targets */}
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
                    "flex-1 min-w-[160px] flex items-center gap-3 rounded-md px-4 py-3 text-left transition-colors",
                    on ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="min-w-0">
                    <span className={cn("block text-[10px] font-mono uppercase tracking-wider", on ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                      {t.badge}
                    </span>
                    <span className="block text-sm font-semibold leading-tight truncate">{t.short}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-6">
          <current.icon className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-bold tracking-tight">{current.label}</h2>
        </div>
        <Active />
      </div>
    </div>
  )
}
