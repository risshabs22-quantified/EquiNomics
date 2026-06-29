import type { Metadata } from "next"
import Link from "next/link"
import { DocPage, H2, P, UL, LI } from "@/components/doc-page"

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of the EquiNomics academic research platform.",
}

export default function TermsPage() {
  return (
    <DocPage
      eyebrow="Terms of Use"
      title="Terms of Use"
      intro="By using EquiNomics, you agree to these terms. They are written to keep the platform a safe, honest, and useful space for research and education."
      updated="June 2026"
    >
      <H2>Purpose &amp; nature</H2>
      <P>
        EquiNomics is a non-commercial, academic project. Its content — including
        macroeconomic indicators and case studies — is provided for educational and
        research purposes only and does not constitute legal, financial, career, or
        professional advice. Macro figures are illustrative; see our{" "}
        <Link href="/methodology" className="text-primary hover:underline">
          methodology
        </Link>
        .
      </P>

      <H2>Acceptable use</H2>
      <UL>
        <LI>
          Contribute only experiences that are <strong>your own</strong> and that
          you have anonymized.
        </LI>
        <LI>
          Do not submit content that identifies third parties, is unlawful,
          defamatory, harassing, or knowingly false.
        </LI>
        <LI>
          Do not attempt to de-anonymize contributors or misuse the archive to harm
          any individual or group.
        </LI>
        <LI>Do not disrupt, scrape abusively, or attack the platform.</LI>
      </UL>

      <H2>Your contributions</H2>
      <P>
        You retain ownership of what you write. By submitting, you grant EquiNomics a
        non-exclusive license to display and analyze the anonymized content for
        research and educational purposes, consistent with our{" "}
        <Link href="/ethics" className="text-primary hover:underline">
          Data Ethics &amp; Consent
        </Link>{" "}
        protocol. You confirm you have the right to share what you submit.
      </P>

      <H2>Accuracy &amp; no warranty</H2>
      <P>
        Indicators are approximate and simplified; case studies are self-reported.
        The platform is provided &ldquo;as is,&rdquo; without warranties of accuracy,
        completeness, or fitness for a particular purpose. Verify figures against
        primary sources before relying on or citing them.
      </P>

      <H2>Limitation of liability</H2>
      <P>
        To the maximum extent permitted by law, the EquiNomics Research Collective is
        not liable for any indirect or consequential damages arising from use of the
        platform or reliance on its content.
      </P>

      <H2>Changes</H2>
      <P>
        We may revise these terms; continued use after changes constitutes
        acceptance. The &ldquo;last updated&rdquo; date above reflects the current
        version.
      </P>
    </DocPage>
  )
}
