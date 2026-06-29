/**
 * EquiNomics data layer.
 *
 * Two kinds of evidence sit side by side here, mirroring the platform's thesis:
 *  1. MACRO INDICATORS — quantitative labor-economics series, each with a public source.
 *  2. CASE STUDIES — qualitative "data points": lived experiences annotated with the
 *     economic theory that explains them.
 *
 * All macro figures are approximate, rounded values drawn from public datasets
 * (BLS, U.S. Census Bureau, OECD, BLS American Time Use Survey, peer-reviewed
 * labor economics) and are intended as illustrative reference points, not official
 * statistics. See /methodology for full sourcing notes.
 */

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

export const SECTORS = [
  "STEM & Technology",
  "Corporate & Finance",
  "Healthcare",
  "Service & Hospitality",
  "Education & Academia",
  "Care Economy",
  "Public Sector",
  "Creative & Media",
  "Trades & Manufacturing",
] as const
export type Sector = (typeof SECTORS)[number]

export const PHENOMENA = [
  "#MotherhoodPenalty",
  "#OccupationalSegregation",
  "#UnpaidLaborValue",
  "#GlassCeiling",
  "#WageElasticity",
  "#NegotiationGap",
  "#CareEconomy",
  "#SecondShift",
  "#PromotionGap",
  "#GenderWealthGap",
] as const
export type Phenomenon = (typeof PHENOMENA)[number]

export type SeniorityLevel =
  | "Entry-level"
  | "Mid-career"
  | "Senior"
  | "Executive"
  | "Self-employed"

export type CaregivingStatus =
  | "No dependents"
  | "Primary caregiver"
  | "Shared caregiving"
  | "Eldercare provider"

export interface DemographicIndicators {
  seniority: SeniorityLevel
  yearsExperience: number
  caregiving: CaregivingStatus
  region: string
  firstGenProfessional: boolean
}

// ---------------------------------------------------------------------------
// Macro indicators
// ---------------------------------------------------------------------------

export interface MacroIndicator {
  id: string
  label: string
  value: string
  /** Numeric value used for animated count-up; unit drives formatting. */
  numeric: number
  unit: "percent" | "cents" | "currency" | "ratio" | "hours" | "index"
  delta?: string
  deltaDirection?: "up" | "down" | "flat"
  context: string
  source: string
  phenomenon: Phenomenon
}

export const MACRO_INDICATORS: MacroIndicator[] = [
  {
    id: "pay-gap",
    label: "Gender Pay Gap (median, full-time)",
    value: "16%",
    numeric: 16,
    unit: "percent",
    delta: "−0.4pp YoY",
    deltaDirection: "down",
    context:
      "Median earnings for women working full-time, year-round are roughly 84¢ for every $1 earned by men — an uncontrolled gap that widens for mothers and women of color.",
    source: "U.S. Census Bureau, Current Population Survey (approx.)",
    phenomenon: "#GenderWealthGap",
  },
  {
    id: "lfpr",
    label: "Women's Labor Force Participation",
    value: "57.4%",
    numeric: 57.4,
    unit: "percent",
    delta: "+0.6pp YoY",
    deltaDirection: "up",
    context:
      "The share of working-age women employed or seeking work. It sits well below men's (~68%), a gap shaped heavily by caregiving responsibilities and the structure of paid leave.",
    source: "BLS, Current Population Survey (approx.)",
    phenomenon: "#CareEconomy",
  },
  {
    id: "motherhood-penalty",
    label: "Motherhood Wage Penalty",
    value: "−4%",
    numeric: 4,
    unit: "percent",
    delta: "per child",
    deltaDirection: "down",
    context:
      "Mothers experience a wage penalty of roughly 4% per child, while fathers often see a 'fatherhood bonus.' Long-run earnings divergence after a first birth can exceed 20%.",
    source: "Budig & England (2001); Kleven et al. (2019)",
    phenomenon: "#MotherhoodPenalty",
  },
  {
    id: "unpaid-care",
    label: "Daily Unpaid Care Hours (women)",
    value: "4.2 hrs",
    numeric: 4.2,
    unit: "hours",
    delta: "vs 2.6 hrs (men)",
    deltaDirection: "up",
    context:
      "Women perform substantially more unpaid household and care labor each day. Valued at replacement wages, this 'invisible' output rivals entire industrial sectors of GDP.",
    source: "BLS American Time Use Survey (approx.)",
    phenomenon: "#UnpaidLaborValue",
  },
  {
    id: "wealth-gap",
    label: "Gender Wealth Gap",
    value: "32¢",
    numeric: 32,
    unit: "cents",
    delta: "per $1 of wealth",
    deltaDirection: "down",
    context:
      "Beyond wages, accumulated wealth diverges sharply: single women hold a fraction of the net worth of single men, compounding through retirement via lower lifetime contributions.",
    source: "Federal Reserve SCF analyses (approx.)",
    phenomenon: "#GenderWealthGap",
  },
  {
    id: "leadership",
    label: "Women in Fortune 500 CEO Roles",
    value: "10.4%",
    numeric: 10.4,
    unit: "percent",
    delta: "+1.2pp YoY",
    deltaDirection: "up",
    context:
      "Representation thins dramatically up the seniority ladder — the 'leaky pipeline.' The first rung from analyst to manager is where the largest attrition occurs.",
    source: "Fortune; LeanIn/McKinsey Women in the Workplace (approx.)",
    phenomenon: "#GlassCeiling",
  },
  {
    id: "segregation",
    label: "Occupational Segregation Index",
    value: "0.51",
    numeric: 0.51,
    unit: "index",
    delta: "Duncan dissimilarity",
    deltaDirection: "flat",
    context:
      "Roughly half of all workers would need to change occupations to achieve an even gender distribution. Female-dominated fields systematically command lower wages.",
    source: "Duncan & Duncan dissimilarity, ACS occupation data (approx.)",
    phenomenon: "#OccupationalSegregation",
  },
  {
    id: "retirement",
    label: "Gender Retirement Income Gap",
    value: "30%",
    numeric: 30,
    unit: "percent",
    delta: "lower pensions",
    deltaDirection: "down",
    context:
      "Lower lifetime earnings and career interruptions translate into materially smaller retirement balances — the wage gap's final, compounding act.",
    source: "OECD Pensions at a Glance (approx.)",
    phenomenon: "#GenderWealthGap",
  },
]

