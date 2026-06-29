/**
 * Datasets for the Macroeconomic Lifespan Trajectory Model.
 * All figures are illustrative, rounded approximations synthesized from public
 * labor-economics sources (BLS, Census, NACE starting-salary surveys, PitchBook
 * VC diversity reports, McKinsey/LeanIn "Women in the Workplace"). They are
 * calibrated to be directionally faithful — not official statistics.
 */

// ───────────────────────── Module 1 · Major ROI ─────────────────────────

export interface Major {
  id: string
  label: string
  field: string
  /** Median entry salary for men, $K. */
  menStart: number
  /** Median entry salary for women, $K (reflects entry-level segregation). */
  womenStart: number
  /** Annual real wage growth, men. */
  menGrowth: number
  /** Annual real wage growth, women (often lower as the gap widens mid-career). */
  womenGrowth: number
  /** Share of degrees awarded to women (occupational-segregation signal). */
  womenShare: number
}

export const MAJORS: Major[] = [
  { id: "cs", label: "Computer Science", field: "STEM", menStart: 78, womenStart: 73, menGrowth: 0.06, womenGrowth: 0.052, womenShare: 21 },
  { id: "mech-eng", label: "Mechanical Engineering", field: "STEM", menStart: 74, womenStart: 70, menGrowth: 0.055, womenGrowth: 0.048, womenShare: 16 },
  { id: "nursing", label: "Nursing", field: "Healthcare", menStart: 72, womenStart: 68, menGrowth: 0.04, womenGrowth: 0.037, womenShare: 86 },
  { id: "business", label: "Business / Finance", field: "Corporate", menStart: 66, womenStart: 59, menGrowth: 0.058, womenGrowth: 0.046, womenShare: 47 },
  { id: "economics", label: "Economics", field: "Corporate", menStart: 70, womenStart: 62, menGrowth: 0.057, womenGrowth: 0.047, womenShare: 33 },
  { id: "biology", label: "Biology", field: "STEM", menStart: 54, womenStart: 49, menGrowth: 0.045, womenGrowth: 0.04, womenShare: 63 },
  { id: "psychology", label: "Psychology", field: "Social Science", menStart: 47, womenStart: 43, menGrowth: 0.038, womenGrowth: 0.035, womenShare: 79 },
  { id: "education", label: "Education", field: "Education", menStart: 44, womenStart: 41, menGrowth: 0.03, womenGrowth: 0.028, womenShare: 81 },
  { id: "communications", label: "Communications", field: "Creative", menStart: 49, womenStart: 44, menGrowth: 0.042, womenGrowth: 0.036, womenShare: 64 },
  { id: "law", label: "Pre-Law / Political Sci.", field: "Corporate", menStart: 60, womenStart: 54, menGrowth: 0.06, womenGrowth: 0.05, womenShare: 55 },
]

export const MAJOR_ROI_YEARS = 10

// ─────────────────── Module 1 · First Negotiation Arena ───────────────────

export interface NegotiationChoice {
  label: string
  next: string
}
export interface NegotiationNode {
  id: string
  speaker: "Recruiter" | "You" | "Narrator"
  text: string
  /** Terminal nodes set a final base salary, $. */
  finalBase?: number
  /** Optional behavioral-economics annotation shown at a terminal. */
  insight?: string
  choices?: NegotiationChoice[]
}

export const NEGOTIATION_OPENING_BASE = 68000
export const NEGOTIATION_BEST_BASE = 82000

