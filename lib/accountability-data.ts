/**
 * Datasets for the Systemic & Institutional Accountability Matrix (Modules 5–7).
 * All figures are illustrative, rounded approximations synthesized from public
 * sources (OECD, McKinsey Power of Parity, BLS, Census, PitchBook, ILO) and are
 * pedagogical — not official statistics. Corporate names are fictional,
 * sector-representative archetypes, not real companies.
 */

// ───────────────── Module 5 · Sovereign Policy Stress-Tester ─────────────────

export const US_BASE = {
  payGap: 16, // pp
  womenLFPR: 57.4, // %
  gdpTrillions: 28.6,
  baseGrowth: 0.02, // 2%/yr real
}

export interface PolicyFramework {
  id: string
  flag: string
  country: string
  name: string
  desc: string
  gapEffect: number // pp reduction at full adoption
  lfprEffect: number // pp increase in women's LFPR
  gdpBps: number // basis points added to annual GDP growth
}

export const FRAMEWORKS: PolicyFramework[] = [
  { id: "iceland", flag: "🇮🇸", country: "Iceland", name: "Equal Pay Certification", desc: "Firms must legally certify equal pay for equal work or face fines.", gapEffect: 3.6, lfprEffect: 1.6, gdpBps: 12 },
  { id: "sweden", flag: "🇸🇪", country: "Sweden", name: "Split Parental Leave", desc: "“Use-it-or-lose-it” daddy quotas equalize caregiving.", gapEffect: 2.1, lfprEffect: 3.2, gdpBps: 18 },
  { id: "spain", flag: "🇪🇸", country: "Spain", name: "Universal Childcare", desc: "Publicly subsidized childcare from infancy.", gapEffect: 2.4, lfprEffect: 4.1, gdpBps: 24 },
  { id: "france", flag: "🇫🇷", country: "France", name: "Pay Transparency Index", desc: "Mandatory Index Égapro scoring + public disclosure.", gapEffect: 2.3, lfprEffect: 1.1, gdpBps: 10 },
  { id: "norway", flag: "🇳🇴", country: "Norway", name: "Boardroom Quota (40%)", desc: "Mandatory minimum female board representation.", gapEffect: 1.2, lfprEffect: 0.7, gdpBps: 6 },
  { id: "germany", flag: "🇩🇪", country: "Germany", name: "Bridge Part-Time Rights", desc: "Legal right to return from part-time to full-time work.", gapEffect: 1.0, lfprEffect: 1.3, gdpBps: 5 },
]

export const SOVEREIGN_HORIZON = 20

// ───────────────── Module 5 · Legislative Bill Tracker ─────────────────

export interface DemoGroup {
  id: string
  label: string
  baseGapPp: number // current pay gap, percentage points
}

export const DEMO_GROUPS: DemoGroup[] = [
  { id: "asian", label: "Asian women", baseGapPp: 10 },
  { id: "white", label: "White women", baseGapPp: 21 },
  { id: "native", label: "Native women", baseGapPp: 41 },
  { id: "black", label: "Black women", baseGapPp: 36 },
  { id: "latina", label: "Latina women", baseGapPp: 43 },
]

export const DEMO_REFERENCE_GAP = 21 // white-women gap used to scale bill effects

export interface Bill {
  id: string
  name: string
  status: string
  sponsor: string
  reductionPp: number // pp reduction applied at the reference gap
  summary: string
}

export const BILLS: Bill[] = [
  { id: "pfa", name: "Paycheck Fairness Act", status: "Passed House · stalled in Senate", sponsor: "Rep. DeLauro", reductionPp: 1.8, summary: "Bars retaliation for wage discussion and tightens the “factor other than sex” defense." },
  { id: "sta", name: "Salary Transparency Act", status: "Introduced", sponsor: "Rep. Bush", reductionPp: 2.1, summary: "Requires employers to disclose wage ranges in job postings." },
  { id: "family", name: "FAMILY Act", status: "Introduced", sponsor: "Sen. Gillibrand", reductionPp: 1.4, summary: "Creates national paid family and medical leave insurance." },
  { id: "ccwfa", name: "Child Care for Working Families Act", status: "Introduced", sponsor: "Sen. Murray", reductionPp: 1.6, summary: "Caps childcare costs at 7% of income for most families." },
  { id: "pwfa", name: "Pregnant Workers Fairness Act", status: "Enacted (2023)", sponsor: "Bipartisan", reductionPp: 0.5, summary: "Requires reasonable accommodations for pregnancy." },
]

