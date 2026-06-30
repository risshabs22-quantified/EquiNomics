"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Copy, Check } from "lucide-react"
import { SCRIPT_TONES, type ScriptTone } from "@/lib/lifespan-data"
import { ChartTooltip } from "@/components/models/model-shell"
import {
  FeaturePanel,
  SliderField,
  StatCell,
  StatGrid,
  Segmented,
  money,
  compactMoney,
} from "@/components/lifespan/ui"
import { PinkTaxIndexer } from "@/components/models/pink-tax-indexer"

export function ModuleMicro() {
  return (
    <div className="grid gap-6 lg:gap-8">
      <ScriptBuilder />
      <FeaturePanel
        index="11"
        kicker="The pink tax"
        title="The Pink Tax Micro-Audit Indexer"
        blurb="Run your everyday spending against the markups that get tacked onto products aimed at women, and see what that 'pink tax' costs you in a year — and what it could've grown into instead."
      >
        <PinkTaxIndexer />
      </FeaturePanel>
      <WealthGapEngine />
    </div>
  )
}

/* ─────────────────────── 10 · Pay-Equity Script Builder ─────────────────────── */

function buildScript(
  tone: ScriptTone,
  o: { name: string; role: string; current: number; market: number; years: number },
) {
  const gap = o.market - o.current
  const gapPct = o.current ? ((gap / o.current) * 100).toFixed(1) : "0"
  const m = money(o.market)
  const c = money(o.current)
  const g = money(Math.max(0, gap))

  if (tone === "collaborative") {
    return `Hi [Manager],

Thank you for your continued support of my growth in the ${o.role} role. I'd love to set aside time to discuss my compensation.

After reviewing market data for comparable roles with ${o.years} years of experience, the market average sits around ${m}, while my current salary is ${c} — a gap of roughly ${g} (${gapPct}%). I'm raising this proactively because I'm committed to ${`our team`} long-term and want to ensure my compensation reflects my contributions and the market.

Could we schedule a pay-equity review? I'm happy to share the benchmarks I used. Thank you for considering it.

Best,
${o.name || "[Your name]"}`
  }
  if (tone === "direct") {
    return `Hi [Manager],

I'd like to request a salary adjustment. Based on current market benchmarks for the ${o.role} role at ${o.years} years of experience, the market rate is approximately ${m}. My current salary of ${c} is about ${gapPct}% below that — a ${g} gap.

I'm requesting that we close this gap, and I'd like to schedule a formal pay-equity review to do so. I can provide the data behind these figures.

Thanks,
${o.name || "[Your name]"}`
  }
  return `To: [Manager / HR]
Re: Formal Request for Compensation Review — ${o.role}

I am writing to formally request a review of my compensation. Based on independent market benchmarks for the ${o.role} position commensurate with ${o.years} years of experience, the prevailing market average is approximately ${m}. My current annual salary is ${c}, representing a shortfall of approximately ${g} (${gapPct}%).

Consistent with the principle of equal pay for equal work — as reflected in the Equal Pay Act of 1963 and applicable state pay-equity statutes — I respectfully request a formal pay-equity audit of my role and a corresponding adjustment. I am available to provide supporting documentation and to discuss at your earliest convenience.

Sincerely,
${o.name || "[Your name]"}`
}

function ScriptBuilder() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("Senior Analyst")
  const [current, setCurrent] = useState(82000)
  const [market, setMarket] = useState(95000)
  const [years, setYears] = useState(6)
  const [tone, setTone] = useState<ScriptTone>("collaborative")
  const [copied, setCopied] = useState(false)

  const script = useMemo(
    () => buildScript(tone, { name, role, current, market, years }),
    [tone, name, role, current, market, years],
  )
  const gap = Math.max(0, market - current)
  const gapPct = current ? (gap / current) * 100 : 0

  async function copy() {
    try {
      await navigator.clipboard.writeText(script)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <FeaturePanel
      index="10"
      kicker="Actually ask"
      title="Pay-Equity Script Builder"
      blurb="Drop in your numbers and get a ready-to-send script for asking about your pay, grounded in the actual law. Copy it and go."
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4">
          <Labeled label="Your name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" className={inputCls} />
          </Labeled>
          <Labeled label="Current role">
            <input value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} />
          </Labeled>
          <SliderField label="Current salary" value={current} onChange={setCurrent} min={30000} max={300000} step={1000} format={(v) => money(v)} />
          <SliderField label="Market average" value={market} onChange={setMarket} min={30000} max={300000} step={1000} format={(v) => money(v)} accent="amber" />
          <SliderField label="Years of experience" value={years} onChange={setYears} min={0} max={35} step={1} format={(v) => `${v}y`} />
          <div>
            <span className="text-sm font-medium mb-2 block">Tone</span>
            <Segmented options={SCRIPT_TONES} value={tone} onChange={setTone} size="sm" />
          </div>
          <StatGrid cols={2}>
            <StatCell label="Estimated gap" value={compactMoney(gap)} tone="amber" />
            <StatCell label="Below market" value={`${gapPct.toFixed(1)}%`} tone="danger" />
          </StatGrid>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow">Generated script</span>
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3.5 py-2 text-sm font-semibold hover:bg-primary/90"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            readOnly
            value={script}
            className="w-full min-h-[420px] rounded-lg border border-border bg-secondary/30 p-4 font-read text-sm leading-relaxed resize-y outline-none focus:border-primary"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Educational template, not legal advice. References to the Equal Pay Act of
            1963 and state pay-equity statutes are illustrative — verify provisions in
            your jurisdiction.
          </p>
        </div>
      </div>
    </FeaturePanel>
  )
}

