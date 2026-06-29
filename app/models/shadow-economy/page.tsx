import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { ShadowEconomy } from "@/components/models/shadow-economy"

export const metadata: Metadata = {
  title: "Shadow Economy · Unpaid Labor Invoice",
  description:
    "Map your weekly hours of domestic labor, caregiving, and mental load to localized market wages and generate a downloadable SVG invoice of your uncompensated GDP contribution.",
}

export default function ShadowEconomyPage() {
  return (
    <ModelShell
      index="02"
      kicker="The Care Economy, Quantified"
      title="The Shadow Economy Invoice Generator"
      lede="Unpaid care work is excluded from GDP, yet the formal economy could not run a single day without it. Enter your weekly hours, map them to localized replacement wages, and issue a formal invoice — to the economy itself."
    >
      <ShadowEconomy />
    </ModelShell>
  )
}
