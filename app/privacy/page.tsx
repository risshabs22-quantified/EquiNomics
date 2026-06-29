import type { Metadata } from "next"
import Link from "next/link"
import { DocPage, H2, P, UL, LI } from "@/components/doc-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How EquiNomics handles data: a privacy-first, local-by-default approach for this academic demonstration.",
}

export default function PrivacyPage() {
  return (
    <DocPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="EquiNomics is a privacy-first academic project. This policy explains, in plain language, what happens to your data."
      updated="June 2026"
    >
      <H2>Summary</H2>
      <P>
        Case studies you submit are stored <strong>locally in your own browser</strong>{" "}
        using <code className="font-mono text-sm text-primary">localStorage</code>.
        In this demonstration build they are <strong>not transmitted to any
        server</strong>, not associated with your identity, and visible only on your
        device.
      </P>

      <H2>What we collect</H2>
      <UL>
        <LI>
          <strong>Contribution content</strong> you voluntarily enter (pseudonym,
          headline, sector, narrative, etc.) — stored locally on your device.
        </LI>
        <LI>
          <strong>No account is required</strong>; we do not collect names, emails,
          passwords, or contact details.
        </LI>
        <LI>
          <strong>Aggregate, privacy-preserving analytics</strong> may be collected
          by our hosting/analytics provider (e.g. anonymized page-view counts) to
          understand usage. These do not identify you.
        </LI>
      </UL>

      <H2>What we do not do</H2>
      <UL>
        <LI>We do not sell or share your data.</LI>
        <LI>We do not build advertising profiles.</LI>
        <LI>We do not track you across other websites.</LI>
      </UL>

      <H2>Cookies &amp; local storage</H2>
      <P>
        We use <code className="font-mono text-sm text-primary">localStorage</code>{" "}
        strictly to persist your own contributions between visits. You can clear this
        at any time through your browser settings, which permanently removes any
        entries you submitted.
      </P>

      <H2>Your rights</H2>
      <P>
        Because your contributions live on your device, you have direct control: view,
        edit, or delete them by managing your browser storage. For broader data-rights
        questions in a future hosted version (access, deletion, portability under
        regimes such as GDPR/CCPA), a contact channel would be provided.
      </P>

      <H2>Children</H2>
      <P>
        This platform is intended for an adult, academic audience and is not directed
        to children under 16.
      </P>

      <H2>Changes</H2>
      <P>
        We may update this policy as the project evolves; material changes will be
        reflected in the &ldquo;last updated&rdquo; date above. See also our{" "}
        <Link href="/ethics" className="text-primary hover:underline">
          Data Ethics &amp; Consent
        </Link>{" "}
        protocol.
      </P>
    </DocPage>
  )
}
