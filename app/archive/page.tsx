import { Suspense } from "react"
import type { Metadata } from "next"
import { ArchiveExplorer } from "@/components/archive-explorer"

export const metadata: Metadata = {
  title: "Case Study Archive",
  description:
    "A structured database of qualitative case studies on gender economic inequality, filterable by sector, economic phenomenon, and demographic indicators.",
}

export default function ArchivePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 text-muted-foreground">
          Loading archive…
        </div>
      }
    >
      <ArchiveExplorer />
    </Suspense>
  )
}
