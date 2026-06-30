import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { PinkTaxIndexer } from "@/components/models/pink-tax-indexer"

export const metadata: Metadata = {
  title: "Pink Tax Calculator",
  description:
    "Add up what you spend on products marketed to women, apply the documented markups, and see what the pink tax costs you in a year — and what you'd have if you invested it instead.",
}

export default function PinkTaxPage() {
  return (
    <ModelShell
      index="04"
      kicker="The pink tax"
      title="Pink Tax Calculator"
      lede="Same product, different packaging, higher price — you've probably seen it. Plug in what you actually spend each month and see what that markup costs you in a year, over a lifetime, and as savings you never got to grow."
    >
      <PinkTaxIndexer />
    </ModelShell>
  )
}
