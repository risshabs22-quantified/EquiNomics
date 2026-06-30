import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { IntersectionalExaminer } from "@/components/models/intersectional-examiner"

export const metadata: Metadata = {
  title: "Intersectional Pay Gap Chart",
  description:
    "Cross gender with race, education, or region and see how pay gaps stack — the part a single headline average hides completely.",
}

export default function IntersectionalPage() {
  return (
    <ModelShell
      index="03"
      kicker="Stack the factors"
      title="Where the penalties stack up"
      lede="One average number hides a lot. Toggle gender against race, education, or region and you'll see how the gaps pile on — a Hispanic woman's gap isn't the gender gap plus the race gap, it's worse than that."
    >
      <IntersectionalExaminer />
    </ModelShell>
  )
}
