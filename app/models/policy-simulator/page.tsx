import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { PolicySimulator } from "@/components/models/policy-simulator"

export const metadata: Metadata = {
  title: "Econometric Policy Simulator",
  description:
    "Adjust paid leave, wage transparency, subsidized childcare, and flexible-work policy levers to simulate the projected reduction in the gender wage gap over ten years.",
}

export default function PolicySimulatorPage() {
  return (
    <ModelShell
      index="01"
      kicker="Predictive Modeling"
      title="Econometric Policy Simulator"
      lede="Pull the levers of policy and watch the projected national gender wage gap respond over a ten-year horizon. The model decomposes each lever's long-run contribution — including the inverted-U where overly long parental leave begins to backfire."
    >
      <PolicySimulator />
      <p className="mt-6 max-w-3xl text-xs text-muted-foreground leading-relaxed">
        Methodology: each lever contributes a long-run percentage-point reduction,
        realized gradually via an adoption curve (1 − e^(−t/τ), τ ≈ 3.2 yrs), bounded
        by a structural residual the levers cannot erase. Coefficients are illustrative
        and calibrated to be directionally faithful to the labor-economics literature.
      </p>
    </ModelShell>
  )
}
