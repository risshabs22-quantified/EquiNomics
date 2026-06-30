"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle2, ChevronRight, Send } from "lucide-react"
import {
  SECTORS,
  PHENOMENA,
  GLOSSARY,
  formatUSD,
  type Sector,
  type Phenomenon,
  type SeniorityLevel,
  type CaregivingStatus,
  type CaseStudy,
  type EconomicAnnotation,
} from "@/lib/data"
import { saveContribution, slugify } from "@/lib/contributions"
import { PhenomenonBadge, PHENOMENON_LABEL } from "@/components/phenomenon-badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const SENIORITY: SeniorityLevel[] = [
  "Entry-level",
  "Mid-career",
  "Senior",
  "Executive",
  "Self-employed",
]
const CAREGIVING: CaregivingStatus[] = [
  "No dependents",
  "Primary caregiver",
  "Shared caregiving",
  "Eldercare provider",
]

/** Each phenomenon maps to the economic concept that frames it. */
const PHENOMENON_CONCEPT: Record<Phenomenon, keyof typeof GLOSSARY> = {
  "#MotherhoodPenalty": "compensatingDifferentials",
  "#OccupationalSegregation": "occupationalSegregation",
  "#UnpaidLaborValue": "careEconomy",
  "#GlassCeiling": "statisticalDiscrimination",
  "#WageElasticity": "wageElasticity",
  "#NegotiationGap": "statisticalDiscrimination",
  "#CareEconomy": "careEconomy",
  "#SecondShift": "secondShift",
  "#PromotionGap": "humanCapital",
  "#GenderWealthGap": "humanCapital",
}

interface FormState {
  pseudonym: string
  headline: string
  sector: Sector | ""
  phenomena: Phenomenon[]
  seniority: SeniorityLevel
  yearsExperience: number
  caregiving: CaregivingStatus
  region: string
  firstGen: boolean
  estimatedLostWages: number
  barriers: string
  summary: string
  narrative: string
  consent: boolean
}

const initial: FormState = {
  pseudonym: "",
  headline: "",
  sector: "",
  phenomena: [],
  seniority: "Mid-career",
  yearsExperience: 8,
  caregiving: "No dependents",
  region: "",
  firstGen: false,
  estimatedLostWages: 100000,
  barriers: "",
  summary: "",
  narrative: "",
  consent: false,
}

