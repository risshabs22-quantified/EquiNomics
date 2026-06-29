import { Suspense } from "react"
import type { Metadata } from "next"
import { LifespanDashboard } from "@/components/lifespan/lifespan-dashboard"

export const metadata: Metadata = {
  title: "The Macroeconomic Lifespan Trajectory Model",
  description:
    "An interactive framework tracking how gender economic disparities compound from early adulthood to retirement — twelve state-driven instruments across four life-stage modules.",
}

export default function LifespanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 text-muted-foreground">
          Loading the Lifespan Trajectory Model…
        </div>
      }
    >
      <LifespanDashboard />
    </Suspense>
  )
}
