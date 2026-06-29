import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { PinkTaxIndexer } from "@/components/models/pink-tax-indexer"

export const metadata: Metadata = {
  title: "Pink Tax Inflation Indexer",
  description:
    "Input your spending across personal care, apparel, services and more to calculate your annual Gender Inflation Premium — the surcharge on products marketed to women.",
}

export default function PinkTaxPage() {
  return (
    <ModelShell
      index="04"
      kicker="Consumer Price Discrimination"
      title="The Pink Tax Inflation Indexer"
      lede="Products marketed to women frequently cost more than near-identical men's versions. Enter your spending habits to index your personal 'Gender Inflation Premium' — annually, over a lifetime, and as forgone investment growth."
    >
      <PinkTaxIndexer />
    </ModelShell>
  )
}