export function ContributionForm() {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<CaseStudy | null>(null)

  const completion = useMemo(() => {
    const checks = [
      form.pseudonym.length >= 2,
      form.headline.length >= 8,
      !!form.sector,
      form.phenomena.length > 0,
      !!form.region.trim(),
      form.summary.length >= 20,
      form.narrative.length >= 60,
      form.consent,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
  }, [form])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }))
  }

  function togglePhenomenon(p: Phenomenon) {
    setForm((f) => ({
      ...f,
      phenomena: f.phenomena.includes(p)
        ? f.phenomena.filter((x) => x !== p)
        : [...f.phenomena, p],
    }))
    if (errors.phenomena) setErrors((e) => ({ ...e, phenomena: "" }))
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (form.pseudonym.trim().length < 2) e.pseudonym = "Add a pseudonym (≥ 2 chars)."
    if (form.headline.trim().length < 8) e.headline = "Give your story a headline (≥ 8 chars)."
    if (!form.sector) e.sector = "Select an economic sector."
    if (form.phenomena.length === 0) e.phenomena = "Tag at least one economic phenomenon."
    if (!form.region.trim()) e.region = "Add a region."
    if (form.summary.trim().length < 20) e.summary = "Write a short summary (≥ 20 chars)."
    if (form.narrative.trim().length < 60) e.narrative = "Share your narrative (≥ 60 chars)."
    if (!form.consent) e.consent = "Consent is required to publish."
    setErrors(e)
    if (Object.keys(e).length) {
      toast.error("Please complete the highlighted fields.")
      // Scroll to first error
      const first = Object.keys(e)[0]
      document.getElementById(`field-${first}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    const annotations: EconomicAnnotation[] = form.phenomena.map((p) => {
      const key = PHENOMENON_CONCEPT[p]
      return { anchor: "", conceptKey: key, note: GLOSSARY[key].definition }
    })

    const study: CaseStudy = {
      slug: slugify(form.headline),
      pseudonym: form.pseudonym.trim(),
      headline: form.headline.trim(),
      sector: form.sector as Sector,
      phenomena: form.phenomena,
      demographics: {
        seniority: form.seniority,
        yearsExperience: form.yearsExperience,
        caregiving: form.caregiving,
        region: form.region.trim(),
        firstGenProfessional: form.firstGen,
      },
      estimatedLostWages: form.estimatedLostWages,
      structuralBarriers: form.barriers
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, 8),
      summary: form.summary.trim(),
      narrative: form.narrative
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
      annotations,
      keyStat: {
        value: formatUSD(form.estimatedLostWages),
        label: "Self-reported opportunity cost",
      },
      contributedAt: new Date().toISOString().slice(0, 10),
      userContributed: true,
    }

    saveContribution(study)
    setSubmitted(study)
    toast.success("Your story is in the archive now.")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Success state ──
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-chart-5" />
        <h1 className="mt-6 font-serif text-3xl font-semibold">
          Thank you — your story is live.
        </h1>
        <p className="mt-3 text-muted-foreground">
          It's in the archive now, tagged with the economic concepts that fit what
          you described.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/archive/${submitted.slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:bg-primary/90"
          >
            View your case study <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/archive"
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-sm text-sm font-medium hover:bg-secondary"
          >
            Browse the archive
          </Link>
        </div>
        <button
          onClick={() => {
            setForm(initial)
            setSubmitted(null)
          }}
          className="mt-6 text-sm text-muted-foreground underline hover:text-foreground"
        >
          Submit another story
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-10 py-10">
      <div className="max-w-2xl mb-10">
        <p className="eyebrow mb-2">Share your story</p>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">
          Tell us what happened — in your own words
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Your story goes into the archive anonymously, sorted by industry, career
          stage, what it cost you, and what got in the way. Read the{" "}
          <Link href="/ethics" className="text-primary hover:underline">
            data ethics & consent page
          </Link>{" "}
          first.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <Section title="01 · Identity (anonymized)">
            <Field id="field-pseudonym" label="Pseudonym or initials" error={errors.pseudonym}>
              <input
                className={inputCls(!!errors.pseudonym)}
                placeholder="e.g. Dr. A. or Maria K."
                value={form.pseudonym}
                onChange={(e) => set("pseudonym", e.target.value)}
              />
            </Field>
            <Field id="field-region" label="Region" error={errors.region}>
              <input
                className={inputCls(!!errors.region)}
                placeholder="e.g. Midwest, USA"
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="02 · Economic classification">
            <Field id="field-headline" label="Headline for your story" error={errors.headline}>
              <input
                className={inputCls(!!errors.headline)}
                placeholder="e.g. The engineer who was a 'culture fit' problem"
                value={form.headline}
                onChange={(e) => set("headline", e.target.value)}
              />
            </Field>
            <Field id="field-sector" label="Economic sector" error={errors.sector}>
              <select
                className={inputCls(!!errors.sector)}
                value={form.sector}
                onChange={(e) => set("sector", e.target.value as Sector)}
              >
                <option value="">Select a sector…</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              id="field-phenomena"
              label="Economic phenomena (select all that apply)"
              error={errors.phenomena}
            >
              <div className="flex flex-wrap gap-1.5">
                {PHENOMENA.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePhenomenon(p)}
                    className={cn(
                      "rounded-sm border px-2 py-1 font-mono text-xs transition-colors",
                      form.phenomena.includes(p)
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="03 · Demographic indicators">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field id="field-seniority" label="Seniority">
                <select
                  className={inputCls(false)}
                  value={form.seniority}
                  onChange={(e) => set("seniority", e.target.value as SeniorityLevel)}
                >
                  {SENIORITY.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field id="field-caregiving" label="Caregiving status">
                <select
                  className={inputCls(false)}
                  value={form.caregiving}
                  onChange={(e) =>
                    set("caregiving", e.target.value as CaregivingStatus)
                  }
                >
                  {CAREGIVING.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="field-years" label={`Years of experience: ${form.yearsExperience}`}>
              <Slider
                value={[form.yearsExperience]}
                min={0}
                max={40}
                step={1}
                onValueChange={([v]) => set("yearsExperience", v)}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.firstGen}
                onChange={(e) => set("firstGen", e.target.checked)}
                className="accent-[var(--primary)] h-4 w-4"
              />
              I am a first-generation professional
            </label>
          </Section>

          <Section title="04 · Opportunity cost">
            <Field
              id="field-lost"
              label={`Estimated lost wages / opportunity cost: ${formatUSD(form.estimatedLostWages)}`}
            >
              <Slider
                value={[form.estimatedLostWages]}
                min={0}
                max={2000000}
                step={10000}
                onValueChange={([v]) => set("estimatedLostWages", v)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Your best estimate of cumulative forgone earnings — promotions
                missed, hours unpaid, wages below peers.
              </p>
            </Field>
            <Field id="field-barriers" label="Structural barriers (one per line)">
              <textarea
                className={inputCls(false) + " min-h-24 resize-y"}
                placeholder={"No employer-paid parental leave\nOpaque pay bands\nExcluded from informal networks"}
                value={form.barriers}
                onChange={(e) => set("barriers", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="05 · The narrative">
            <Field id="field-summary" label="One-sentence summary" error={errors.summary}>
              <textarea
                className={cn(inputCls(!!errors.summary), "min-h-16 resize-y")}
                placeholder="A short abstract of your experience…"
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
            </Field>
            <Field
              id="field-narrative"
              label="Your story (separate paragraphs with a blank line)"
              error={errors.narrative}
            >
              <textarea
                className={cn(inputCls(!!errors.narrative), "min-h-48 resize-y font-serif text-base")}
                placeholder="Tell it in your own words…"
                value={form.narrative}
                onChange={(e) => set("narrative", e.target.value)}
              />
            </Field>
          </Section>

          <Section title="06 · Consent">
            <label
              id="field-consent"
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 cursor-pointer",
                errors.consent ? "border-destructive" : "border-border",
              )}
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="accent-[var(--primary)] h-4 w-4 mt-0.5"
              />
              <span className="text-sm text-muted-foreground">
                I confirm this account is my own, that I have removed identifying
                details, and I consent to it being published anonymously as
                research data under the{" "}
                <Link href="/ethics" className="text-primary hover:underline">
                  EquiNomics ethics protocol
                </Link>
                . I understand entries are stored locally in this browser for this
                demonstration.
              </span>
            </label>
            {errors.consent && (
              <p className="text-xs text-destructive">{errors.consent}</p>
            )}
          </Section>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
            Publish to the archive
          </button>
        </form>

        {/* ── Live preview ── */}
        <aside className="min-w-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="eyebrow">Live preview</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {completion}% complete
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <span className="eyebrow">{form.sector || "Sector"}</span>
              <h4 className="mt-2 font-serif text-lg font-semibold leading-snug">
                {form.headline || "Your headline appears here"}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {form.summary || "Your summary will preview here as you type."}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {form.phenomena.length ? (
                  form.phenomena.map((p) => (
                    <PhenomenonBadge key={p} phenomenon={p} />
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground/60">
                    Tag what happened to you
                  </span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="font-mono text-base font-semibold text-primary tabular-nums">
                    {formatUSD(form.estimatedLostWages)}
                  </div>
                  <div className="text-muted-foreground">Opportunity cost</div>
                </div>
                <div>
                  <div className="font-mono text-base font-semibold tabular-nums">
                    {form.yearsExperience}y
                  </div>
                  <div className="text-muted-foreground">{form.seniority}</div>
                </div>
              </div>
            </div>

            {form.phenomena.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="eyebrow mb-2">Economics that fit your story</h4>
                <p className="text-xs text-muted-foreground">
                  Based on your tags, these concepts will show up next to your story:
                </p>
                <ul className="mt-2 space-y-1.5">
                  {[...new Set(form.phenomena.map((p) => PHENOMENON_CONCEPT[p]))].map(
                    (k) => (
                      <li key={k} className="text-xs">
                        <span className="font-serif font-medium text-foreground">
                          {GLOSSARY[k].term}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="space-y-5">
      <legend className="eyebrow mb-1 pb-2 border-b border-border w-full">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <Label className="text-sm font-medium mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full rounded-sm border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary",
    hasError ? "border-destructive" : "border-border",
  )
}
