import { Suspense } from "react"
import type { Metadata } from "next"
import { ArchiveExplorer } from "@/components/archive-explorer"

export const metadata: Metadata = {
  title: "Case Study Archive",
  description:
    "Real people's stories about gender inequality at work — filter by industry, what happened, and career stage. Each one is tagged with the economics that explains it.",
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