// Time series for the dashboard's headline chart: pay gap narrowing over decades.
export interface SeriesPoint {
  year: number
  payGapCents: number // women's earnings per $1 men's, in cents
  lfprWomen: number
  lfprMen: number
}

export const PAY_GAP_SERIES: SeriesPoint[] = [
  { year: 1980, payGapCents: 60, lfprWomen: 51.5, lfprMen: 77.4 },
  { year: 1985, payGapCents: 65, lfprWomen: 54.5, lfprMen: 76.3 },
  { year: 1990, payGapCents: 72, lfprWomen: 57.5, lfprMen: 76.4 },
  { year: 1995, payGapCents: 75, lfprWomen: 58.9, lfprMen: 75.0 },
  { year: 2000, payGapCents: 77, lfprWomen: 59.9, lfprMen: 74.8 },
  { year: 2005, payGapCents: 78, lfprWomen: 59.3, lfprMen: 73.3 },
  { year: 2010, payGapCents: 80, lfprWomen: 58.6, lfprMen: 71.2 },
  { year: 2015, payGapCents: 81, lfprWomen: 56.7, lfprMen: 69.1 },
  { year: 2020, payGapCents: 82, lfprWomen: 55.8, lfprMen: 67.7 },
  { year: 2024, payGapCents: 84, lfprWomen: 57.4, lfprMen: 68.0 },
]

// Wage by occupation feminization — illustrates occupational segregation.
export interface OccupationPoint {
  occupation: string
  pctWomen: number
  medianWage: number
}

export const OCCUPATION_WAGE_DATA: OccupationPoint[] = [
  { occupation: "Childcare workers", pctWomen: 93, medianWage: 30 },
  { occupation: "Registered nurses", pctWomen: 87, medianWage: 81 },
  { occupation: "Elementary teachers", pctWomen: 79, medianWage: 61 },
  { occupation: "Social workers", pctWomen: 82, medianWage: 55 },
  { occupation: "Accountants", pctWomen: 58, medianWage: 78 },
  { occupation: "Physicians", pctWomen: 44, medianWage: 229 },
  { occupation: "Lawyers", pctWomen: 39, medianWage: 145 },
  { occupation: "Software developers", pctWomen: 22, medianWage: 132 },
  { occupation: "Civil engineers", pctWomen: 16, medianWage: 95 },
  { occupation: "Construction trades", pctWomen: 4, medianWage: 58 },
]

// ---------------------------------------------------------------------------
// Economic theory glossary — surfaced as sidebar footnotes
// ---------------------------------------------------------------------------

export interface EconomicConcept {
  term: string
  definition: string
  theorist?: string
}