// ───────────────── Module 6 · Algorithmic Hiring Bias Simulator ─────────────────

export interface Candidate {
  id: string
  alias: string
  resumeLine: string
  nameSignal: "feminine" | "masculine" | "neutral"
  employmentGapYears: number
  partTime: boolean
  affinitySignal: boolean // e.g. "Women in Tech" board member
}

export const HIRE_BASE_SCORE = 84

export const HIRE_PENALTIES = {
  feminineName: 8,
  perGapYear: 4,
  partTime: 6,
  affinity: 5,
}

/** Identical qualifications across every candidate — only the signals differ. */
export const CANDIDATES: Candidate[] = [
  { id: "c1", alias: "Jessica M.", resumeLine: "MBA · 8 yrs · Senior Product Manager", nameSignal: "feminine", employmentGapYears: 2, partTime: false, affinitySignal: true },
  { id: "c2", alias: "Michael R.", resumeLine: "MBA · 8 yrs · Senior Product Manager", nameSignal: "masculine", employmentGapYears: 0, partTime: false, affinitySignal: false },
  { id: "c3", alias: "J. Martin", resumeLine: "MBA · 8 yrs · Senior Product Manager", nameSignal: "neutral", employmentGapYears: 2, partTime: true, affinitySignal: false },
  { id: "c4", alias: "Aaliyah W.", resumeLine: "MBA · 8 yrs · Senior Product Manager", nameSignal: "feminine", employmentGapYears: 1, partTime: true, affinitySignal: true },
]

// ───────────────── Module 6 · Corporate Wage-Gap Ledger ─────────────────

export interface CompanyRow {
  id: string
  company: string
  sector: string
  revenueB: number
  womenLeadershipPct: number
  payGapPct: number
  transparencyScore: number
}

