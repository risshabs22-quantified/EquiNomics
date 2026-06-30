import type { Metadata } from "next"
import Link from "next/link"
import { DocPage, H2, P, UL, LI } from "@/components/doc-page"

export const metadata: Metadata = {
  title: "Data Ethics & Consent",
  description:
    "How EquiNomics protects contributors: anonymity, informed consent, sensitive-data handling, and the right to withdraw.",
}

export default function EthicsPage() {
  return (
    <DocPage
      eyebrow="Data Ethics & Consent"
      title="The person comes first"
      intro="Every story in the archive is from someone who trusted this project with something hard. This page is how I handle that."
      updated="June 2026"
    >
      <H2>Informed consent</H2>
      <P>
        Contributions are voluntary and require explicit consent before anything is
        published. By submitting, a contributor confirms the account is their own,
        that they have removed identifying details, and that they agree to anonymous
        publication as research data. Consent can be withdrawn at any time (see{" "}
        <Link href="#withdrawal" className="text-primary hover:underline">
          Withdrawal
        </Link>
        ).
      </P>

      <H2>Anonymity by design</H2>
      <UL>
        <LI>
          We collect a <strong>pseudonym or initials</strong>, never a legal name.
        </LI>
        <LI>
          Region is captured at a deliberately coarse grain (e.g. &ldquo;Midwest,
          USA&rdquo;) to prevent re-identification.
        </LI>
        <LI>
          We ask contributors to omit employer names, exact dates, and any detail
          that could single them out.
        </LI>
        <LI>
          We do not request, store, or display contact information, demographic
          identifiers beyond those shown, or any special-category data not essential
          to the analysis.
        </LI>
      </UL>

      <H2>Sensitive content</H2>
      <P>
        These narratives can touch on discrimination, harassment, caregiving strain,
        and financial hardship. We present them without sensationalism, never
        editorialize a contributor's pain into a headline they did not choose, and
        provide context rather than judgment. The economic annotations exist to
        explain structures, never to second-guess individuals.
      </P>

      <H2 id="withdrawal">Withdrawal &amp; correction</H2>
      <P>
        In this demonstration build, contributions are stored locally in your own
        browser, so you remain in complete control: you can remove any entry you
        submitted at any time by clearing it from your browser, and nothing you
        write leaves your device unless a future hosted version is explicitly opted
        into. A production deployment would additionally provide a one-click
        withdrawal mechanism and a contact channel for corrections.
      </P>

      <H2>Research-use principles</H2>
      <UL>
        <LI>No individual narrative is used to make causal claims.</LI>
        <LI>
          Aggregations never re-identify a contributor or reduce a person to a
          single statistic.
        </LI>
        <LI>
          The platform is non-commercial and exists for education and research.
        </LI>
      </UL>

      <P>
        Questions about this page can go to the EquiNomics project. See also our{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Use
        </Link>
        .
      </P>
    </DocPage>
  )
}
