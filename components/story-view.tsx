"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BookMarked,
  Building2,
  MapPin,
  TrendingDown,
  Users,
  Quote,
} from "lucide-react"
import {
  GLOSSARY,
  formatUSD,
  type CaseStudy,
} from "@/lib/data"
import { allStudies } from "@/lib/contributions"
import { PhenomenonBadge } from "@/components/phenomenon-badge"

/**
 * Renders a narrative paragraph, injecting numbered superscript markers wherever
 * an annotation's `anchor` phrase appears. The markers link to the Economic
 * Sidebar footnotes.
 */
function AnnotatedParagraph({
  text,
  anchors,
}: {
  text: string
  anchors: { anchor: string; index: number }[]
}) {
  // Find the first matching anchor in this paragraph (anchors are unique phrases).
  const match = anchors
    .map((a) => ({ ...a, at: text.indexOf(a.anchor) }))
    .filter((a) => a.at >= 0)
    .sort((a, b) => a.at - b.at)[0]

  if (!match) {
    return (
      <p className="mb-5 font-serif text-lg leading-[1.85] text-foreground/90">
        {text}
      </p>
    )
  }

  const before = text.slice(0, match.at)
  const anchorText = text.slice(match.at, match.at + match.anchor.length)
  const after = text.slice(match.at + match.anchor.length)

  return (
    <p className="mb-5 font-serif text-lg leading-[1.85] text-foreground/90">
      {before}
      <span className="bg-primary/10 border-b border-primary/50 px-0.5">
        {anchorText}
        <a
          href={`#fn-${match.index}`}
          className="align-super text-xs font-mono text-primary ml-0.5 no-underline hover:underline"
        >
          [{match.index}]
        </a>
      </span>
      {after}
    </p>
  )
}

export function StoryView({
  slug,
  initialStudy = null,
}: {
  slug: string
  initialStudy?: CaseStudy | null
}) {
  // Seed study (if any) renders immediately; `undefined` only when we have no
  // seed and are still checking localStorage for a contributed entry.
  const [study, setStudy] = useState<CaseStudy | null | undefined>(
    initialStudy ?? undefined,
  )

  useEffect(() => {
    const found = allStudies().find((c) => c.slug === slug) ?? initialStudy ?? null
    setStudy(found)
  }, [slug, initialStudy])

  if (study === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-20 text-muted-foreground">
        Loading case study…
      </div>
    )
  }

  if (study === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 lg:px-10 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold">Case study not found</h1>
        <p className="mt-3 text-muted-foreground">
          This data point may have been a local contribution on another device.
        </p>
        <Link
          href="/archive"
          className="mt-6 inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the archive
        </Link>
      </div>
    )
  }

  const anchors = study.annotations.map((a, i) => ({
    anchor: a.anchor,
    index: i + 1,
  }))

  const related = allStudies()
    .filter(
      (c) =>
        c.slug !== study.slug &&
        c.phenomena.some((p) => study.phenomena.includes(p)),
    )
    .slice(0, 2)

  return (
    <article className="mx-auto max-w-7xl px-5 lg:px-10 py-10">
      <Link
        href="/archive"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Case Study Archive
      </Link>

      {/* Title block */}
      <header className="max-w-3xl mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="eyebrow">{study.sector}</span>
          {study.userContributed && (
            <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
              Community contribution
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold leading-tight text-balance">
          {study.headline}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          {study.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {study.phenomena.map((p) => (
            <PhenomenonBadge key={p} phenomenon={p} asLink />
          ))}
        </div>
      </header>

      {/* Dual-column: narrative (left) + economic sidebar (right) */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
        {/* LEFT — Human narrative */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-border">
            <Quote className="h-4 w-4 text-primary" />
            <h2 className="eyebrow">The Narrative</h2>
          </div>
          <div className="max-w-prose">
            {study.narrative.map((para, i) => (
              <AnnotatedParagraph key={i} text={para} anchors={anchors} />
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              — As told by{" "}
              <span className="text-foreground font-medium">{study.pseudonym}</span>,{" "}
              {study.demographics.seniority.toLowerCase()} professional,{" "}
              {study.demographics.region}. Identifying details withheld per our{" "}
              <Link href="/ethics" className="text-primary hover:underline">
                data ethics protocol
              </Link>
              .
            </p>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="eyebrow mb-4">Related Data Points</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/archive/${r.slug}`}
                    className="group rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
                  >
                    <span className="eyebrow">{r.sector}</span>
                    <p className="mt-1 font-serif font-medium group-hover:text-primary transition-colors">
                      {r.headline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Economic Sidebar */}
        <aside className="min-w-0">
          <div className="lg:sticky lg:top-20 space-y-6">
            {/* Quick stats */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="bg-primary/10 px-4 py-3 border-b border-border">
                <p className="font-mono text-3xl font-bold text-primary tabular-nums">
                  {study.keyStat.value}
                </p>
                <p className="text-xs text-muted-foreground">{study.keyStat.label}</p>
              </div>
              <dl className="divide-y divide-border text-sm">
                <Row
                  icon={<TrendingDown className="h-4 w-4" />}
                  label="Est. opportunity cost"
                  value={formatUSD(study.estimatedLostWages)}
                />
                <Row
                  icon={<Users className="h-4 w-4" />}
                  label="Caregiving"
                  value={study.demographics.caregiving}
                />
                <Row
                  icon={<Building2 className="h-4 w-4" />}
                  label="Seniority"
                  value={`${study.demographics.seniority} · ${study.demographics.yearsExperience}y`}
                />
                <Row
                  icon={<MapPin className="h-4 w-4" />}
                  label="Region"
                  value={study.demographics.region}
                />
              </dl>
            </div>

            {/* Structural barriers */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="eyebrow mb-3">Structural Barriers</h3>
              <ul className="space-y-2">
                {study.structuralBarriers.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-primary mt-1">›</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Economic footnotes */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="h-4 w-4 text-primary" />
                <h3 className="eyebrow">Economic Footnotes</h3>
              </div>
              <ol className="space-y-5">
                {study.annotations.map((a, i) => {
                  const concept = GLOSSARY[a.conceptKey]
                  return (
                    <li
                      key={i}
                      id={`fn-${i + 1}`}
                      className="scroll-mt-24 border-l-2 border-primary/40 pl-3"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-xs text-primary">
                          [{i + 1}]
                        </span>
                        <span className="font-serif font-semibold">
                          {concept.term}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {a.note}
                      </p>
                      {concept.theorist && (
                        <p className="mt-1 text-xs font-mono text-muted-foreground/70">
                          cf. {concept.theorist}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>

            <Link
              href="/contribute"
              className="block rounded-lg border border-primary/40 bg-primary/10 p-4 text-center text-sm font-medium hover:bg-primary/15 transition-colors"
            >
              Add your own data point →
            </Link>
          </div>
        </aside>
      </div>
    </article>
  )
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