/* ─────────────────────── 12 · Wealth Gap Mitigation Engine ─────────────────────── */

function WealthGapEngine() {
  const [age, setAge] = useState(30)
  const [savings, setSavings] = useState(20000)
  const [monthly, setMonthly] = useState(500)
  const [ret, setRet] = useState(6)
  const [gap, setGap] = useState(30)

  const data = useMemo(() => {
    const months = Math.max(1, (65 - age) * 12)
    const r = ret / 100 / 12
    const annuity = (Math.pow(1 + r, months) - 1) / r
    const fvCurrent = savings * Math.pow(1 + r, months)
    const yourWealth = fvCurrent + monthly * annuity
    const benchmark = yourWealth * (1 + gap / 100)
    const requiredMonthly = (benchmark - fvCurrent) / annuity
    const extraMonthly = Math.max(0, requiredMonthly - monthly)

    // Year-by-year accumulation for both paths.
    const years = 65 - age
    const series = Array.from({ length: years + 1 }, (_, y) => {
      const mo = y * 12
      const ann = mo === 0 ? 0 : (Math.pow(1 + r, mo) - 1) / r
      const fvc = savings * Math.pow(1 + r, mo)
      return {
        age: age + y,
        you: Math.round(fvc + monthly * ann),
        required: Math.round(fvc + requiredMonthly * ann),
      }
    })

    return { yourWealth, benchmark, extraMonthly, requiredMonthly, series, shortfall: benchmark - yourWealth }
  }, [age, savings, monthly, ret, gap])

  return (
    <FeaturePanel
      index="12"
      kicker="Catching up"
      title="Wealth Gap Mitigation Engine"
      blurb="A gap in pay turns into a gap in savings, and then a gap in wealth. This works out exactly how much more you'd have to put away each month to catch up by 65."
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-5">
          <SliderField label="Current age" value={age} onChange={setAge} min={20} max={60} step={1} format={(v) => `${v}`} />
          <SliderField label="Current savings" value={savings} onChange={setSavings} min={0} max={250000} step={1000} format={(v) => money(v)} />
          <SliderField label="Monthly investment" value={monthly} onChange={setMonthly} min={50} max={3000} step={50} format={(v) => money(v)} />
          <SliderField label="Expected annual return" value={ret} onChange={setRet} min={3} max={10} step={0.5} format={(v) => `${v}%`} />
          <SliderField label="Wealth gap to close" value={gap} onChange={setGap} min={5} max={60} step={1} format={(v) => `${v}%`} accent="amber" hint="The shortfall vs. a comparable male peer's projected wealth." />
        </div>
        <div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.series} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="wealthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="age" stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${v}`} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => compactMoney(v)} width={62} />
              <Tooltip content={<ChartTooltip formatter={(v) => compactMoney(v)} />} labelFormatter={(l) => `Age ${l}`} />
              <Area type="monotone" dataKey="required" name="Required path" stroke="var(--color-chart-2)" strokeWidth={2} strokeDasharray="5 4" fill="url(#wealthFill)" dot={false} />
              <Area type="monotone" dataKey="you" name="Your path" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="transparent" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-5">
            <StatGrid cols={3}>
              <StatCell label="Your wealth · 65" value={compactMoney(data.yourWealth)} tone="primary" />
              <StatCell label="Peer benchmark" value={compactMoney(data.benchmark)} sub={`${compactMoney(data.shortfall)} short`} tone="amber" />
              <StatCell label="Extra needed / month" value={money(data.extraMonthly)} sub="to close the gap by 65" tone="academic" size="lg" />
            </StatGrid>
          </div>
        </div>
      </div>
    </FeaturePanel>
  )
}

/* shared bits */
const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-sm font-medium mb-2 block">{label}</span>
      {children}
    </div>
  )
}