export const LEDGER: CompanyRow[] = [
  { id: "l1", company: "Northwind Technologies", sector: "Technology", revenueB: 84, womenLeadershipPct: 19, payGapPct: 22, transparencyScore: 41 },
  { id: "l2", company: "Helix Compute", sector: "Technology", revenueB: 52, womenLeadershipPct: 31, payGapPct: 14, transparencyScore: 68 },
  { id: "l3", company: "Vertex Capital Group", sector: "Finance", revenueB: 39, womenLeadershipPct: 17, payGapPct: 28, transparencyScore: 33 },
  { id: "l4", company: "Meridian Bank", sector: "Finance", revenueB: 61, womenLeadershipPct: 24, payGapPct: 24, transparencyScore: 52 },
  { id: "l5", company: "Cedar Health Systems", sector: "Healthcare", revenueB: 47, womenLeadershipPct: 44, payGapPct: 12, transparencyScore: 71 },
  { id: "l6", company: "Auralia Pharma", sector: "Healthcare", revenueB: 33, womenLeadershipPct: 38, payGapPct: 16, transparencyScore: 63 },
  { id: "l7", company: "Brightline Retail", sector: "Retail", revenueB: 72, womenLeadershipPct: 29, payGapPct: 18, transparencyScore: 58 },
  { id: "l8", company: "Harbor & Co.", sector: "Retail", revenueB: 21, womenLeadershipPct: 35, payGapPct: 15, transparencyScore: 60 },
  { id: "l9", company: "Apex Energy", sector: "Energy", revenueB: 95, womenLeadershipPct: 12, payGapPct: 31, transparencyScore: 28 },
  { id: "l10", company: "Solstice Power", sector: "Energy", revenueB: 44, womenLeadershipPct: 21, payGapPct: 23, transparencyScore: 49 },
  { id: "l11", company: "Beacon Media", sector: "Media", revenueB: 18, womenLeadershipPct: 41, payGapPct: 13, transparencyScore: 66 },
  { id: "l12", company: "Cipher Studios", sector: "Media", revenueB: 12, womenLeadershipPct: 33, payGapPct: 17, transparencyScore: 55 },
  { id: "l13", company: "Forge Manufacturing", sector: "Manufacturing", revenueB: 58, womenLeadershipPct: 14, payGapPct: 27, transparencyScore: 35 },
  { id: "l14", company: "Atlas Industrial", sector: "Manufacturing", revenueB: 67, womenLeadershipPct: 16, payGapPct: 25, transparencyScore: 38 },
  { id: "l15", company: "Verdant Foods", sector: "Consumer", revenueB: 41, womenLeadershipPct: 37, payGapPct: 14, transparencyScore: 62 },
  { id: "l16", company: "Lumen Consumer", sector: "Consumer", revenueB: 29, womenLeadershipPct: 42, payGapPct: 11, transparencyScore: 73 },
  { id: "l17", company: "Quantum Soft", sector: "Technology", revenueB: 110, womenLeadershipPct: 23, payGapPct: 20, transparencyScore: 47 },
  { id: "l18", company: "Sterling Wealth", sector: "Finance", revenueB: 26, womenLeadershipPct: 15, payGapPct: 30, transparencyScore: 30 },
  { id: "l19", company: "Willowbrook Care", sector: "Healthcare", revenueB: 22, womenLeadershipPct: 49, payGapPct: 9, transparencyScore: 77 },
  { id: "l20", company: "Pinnacle Stores", sector: "Retail", revenueB: 88, womenLeadershipPct: 26, payGapPct: 19, transparencyScore: 53 },
  { id: "l21", company: "Granite Petroleum", sector: "Energy", revenueB: 124, womenLeadershipPct: 10, payGapPct: 33, transparencyScore: 24 },
  { id: "l22", company: "Echo Networks", sector: "Media", revenueB: 35, womenLeadershipPct: 38, payGapPct: 15, transparencyScore: 59 },
  { id: "l23", company: "Titan Works", sector: "Manufacturing", revenueB: 49, womenLeadershipPct: 18, payGapPct: 24, transparencyScore: 40 },
  { id: "l24", company: "Hearth & Home", sector: "Consumer", revenueB: 33, womenLeadershipPct: 45, payGapPct: 12, transparencyScore: 69 },
  { id: "l25", company: "Nimbus Cloud", sector: "Technology", revenueB: 64, womenLeadershipPct: 28, payGapPct: 17, transparencyScore: 64 },
  { id: "l26", company: "Coastal Mutual", sector: "Finance", revenueB: 53, womenLeadershipPct: 27, payGapPct: 21, transparencyScore: 51 },
]

// ───────────────── Module 7 · Wealth Equity Radar ─────────────────

export const RADAR_VECTORS = [
  "Wage Equality",
  "Leadership Access",
  "Care Infrastructure",
  "Venture Funding",
  "Retirement Security",
] as const

export interface RadarProfile {
  id: string
  label: string
  color: string
  /** Values 0–100 per vector (100 = parity with the highest-resourced group). */
  values: number[]
}

export const RADAR_PROFILES: RadarProfile[] = [
  { id: "men", label: "Men (baseline)", color: "var(--color-chart-1)", values: [100, 100, 100, 100, 100] },
  { id: "white", label: "White women", color: "var(--color-chart-3)", values: [79, 60, 55, 35, 70] },
  { id: "asian", label: "Asian women", color: "var(--color-chart-5)", values: [90, 55, 60, 30, 75] },
  { id: "black", label: "Black women", color: "var(--color-chart-4)", values: [64, 42, 48, 12, 52] },
  { id: "latina", label: "Latina women", color: "var(--color-chart-2)", values: [57, 38, 45, 14, 48] },
  { id: "disability", label: "Women w/ disability", color: "#8b5cf6", values: [68, 34, 40, 10, 45] },
]

// ───────────────── Module 7 · Generational Wealth Deficit Clock ─────────────────

/** Illustrative global annual wealth deficit borne by women (USD). */
export const DEFICIT_ANNUAL_USD = 12_000_000_000_000 // ~$12T
export const DEFICIT_EPOCH_LABEL = "since Jan 1 this year"
