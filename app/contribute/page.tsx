import type { Metadata } from "next"
import { ContributionForm } from "@/components/contribution-form"

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Tell your experience anonymously — what industry you're in, what happened, what it cost you, and what got in the way.",
}

export default function ContributePage() {
  return <ContributionForm />
}
