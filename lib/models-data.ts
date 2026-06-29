/**
 * Datasets and coefficients for the interactive econometric models.
 *
 * Every figure here is an illustrative, rounded approximation synthesized from
 * public research (BLS, U.S. Census Bureau, OECD, NYC DCA "From Cradle to Cane"
 * 2015 pink-tax study, and the labor-economics literature on parental-leave
 * design). They are calibrated to be directionally faithful and pedagogically
 * useful — not official statistics. See /methodology.
 */

// ───────────────────────── Policy Simulator ─────────────────────────

export const POLICY_BASE_GAP = 16.0 // current uncontrolled gender pay gap (pp)
export const POLICY_RESIDUAL_FLOOR = 2.5 // structural residual the levers can't erase
export const POLICY_HORIZON_YEARS = 10

export interface PolicyLever {
  id: "leave" | "transparency" | "childcare" | "flex"
  label: string
  unit: string
  min: number
  max: number
  step: number
  default: number
  /** Max long-run reduction (pp) this lever can contribute at full strength. */
  maxEffect: number
  blurb: string
}

export const POLICY_LEVERS: PolicyLever[] = [
  {
    id: "leave",
    label: "Paid Parental Leave",
    unit: "weeks",
    min: 0,
    max: 52,
    step: 1,
    default: 12,
    maxEffect: 2.6,
    blurb:
      "Modeled as an inverted-U: moderate, well-paid leave narrows the gap, but very long leave (>30 wks) can entrench career interruptions and erode the benefit.",
  },
  {
    id: "transparency",
    label: "Wage Transparency Mandate",
    unit: "% intensity",
    min: 0,
    max: 100,
    step: 5,
    default: 30,
    maxEffect: 3.0,
    blurb:
      "Pay-range disclosure and reporting requirements compress unexplained within-firm gaps. Strong, near-linear effect.",
  },
  {
    id: "childcare",
    label: "Subsidized Childcare",
    unit: "% coverage",
    min: 0,
    max: 100,
    step: 5,
    default: 25,
    maxEffect: 4.2,
    blurb:
      "Lowering the price of care raises maternal labor-force participation and continuity — the single largest lever in the model.",
  },
  {
    id: "flex",
    label: "Flexible-Work Protections",
    unit: "% coverage",
    min: 0,
    max: 100,
    step: 5,
    default: 20,
    maxEffect: 2.0,
    blurb:
      "Right-to-flexible-hours reduces the wage premium on 'greedy' inflexible work that disproportionately penalizes caregivers.",
  },
]

/** Inverted-U response for parental leave, peaking near 28 weeks. */
export function leaveResponse(weeks: number, maxEffect: number): number {
  const peak = 28
  const spread = 30
  const shape = 1 - Math.pow((weeks - peak) / spread, 2)
  return Math.max(0, maxEffect * shape)
}

// ─────────────────── Intersectional Cross-Examiner ───────────────────

export type Lens = "race" | "education" | "region"

export interface IntersectRow {
  category: string
  /** Median annual earnings, $K, illustrative. */
  men: number
  women: number
}

export interface LensData {
  id: Lens
  label: string
  caption: string
  /** Reference group used to compute "cents on the dollar" compounding. */
  referenceValue: number
  referenceLabel: string
  rows: IntersectRow[]
}

