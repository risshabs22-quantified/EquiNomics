import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { PolicySimulator } from "@/components/models/policy-simulator"

export const metadata: Metadata = {
  title: "Policy Simulator",
  description:
    "Move sliders for paid leave, pay transparency, childcare, and flexible work — and see how the projected national wage gap might change over ten years.",
}

export default function PolicySimulatorPage() {
  return (
    <ModelShell
      index="01"
      kicker="Run the policy"
      title="Policy Simulator"
      lede="Pull the policy levers and watch the projected national wage gap move over the next ten years. Each slider has its own effect — including the weird part where really long parental leave can actually backfire."
    >
      <PolicySimulator />
      <p className="mt-6 max-w-3xl text-xs text-muted-foreground leading-relaxed">
        How it works: each lever chips away at the gap over time using a simple
        adoption curve. The numbers are rounded and meant to show direction, not
        predict the future — I calibrated them against what the labor-economics
        papers generally find.
      </p>
    </ModelShell>
  )
}
