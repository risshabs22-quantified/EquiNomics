import type { Metadata } from "next"
import { LifespanDashboard } from "@/components/lifespan/lifespan-dashboard"

export const metadata: Metadata = {
  title: "The Macroeconomic Lifespan Trajectory Model",
  description:
    "Twelve interactive tools that follow gender economic inequality from your first job to retirement — one life stage at a time.",
}

export default function LifespanPage() {
  return <LifespanDashboard />
}
