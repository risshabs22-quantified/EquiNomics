import type { Metadata } from "next"
import { ModelShell } from "@/components/models/model-shell"
import { ShadowEconomy } from "@/components/models/shadow-economy"

export const metadata: Metadata = {
  title: "Shadow Economy Invoice",
  description:
    "Log your weekly hours of housework, caregiving, and mental load, price them at local market wages, and download an invoice for all the work GDP never counts.",
}

export default function ShadowEconomyPage() {
  return (
    <ModelShell
      index="02"
      kicker="Put a price on it"
      title="Shadow Economy Invoice"
      lede="Unpaid care work doesn't show up in GDP, but the whole economy would stop without it. Enter your weekly hours, pick your region, and print a real invoice for what that labor is worth."
    >
      <ShadowEconomy />
    </ModelShell>
  )
}
