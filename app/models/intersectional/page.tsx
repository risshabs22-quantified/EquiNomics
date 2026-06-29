import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { IntersectionalExaminer } from "@/components/models/intersectional-examiner"

export const metadata: Metadata = {
  title: "Intersectional Disparity Cross-Examiner",
  description:
    "Toggle intersecting variables — gender with race, education, or region — to visually isolate the compounding economic penalties that single-axis statistics conceal.",
}

export default function IntersectionalPage() {
  return (
    <ModelShell
      index="03"
      kicker="Dynamic Regression"
      title="Intersectional Disparity Cross-Examiner"
      lede="A single average hides the compounding. Toggle gender against race, education, or region to see how penalties stack — the gap for a Hispanic woman is not the gender gap plus the race gap, but a steeper intersection of the two."
    >
      <IntersectionalExaminer />
    </ModelShell>
  )
}