export const NEGOTIATION_TREE: Record<string, NegotiationNode> = {
  start: {
    id: "start",
    speaker: "Recruiter",
    text: "We're thrilled to extend an offer of $68,000 for the Analyst role. How does that sound?",
    choices: [
      { label: "“Thank you, I accept!”", next: "end_settle" },
      { label: "“Could you share the salary range for this role?”", next: "range" },
      { label: "“Based on my research, I was targeting $78,000.”", next: "counter" },
      { label: "“Let me take a day to consider.”", next: "delay" },
    ],
  },
  range: {
    id: "range",
    speaker: "Recruiter",
    text: "Of course — the band for this role runs $66,000 to $84,000 depending on experience.",
    choices: [
      { label: "“Given my internships, I'd be comfortable near the top — $82,000.”", next: "counter_top" },
      { label: "“The midpoint, $75,000, works for me.”", next: "end_mid" },
      { label: "“Okay, I'll take the $68,000.”", next: "end_settle" },
    ],
  },
  counter: {
    id: "counter",
    speaker: "Recruiter",
    text: "I appreciate the directness. I can get approval to move up to $74,000.",
    choices: [
      { label: "“That works — I accept $74,000.”", next: "end_74" },
      { label: "“Could we meet at $77,000?”", next: "end_77" },
      { label: "“My research supports $78,000. I'd like to hold there.”", next: "end_78" },
    ],
  },
  counter_top: {
    id: "counter_top",
    speaker: "Recruiter",
    text: "Top of band is reserved for senior hires, but I can do $79,000 for you.",
    choices: [
      { label: "“$79,000 is great — accepted.”", next: "end_79" },
      { label: "“I'll respectfully hold at $82,000.”", next: "end_82" },
    ],
  },
  delay: {
    id: "delay",
    speaker: "Recruiter",
    text: "The offer stands, but we'd love an answer soon. Anything I can clarify?",
    choices: [
      { label: "“On reflection, I accept the $68,000.”", next: "end_settle" },
      { label: "“After researching, I'd like to counter at $76,000.”", next: "end_76" },
    ],
  },
  // Terminals
  end_settle: {
    id: "end_settle",
    speaker: "Narrator",
    text: "You accepted the first number on the table.",
    finalBase: 68000,
    insight:
      "Research shows women are less likely to initiate negotiation — and that first anchor compounds for 40 years. You left the most on the table here.",
  },
  end_mid: { id: "end_mid", speaker: "Narrator", text: "You anchored to the midpoint.", finalBase: 75000, insight: "Asking for the range, then the midpoint, captured most of the available upside with minimal social risk." },
  end_74: { id: "end_74", speaker: "Narrator", text: "You countered, then accepted their move.", finalBase: 74000, insight: "A single counter-offer raised your 40-year trajectory meaningfully — most candidates stop here." },
  end_77: { id: "end_77", speaker: "Narrator", text: "You split the difference at $77,000.", finalBase: 77000, insight: "Collaborative framing (“could we meet at…”) tends to reduce the likeability penalty women face when negotiating." },
  end_78: { id: "end_78", speaker: "Narrator", text: "You held firm and won $78,000.", finalBase: 78000, insight: "Holding to a researched anchor paid off — though studies note women can incur a social cost for assertiveness men do not." },
  end_79: { id: "end_79", speaker: "Narrator", text: "You reached $79,000.", finalBase: 79000, insight: "Anchoring high (top of band) pulled the final number up, even after concession." },
  end_82: { id: "end_82", speaker: "Narrator", text: "You secured the top of band: $82,000.", finalBase: 82000, insight: "Best achievable outcome. The gap between this and the opening offer is the true cost of not negotiating." },
  end_76: { id: "end_76", speaker: "Narrator", text: "After delaying, you countered to $76,000.", finalBase: 76000, insight: "Even a late counter beat the anchor — but delaying can signal hesitancy. Negotiating in the moment is usually stronger." },
}

export const NEGOTIATION_RAISE = 0.03 // annual compounding raise
export const NEGOTIATION_CAREER_YEARS = 40

// ─────────────────── Module 3 · Glass Ceiling Velocity ───────────────────

export const CORPORATE_LEVELS = [
  "Analyst",
  "Manager",
  "Director",
  "VP",
  "SVP",
  "C-Suite",
] as const

export interface CeilingSector {
  id: string
  label: string
  /** Base years between promotions for men. */
  baseInterval: number
  /** Multiplier on each interval for women (>1 = slower). */
  womenDelay: number
}