export const GLOSSARY: Record<string, EconomicConcept> = {
  humanCapital: {
    term: "Human Capital",
    definition:
      "The stock of skills, education, and experience embodied in a worker. Career interruptions for caregiving cause human-capital depreciation that markets reward unevenly by gender.",
    theorist: "Gary Becker, Jacob Mincer",
  },
  occupationalSegregation: {
    term: "Occupational Segregation",
    definition:
      "The systematic sorting of genders into different occupations. Crucially, the wages of 'female' occupations tend to fall as they feminize — the work is devalued, not merely differently chosen.",
    theorist: "Paula England",
  },
  monopsony: {
    term: "Monopsony Power",
    definition:
      "When employers face little competition for labor, they can set wages below a worker's marginal product. Women's lower geographic mobility (often tied to a partner's career) raises their exposure to monopsony.",
    theorist: "Joan Robinson",
  },
  wageElasticity: {
    term: "Wage Elasticity of Labor Supply",
    definition:
      "How responsive hours worked are to wage changes. Caregiving constraints lower women's elasticity at key margins, weakening bargaining position and depressing realized wages.",
  },
  compensatingDifferentials: {
    term: "Compensating Differentials & Greedy Work",
    definition:
      "Jobs that reward long, inflexible, unpredictable hours pay a disproportionate premium. Because caregiving falls more on women, they trade into flexibility and forgo this 'greedy work' premium.",
    theorist: "Claudia Goldin",
  },
  careEconomy: {
    term: "The Care Economy",
    definition:
      "The vast sphere of paid and unpaid caregiving labor. Unpaid care is excluded from GDP despite being a precondition for all market production — an accounting choice with deep distributional consequences.",
    theorist: "Nancy Folbre, Marilyn Waring",
  },
  statisticalDiscrimination: {
    term: "Statistical Discrimination",
    definition:
      "When employers use group averages (e.g., assumptions about caregiving) as a proxy for individual productivity, penalizing individuals for the presumed behavior of their demographic.",
    theorist: "Kenneth Arrow, Edmund Phelps",
  },
  secondShift: {
    term: "The Second Shift",
    definition:
      "The unpaid domestic and emotional labor performed after the paid workday. It constitutes a parallel, uncompensated workweek that constrains paid-market investment.",
    theorist: "Arlie Hochschild",
  },
}

// ---------------------------------------------------------------------------
// Case studies (qualitative data points)
// ---------------------------------------------------------------------------

export interface EconomicAnnotation {
  /** The phrase in the narrative this footnote is anchored to. */
  anchor: string
  /** Glossary key for the underlying concept. */
  conceptKey: keyof typeof GLOSSARY
  note: string
}