export const LENSES: LensData[] = [
  {
    id: "race",
    label: "Gender × Race / Ethnicity",
    caption:
      "Median earnings by race and gender. The compounding penalty is sharpest for Black and Hispanic women, measured against the highest-earning male group.",
    referenceValue: 86,
    referenceLabel: "Asian men",
    rows: [
      { category: "Asian", men: 86, women: 70 },
      { category: "White", men: 72, women: 57 },
      { category: "Black", men: 53, women: 46 },
      { category: "Hispanic", men: 48, women: 39 },
    ],
  },
  {
    id: "education",
    label: "Gender × Education",
    caption:
      "Earnings rise with education for everyone — but the absolute gender gap widens at higher degrees, where 'greedy work' premia concentrate.",
    referenceValue: 130,
    referenceLabel: "Advanced-degree men",
    rows: [
      { category: "< High school", men: 38, women: 28 },
      { category: "High school", men: 52, women: 38 },
      { category: "Some college", men: 62, women: 45 },
      { category: "Bachelor's", men: 95, women: 68 },
      { category: "Advanced", men: 130, women: 92 },
    ],
  },
  {
    id: "region",
    label: "Gender × Region",
    caption:
      "Median earnings by U.S. census region. Even where pay is highest, the within-region gap persists — geography shifts the level, not the gap.",
    referenceValue: 84,
    referenceLabel: "Northeast men",
    rows: [
      { category: "Northeast", men: 84, women: 68 },
      { category: "West", men: 80, women: 65 },
      { category: "Midwest", men: 70, women: 54 },
      { category: "South", men: 66, women: 50 },
    ],
  },
]

// ───────────────────────── Pink Tax Indexer ─────────────────────────

export interface PinkTaxCategory {
  id: string
  label: string
  /** Average markup on the women's version vs. the equivalent men's version. */
  markup: number
  defaultMonthly: number
  note: string
}

export const PINK_TAX_CATEGORIES: PinkTaxCategory[] = [
  {
    id: "personal-care",
    label: "Personal Care",
    markup: 0.13,
    defaultMonthly: 60,
    note: "Razors, deodorant, body wash, shampoo — +13% on average (NYC DCA, 2015).",
  },
  {
    id: "apparel",
    label: "Apparel",
    markup: 0.08,
    defaultMonthly: 90,
    note: "Adult clothing — women's items averaged +8%.",
  },
  {
    id: "accessories",
    label: "Accessories",
    markup: 0.07,
    defaultMonthly: 25,
    note: "Bags, belts, watches — +7%.",
  },
  {
    id: "services",
    label: "Services",
    markup: 0.15,
    defaultMonthly: 70,
    note: "Haircuts, dry cleaning, alterations — frequently +15% or more.",
  },
  {
    id: "kids",
    label: "Children's Goods",
    markup: 0.07,
    defaultMonthly: 40,
    note: "Toys and children's apparel marketed to girls — +7%.",
  },
]

export const PINK_TAX_INVEST_RATE = 0.06 // for the "if invested" lifetime projection

// ─────────────────── Shadow Economy Invoice ───────────────────

export interface CareCategory {
  id: string
  label: string
  /** National replacement (market) wage, $/hr. */
  baseRate: number
  defaultHours: number
  mappedRole: string
}

export const CARE_CATEGORIES: CareCategory[] = [
  {
    id: "domestic",
    label: "Domestic Labor",
    baseRate: 18,
    defaultHours: 14,
    mappedRole: "Housekeeper / cook",
  },
  {
    id: "childcare",
    label: "Childcare & Caregiving",
    baseRate: 17,
    defaultHours: 21,
    mappedRole: "Childcare provider",
  },
  {
    id: "eldercare",
    label: "Eldercare",
    baseRate: 16,
    defaultHours: 6,
    mappedRole: "Home health aide",
  },
  {
    id: "mental-load",
    label: "Mental Load & Coordination",
    baseRate: 28,
    defaultHours: 10,
    mappedRole: "Household manager / PA",
  },
]

export interface CareRegion {
  id: string
  label: string
  multiplier: number
}

export const CARE_REGIONS: CareRegion[] = [
  { id: "national", label: "U.S. National Average", multiplier: 1.0 },
  { id: "high-metro", label: "High-cost metro (NYC / SF / Boston)", multiplier: 1.38 },
  { id: "mid-metro", label: "Mid-size metro", multiplier: 1.12 },
  { id: "rural", label: "Rural / low-cost", multiplier: 0.82 },
  { id: "intl-eu", label: "Western Europe", multiplier: 1.05 },
]
