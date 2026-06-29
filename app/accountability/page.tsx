import type { Metadata } from "next"
import { AccountabilityDashboard } from "@/components/accountability/accountability-dashboard"

export const metadata: Metadata = {
  title: "The Systemic & Institutional Accountability Matrix",
  description:
    "Stress-test national policy frameworks, predict legislative impact, audit algorithmic hiring bias, benchmark corporate wage disclosure, and forecast intersectional wealth equity.",
}

export default function AccountabilityPage() {
  return <AccountabilityDashboard />
}
