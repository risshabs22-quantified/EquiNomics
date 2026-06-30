import type { Metadata } from "next"
import { AccountabilityDashboard } from "@/components/accountability/accountability-dashboard"

export const metadata: Metadata = {
  title: "Accountability Matrix",
  description:
    "Six tools that look at institutions instead of individuals — national policy, hiring algorithms, corporate pay gaps, and where wealth gaps stack up.",
}

export default function AccountabilityPage() {
  return <AccountabilityDashboard />
}
