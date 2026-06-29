import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Phenomenon } from "@/lib/data"

/** Short human labels for the hashtag taxonomy. */
export const PHENOMENON_LABEL: Record<Phenomenon, string> = {
  "#MotherhoodPenalty": "Motherhood Penalty",
  "#OccupationalSegregation": "Occupational Segregation",
  "#UnpaidLaborValue": "Unpaid Labor Value",
  "#GlassCeiling": "Glass Ceiling",
  "#WageElasticity": "Wage Elasticity",
  "#NegotiationGap": "Negotiation Gap",
  "#CareEconomy": "Care Economy",
  "#SecondShift": "Second Shift",
  "#PromotionGap": "Promotion Gap",
  "#GenderWealthGap": "Gender Wealth Gap",
}

export function PhenomenonBadge({
  phenomenon,
  asLink = false,
  className,
}: {
  phenomenon: Phenomenon
  asLink?: boolean
  className?: string
}) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] tracking-tight text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground",
        className,
      )}
    >
      {phenomenon}
    </span>
  )
  if (asLink) {
    return (
      <Link href={`/archive?phenomenon=${encodeURIComponent(phenomenon)}`}>
        {content}
      </Link>
    )
  }
  return content
}
