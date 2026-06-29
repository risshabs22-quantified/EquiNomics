import type { ReactNode } from "react"

export function DocPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
  wide = false,
}: {
  eyebrow: string
  title: string
  intro?: string
  updated?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <main className="mx-auto max-w-7xl px-5 lg:px-10 py-14">
      <div className={wide ? "" : "max-w-3xl"}>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight text-balance">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-pretty">
            {intro}
          </p>
        )}
        {updated && (
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            Last updated: {updated}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </div>
    </main>
  )
}

/** Lightweight prose primitives so document pages read consistently. */
export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 font-serif text-2xl font-semibold mt-12 mb-4 first:mt-0"
    >
      {children}
    </h2>
  )
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-foreground/85 mb-4">{children}</p>
  )
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="space-y-2 mb-4">{children}</ul>
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-[15px] leading-relaxed text-foreground/85">
      <span className="text-primary mt-1.5 shrink-0">›</span>
      <span>{children}</span>
    </li>
  )
}
