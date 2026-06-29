import type { Metadata } from "next"
import { ContributionForm } from "@/components/contribution-form"

export const metadata: Metadata = {
  title: "Contribute Your Data",
  description:
    "Submit your lived experience as an anonymized economic data point — categorized by industry, experience, opportunity cost, and structural barriers.",
}

export default function ContributePage() {
  return <ContributionForm />
}