export interface CaseStudy {
  slug: string
  pseudonym: string
  headline: string
  sector: Sector
  phenomena: Phenomenon[]
  demographics: DemographicIndicators
  /** Self-estimated cumulative opportunity cost, USD. */
  estimatedLostWages: number
  structuralBarriers: string[]
  summary: string
  /** Full narrative, paragraphs. */
  narrative: string[]
  annotations: EconomicAnnotation[]
  keyStat: { value: string; label: string }
  /** ISO date the data point entered the archive. */
  contributedAt: string
  /** True for user-submitted entries merged from localStorage at runtime. */
  userContributed?: boolean
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "the-flexibility-tax",
    pseudonym: "Dr. A.",
    headline: "The pediatrician who priced her own flexibility",
    sector: "Healthcare",
    phenomena: ["#MotherhoodPenalty", "#WageElasticity", "#CareEconomy"],
    demographics: {
      seniority: "Senior",
      yearsExperience: 14,
      caregiving: "Primary caregiver",
      region: "Midwest, USA",
      firstGenProfessional: true,
    },
    estimatedLostWages: 410000,
    structuralBarriers: [
      "No employer-paid parental leave",
      "On-call schedules incompatible with childcare",
      "Partner-track required relocation",
    ],
    summary:
      "After her second child, a physician moved from hospital medicine to a salaried clinic for predictable hours — and watched her earnings trajectory bend permanently downward.",
    narrative: [
      "I finished residency at the top of my cohort. For three years I worked the hospitalist rotation — nights, weekends, the unpredictable shifts that paid the most. I was, by any measure, ambitious.",
      "Then my daughter arrived, and eighteen months later, my son. There was no paid leave; I stitched together vacation days and unpaid weeks. When I returned, the on-call schedule simply did not fit a household with two children under three and a partner whose own career required us to stay in this city.",
      "So I made what everyone called a 'reasonable choice.' I moved to an outpatient clinic with fixed hours. The work is meaningful. But the salary is structured around predictability, and predictability, it turns out, is expensive. The colleagues who kept the punishing schedule out-earn me now by a margin that compounds every year.",
      "I didn't leave medicine. I didn't lean out. I bought flexibility at a price no one ever quoted me up front — and I am still paying it.",
    ],
    annotations: [
      {
        anchor: "the unpredictable shifts that paid the most",
        conceptKey: "compensatingDifferentials",
        note: "Goldin's 'greedy work': roles demanding long, inflexible, unpredictable hours pay a convex premium. Stepping off that schedule forfeits the premium disproportionately.",
      },
      {
        anchor: "predictability, it turns out, is expensive",
        conceptKey: "wageElasticity",
        note: "Caregiving constraints reduce a worker's labor-supply elasticity at the most lucrative margins, weakening bargaining position even absent any drop in skill.",
      },
      {
        anchor: "a price no one ever quoted me",
        conceptKey: "careEconomy",
        note: "The cost of care is borne privately and individually, externalized off the employer's and the state's balance sheet onto the (usually female) caregiver.",
      },
    ],
    keyStat: { value: "$410K", label: "Estimated lifetime opportunity cost" },
    contributedAt: "2026-02-11",
  },
  {
    slug: "coded-out",
    pseudonym: "Priya N.",
    headline: "The engineer who was 'a culture fit' problem",
    sector: "STEM & Technology",
    phenomena: ["#OccupationalSegregation", "#PromotionGap", "#NegotiationGap"],
    demographics: {
      seniority: "Mid-career",
      yearsExperience: 9,
      caregiving: "No dependents",
      region: "West Coast, USA",
      firstGenProfessional: true,
    },
    estimatedLostWages: 220000,
    structuralBarriers: [
      "Opaque pay bands",
      "Promotion gated on self-nomination",
      "Sole woman on a 12-person team",
    ],
    summary:
      "A senior software engineer discovered that the 'meritocratic' promotion process rewarded confident self-advocacy as much as code — a skill she had been socialized to suppress.",
    narrative: [
      "I write the same code as the men on my team. Better, by the review metrics we all pretend are objective. But promotions here run on self-nomination: you write a document arguing for your own greatness, and a committee of mostly-senior-men decides if you were convincing.",
      "The first cycle, I waited to be noticed. That is, I now understand, an economically irrational strategy in a market that prices confidence. I was passed over for a man I had mentored.",
      "When I finally did negotiate, I was told I was 'aggressive' — a word that has a gender, even if no one will admit it. The offer barely moved. My manager genuinely believed he was being fair. The bias wasn't in any one decision; it was in the architecture of how decisions got made.",
      "I'm still here. I'm good at this. But I've stopped believing the pipeline leaks by accident.",
    ],
    annotations: [
      {
        anchor: "the architecture of how decisions got made",
        conceptKey: "statisticalDiscrimination",
        note: "When evaluation rewards traits unevenly distributed by socialization (self-promotion), neutral-looking processes encode systematic bias without any single discriminatory actor.",
      },
      {
        anchor: "a market that prices confidence",
        conceptKey: "occupationalSegregation",
        note: "Within-occupation sorting: even inside a 'good' field, women cluster on lower rungs when advancement depends on stereotypically-male behaviors.",
      },
      {
        anchor: "the pipeline leaks by accident",
        conceptKey: "humanCapital",
        note: "Identical human capital yields divergent returns — evidence the gap is in the demand side (employer valuation), not the supply side (worker skill).",
      },
    ],
    keyStat: { value: "22%", label: "Pay below male peers at hire" },
    contributedAt: "2026-03-02",
  },
  {
    slug: "the-invisible-shift",
    pseudonym: "Marisol R.",
    headline: "The home health aide subsidizing the economy with her own time",
    sector: "Care Economy",
    phenomena: ["#UnpaidLaborValue", "#CareEconomy", "#SecondShift"],
    demographics: {
      seniority: "Entry-level",
      yearsExperience: 6,
      caregiving: "Eldercare provider",
      region: "Southwest, USA",
      firstGenProfessional: true,
    },
    estimatedLostWages: 95000,
    structuralBarriers: [
      "Sub-living wages in care work",
      "No benefits or overtime protection",
      "Unpaid caregiving for own parent",
    ],
    summary:
      "She is paid to care for strangers by day and cares for her mother for free by night — two shifts of the same essential labor, only one of which the economy counts.",
    narrative: [
      "By day I'm paid $16 an hour to bathe, feed, and comfort other people's parents. It is skilled work — I notice the stroke before the family does — but it is priced as if anyone could do it.",
      "By night I do the identical work for my own mother, and for that the economy pays me nothing. Same hands. Same skill. Same exhaustion. One shift shows up in GDP; the other is invisible.",
      "People say care work 'isn't productive.' I would like to see the productive economy run for a single week if every one of us stopped. The whole edifice rests on hours that no ledger records.",
      "I'm not asking for a medal. I'm asking why the most necessary labor in the world is the cheapest — and why it is almost always us doing it.",
    ],
    annotations: [
      {
        anchor: "priced as if anyone could do it",
        conceptKey: "occupationalSegregation",
        note: "The devaluation thesis: as occupations feminize, their wages fall relative to skill content — care work is the archetypal case.",
      },
      {
        anchor: "One shift shows up in GDP; the other is invisible",
        conceptKey: "careEconomy",
        note: "National accounts exclude unpaid household production. Valued at replacement cost, it would add an estimated 15–25% to GDP — overwhelmingly female output.",
      },
      {
        anchor: "hours that no ledger records",
        conceptKey: "secondShift",
        note: "Hochschild's second shift: unpaid domestic labor forms a parallel workweek that constrains paid-market participation and savings.",
      },
    ],
    keyStat: { value: "$0/hr", label: "Wage for identical night-shift care" },
    contributedAt: "2026-01-28",
  },
  {
    slug: "the-glass-cliff",
    pseudonym: "Eleanor V.",
    headline: "The executive handed the wheel only after the crash",
    sector: "Corporate & Finance",
    phenomena: ["#GlassCeiling", "#PromotionGap"],
    demographics: {
      seniority: "Executive",
      yearsExperience: 22,
      caregiving: "Shared caregiving",
      region: "Northeast, USA",
      firstGenProfessional: false,
    },
    estimatedLostWages: 1200000,
    structuralBarriers: [
      "Promoted only into high-risk turnaround roles",
      "Smaller equity grants than male peers",
      "Excluded from informal deal networks",
    ],
    summary:
      "She finally broke into the C-suite — to run a division already in freefall, a pattern researchers call the 'glass cliff.'",
    narrative: [
      "It took twenty-two years to be handed a division to run. I noticed, eventually, that I was only ever offered the divisions that were already failing. Give the woman the turnaround; if she saves it, lucky us, and if she doesn't, well, it was doomed anyway.",
      "My equity grant was two-thirds of what my predecessor received. I found this out by accident, the way women always find these things out — a slipped sentence at a dinner, a number left on a printer.",
      "The real currency at that level isn't salary; it's the deals that get done on the golf course and in the group chats I was never in. You cannot negotiate for access to a room you don't know exists.",
      "I turned the division around, by the way. The reward was being asked to do it again, for another broken unit, at the same discount.",
    ],
    annotations: [
      {
        anchor: "only ever offered the divisions that were already failing",
        conceptKey: "statisticalDiscrimination",
        note: "The 'glass cliff': women's leadership appointments cluster in periods of crisis, raising their baseline risk of visible failure and shortening tenure.",
      },
      {
        anchor: "the deals that get done on the golf course",
        conceptKey: "monopsony",
        note: "Network closure functions like monopsony — restricting access to opportunity lets incumbents capture rents and suppress outsiders' effective wages.",
      },
      {
        anchor: "two-thirds of what my predecessor received",
        conceptKey: "humanCapital",
        note: "Pay opacity prevents the market from correcting identical-human-capital gaps; information asymmetry is itself a mechanism of inequality.",
      },
    ],
    keyStat: { value: "−33%", label: "Equity grant vs. male predecessor" },
    contributedAt: "2026-02-19",
  },
  {
    slug: "tenure-and-the-clock",
    pseudonym: "Dr. H.",
    headline: "When the tenure clock and the biological clock collide",
    sector: "Education & Academia",
    phenomena: ["#MotherhoodPenalty", "#SecondShift", "#CareEconomy"],
    demographics: {
      seniority: "Mid-career",
      yearsExperience: 11,
      caregiving: "Primary caregiver",
      region: "Pacific Northwest, USA",
      firstGenProfessional: true,
    },
    estimatedLostWages: 180000,
    structuralBarriers: [
      "Tenure timeline overlaps peak childbearing years",
      "Service and mentoring load fell disproportionately on her",
      "Conference travel incompatible with infant care",
    ],
    summary:
      "An assistant professor watched the seven-year tenure window — engineered decades ago around a male life course — quietly penalize the years she spent raising a newborn.",
    narrative: [
      "The tenure clock was designed in an era when the professor had a wife at home managing everything else. I am that wife, and also the professor.",
      "My most productive research years were supposed to coincide exactly with my children's infancy. Papers don't write themselves at 3 a.m. feedings, though I tried.",
      "I also absorbed the 'institutional housekeeping' — the mentoring, the committees, the emotional labor of the department — work that is essential, expected of women, and counts for almost nothing at review time.",
      "I got tenure. Two of the men hired alongside me got it faster, with lighter service loads and partners who handled the second shift. The clock measured us identically. Our lives were not identical.",
    ],
    annotations: [
      {
        anchor: "the years she spent raising a newborn",
        conceptKey: "compensatingDifferentials",
        note: "Fixed up-or-out timelines penalize any career interruption convexly. Where interruptions are gendered, ostensibly neutral clocks produce gendered outcomes.",
      },
      {
        anchor: "counts for almost nothing at review time",
        conceptKey: "secondShift",
        note: "A workplace 'second shift' of uncompensated service labor (mentoring, committees) falls disproportionately on women and diverts time from rewarded output.",
      },
      {
        anchor: "Our lives were not identical",
        conceptKey: "careEconomy",
        note: "Treating unequal caregiving loads as equal at evaluation is a category error that launders structural inequality as individual merit.",
      },
    ],
    keyStat: { value: "1.4 yrs", label: "Slower to tenure than male cohort" },
    contributedAt: "2026-03-15",
  },
  {
    slug: "the-tipped-wage",
    pseudonym: "Dana K.",
    headline: "The server whose wage depended on a smile",
    sector: "Service & Hospitality",
    phenomena: ["#OccupationalSegregation", "#WageElasticity", "#NegotiationGap"],
    demographics: {
      seniority: "Entry-level",
      yearsExperience: 5,
      caregiving: "Shared caregiving",
      region: "Southeast, USA",
      firstGenProfessional: true,
    },
    estimatedLostWages: 62000,
    structuralBarriers: [
      "Sub-minimum tipped wage",
      "Income contingent on customer goodwill and tolerance of harassment",
      "Unpredictable scheduling ('clopening')",
    ],
    summary:
      "On a $2.13 tipped base wage, her real income was set not by the menu but by how much harassment she would absorb with a smile.",
    narrative: [
      "My base wage is $2.13 an hour. The rest — the part I actually live on — comes from tips, which means my income is set by strangers' moods and my willingness to tolerate a great deal to keep them generous.",
      "There's a reason the tipped workforce is mostly women. The system quite literally monetizes deference. The cost of setting a boundary is measured in dollars off your check that night.",
      "Scheduling is its own tax. I find out my hours days in advance, get sent home when it's slow, and can't hold a second job around a shift that might evaporate. You cannot plan childcare against a schedule that won't commit to you.",
      "People call this 'unskilled.' Try defusing a hostile table while carrying four plates and doing the math on whether rent clears this week.",
    ],
    annotations: [
      {
        anchor: "The system quite literally monetizes deference",
        conceptKey: "occupationalSegregation",
        note: "Tipped service work concentrates women in roles where compensation is tied to emotional labor and tolerance of harassment — a gendered wage structure by design.",
      },
      {
        anchor: "a schedule that won't commit to you",
        conceptKey: "wageElasticity",
        note: "Just-in-time scheduling shifts demand risk onto workers, suppressing effective hourly earnings and foreclosing the second jobs that could raise labor supply.",
      },
      {
        anchor: "People call this 'unskilled'",
        conceptKey: "monopsony",
        note: "Low-wage service labor markets exhibit strong monopsony: limited outside options let employers hold wages below marginal product.",
      },
    ],
    keyStat: { value: "$2.13/hr", label: "Federal tipped base wage" },
    contributedAt: "2026-02-04",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

/** Aggregate stats shown on the archive header. */
export function archiveStats(studies: CaseStudy[]) {
  const total = studies.length
  const totalLost = studies.reduce((s, c) => s + c.estimatedLostWages, 0)
  const avgYears = total
    ? studies.reduce((s, c) => s + c.demographics.yearsExperience, 0) / total
    : 0
  const sectors = new Set(studies.map((c) => c.sector)).size
  return { total, totalLost, avgYears, sectors }
}

export function formatUSD(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}
