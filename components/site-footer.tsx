import Link from "next/link"
import Image from "next/image"

const COLUMNS = [
  {
    title: "Research",
    links: [
      { href: "/", label: "Macro Dashboard" },
      { href: "/archive", label: "Case Study Archive" },
      { href: "/methodology", label: "Methodology & Sources" },
      { href: "/contribute", label: "Contribute Your Data" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/about", label: "About EquiNomics" },
      { href: "/methodology#concepts", label: "Economic Glossary" },
    ],
  },
  {
    title: "Legal & Ethics",
    links: [
      { href: "/ethics", label: "Data Ethics & Consent" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/equinomics-logo.png"
                alt="EquiNomics"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md"
              />
              <span className="font-serif text-xl font-semibold tracking-tight">
                Equi<span className="text-primary">Nomics</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs text-pretty">
              A narrative economics platform examining gender economic inequality
              where macro data meets lived experience.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-4">{col.title}</h4>
              <nav className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EquiNomics Research Collective. An academic
            project for education and research.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Macro figures are illustrative, drawn from public datasets — see{" "}
            <Link href="/methodology" className="underline hover:text-foreground">
              Methodology
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