export const CEILING_SECTORS: CeilingSector[] = [
  { id: "tech", label: "Technology", baseInterval: 2.4, womenDelay: 1.35 },
  { id: "finance", label: "Finance & Banking", baseInterval: 2.8, womenDelay: 1.5 },
  { id: "healthcare", label: "Healthcare", baseInterval: 3.0, womenDelay: 1.28 },
  { id: "law", label: "Legal", baseInterval: 3.2, womenDelay: 1.42 },
  { id: "retail", label: "Retail & Consumer", baseInterval: 2.6, womenDelay: 1.33 },
  { id: "energy", label: "Energy & Industrial", baseInterval: 3.4, womenDelay: 1.55 },
]

// ─────────────────── Module 3 · VC Allocator Game ───────────────────

export interface VCFounder {
  id: string
  name: string
  demo: string
  pitch: string
  /** Identical fundamentals across the pair — bias is the only variable. */
  fundamentals: { tam: string; revenue: string; growth: string; team: string }
  /** Real-world share of VC dollars this demographic actually receives. */
  marketShare: number
}

export interface VCRound {
  id: string
  sector: string
  a: VCFounder
  b: VCFounder
}

export const VC_FUND = 10_000_000

export const VC_ROUNDS: VCRound[] = [
  {
    id: "r1",
    sector: "Climate SaaS",
    a: {
      id: "r1a",
      name: "Daniel Reyes",
      demo: "All-male founding team",
      pitch: "Carbon-accounting platform for mid-market manufacturers.",
      fundamentals: { tam: "$14B", revenue: "$1.2M ARR", growth: "18% MoM", team: "2 ex-FAANG engineers" },
      marketShare: 0.78,
    },
    b: {
      id: "r1b",
      name: "Aisha Okafor",
      demo: "All-women founding team",
      pitch: "Carbon-accounting platform for mid-market manufacturers.",
      fundamentals: { tam: "$14B", revenue: "$1.2M ARR", growth: "18% MoM", team: "2 ex-FAANG engineers" },
      marketShare: 0.021,
    },
  },
  {
    id: "r2",
    sector: "Fintech",
    a: {
      id: "r2a",
      name: "Mixed team · M-led",
      demo: "Mixed team, male CEO",
      pitch: "Embedded lending API for SMB platforms.",
      fundamentals: { tam: "$30B", revenue: "$2.1M ARR", growth: "12% MoM", team: "Ex-Stripe, ex-Plaid" },
      marketShare: 0.17,
    },
    b: {
      id: "r2b",
      name: "Mixed team · W-led",
      demo: "Mixed team, female CEO",
      pitch: "Embedded lending API for SMB platforms.",
      fundamentals: { tam: "$30B", revenue: "$2.1M ARR", growth: "12% MoM", team: "Ex-Stripe, ex-Plaid" },
      marketShare: 0.07,
    },
  },
  {
    id: "r3",
    sector: "Health Tech",
    a: {
      id: "r3a",
      name: "Marcus Bell",
      demo: "Solo male founder",
      pitch: "AI triage for rural telehealth networks.",
      fundamentals: { tam: "$22B", revenue: "$900K ARR", growth: "22% MoM", team: "MD + ML PhD" },
      marketShare: 0.83,
    },
    b: {
      id: "r3b",
      name: "Priya Nair",
      demo: "Solo female founder",
      pitch: "AI triage for rural telehealth networks.",
      fundamentals: { tam: "$22B", revenue: "$900K ARR", growth: "22% MoM", team: "MD + ML PhD" },
      marketShare: 0.019,
    },
  },
]

// ─────────────────── Module 4 · Pay-Equity Script ───────────────────

export type ScriptTone = "collaborative" | "direct" | "formal"

export const SCRIPT_TONES: { id: ScriptTone; label: string }[] = [
  { id: "collaborative", label: "Collaborative" },
  { id: "direct", label: "Direct" },
  { id: "formal", label: "Formal / Written" },
]
