/**
 * Transparent documentation of every interactive instrument's algorithm.
 * Rendered on the Methodology page. Each spec states what is computed, the core
 * formula, the inputs, and the key calibrating assumptions. All coefficients are
 * illustrative and directionally calibrated — not official statistics.
 */

interface Spec {
  index: string
  name: string
  summary: string
  formula: string
  inputs: string
  assumptions: string
}

interface Group {
  title: string
  specs: Spec[]
}

const GROUPS: Group[] = [
  {
    title: "Lifespan Trajectory Overview",
    specs: [
      {
        index: "00",
        name: "Cumulative Lifetime Earnings Trajectory",
        summary:
          "Projects and accumulates earnings for a male and female track across ages 22–65, then derives the lifetime earnings and wealth gaps.",
        formula:
          "wageₜ = start · (1+g)ᵗ;  women apply an entry discount and, if children are toggled, a 2-yr break (×0.25) plus a recovering penalty min(0.12, 0.28 − 0.012·yrsSince). Wealthₜ = Wealthₜ₋₁·(1+r) + wageₜ·s.",
        inputs: "Toggles: negotiates first salary, has children, pay transparency.",
        assumptions:
          "Base $68k; savings rate s = 12%; return r = 6%; child event at age 31. Negotiation removes 7pp of the entry gap; transparency removes 2pp and stops growth divergence.",
      },
    ],
  },
  {
    title: "Module 1 · Early Career & Accumulation",
    specs: [
      {
        index: "01",
        name: "Major ROI & Wage Elasticity Calculator",
        summary:
          "Traces gendered wage trajectories over the first 10 years by field of study.",
        formula:
          "menₜ = menStart·(1+gₘ)ᵗ;  womenₜ = womenStart·(1+g𝓌)ᵗ.  Cumulative gap = Σ(menₜ − womenₜ)·1,000.",
        inputs: "Selected major (entry salaries, growth rates, women's share of field).",
        assumptions:
          "Per-major entry salaries and growth rates approximated from NACE starting-salary surveys and BLS occupational data; women's growth is set slightly lower to reflect the widening mid-career gap.",
      },
      {
        index: "02",
        name: "First Negotiation Arena",
        summary:
          "A branching dialogue tree whose terminal nodes set a starting base; the engine compounds that base over a 40-year career.",
        formula:
          "lifetime(base) = base · ((1+raise)ᴺ − 1) / raise, with raise = 3%, N = 40. Left-on-table = lifetime(best) − lifetime(chosen).",
        inputs: "Choices through the tree → finalBase ($68k–$82k).",
        assumptions:
          "Opening anchor $68k; best achievable $82k. Behavioral annotations reflect findings that women negotiate less often and can face a social/likeability penalty when they do.",
      },
      {
        index: "03",
        name: "Student Debt Amortization Delta",
        summary:
          "Compares loan payoff time and total interest for a male vs. female earner whose payment scales with income.",
        formula:
          "payment = (salary/12)·share; months n = −ln(1 − rP/payment)/ln(1+r), r = APR/12; interest = payment·n − P. The woman's salary is discounted by the pay gap.",
        inputs: "Principal, APR, entry salary, pay gap %, income share toward loan.",
        assumptions:
          "Fixed payment as a share of gross income. If payment ≤ monthly interest, the balance never amortizes (surfaced explicitly).",
      },
    ],
  },
  {
    title: "Module 2 · Care Economy & Domestic Arbitrage",
    specs: [
      {
        index: "04",
        name: "Time-Use Disparity Tracker",
        summary:
          "Logs a 24-hour day across paid work and three unpaid categories, comparing the 'second shift' to national benchmarks.",
        formula:
          "secondShift = domestic + childcare + mental;  gap = secondShift − benchmarkₘₐₗₑ;  weekly = secondShift · 7.",
        inputs: "Daily hours per category.",
        assumptions:
          "Benchmark daily allocations approximated from the BLS American Time Use Survey.",
      },
      {
        index: "05",
        name: "Shadow GDP Invoice Generator",
        summary:
          "Values logged unpaid hours at localized market replacement wages and renders a self-contained, downloadable SVG invoice.",
        formula:
          "amountᵢ = hoursᵢ · 52 · (baseRateᵢ · regionMultiplier);  total = Σ amountᵢ.",
        inputs: "Weekly hours per care category; wage region.",
        assumptions:
          "Replacement wages (housekeeper, childcare, home-health-aide, household-manager) from BLS occupational wages; regional multipliers for cost-of-living.",
      },
      {
        index: "06",
        name: "Motherhood Penalty Projector",
        summary:
          "Charts mother, father, and no-child-counterfactual earnings for 15 years after a first birth.",
        formula:
          "father = base·(1+0.06)·(1+g)ᵗ;  mother = base·(1−penalty)·(1+g)ᵗ with penalty = min(0.40, 0.04·children + recovery); break years scaled ×0.15.",
        inputs: "Pre-birth salary, number of children, career-break months.",
        assumptions:
          "≈4% penalty per child (Budig & England) and a 'fatherhood premium' of ≈6%; g = 4%.",
      },
    ],
  },
  {
    title: "Module 3 · Capital Systems & Corporate Velocity",
    specs: [
      {
        index: "07",
        name: "Glass Ceiling Velocity Simulator",
        summary:
          "A real-time clock advancing two hires through six corporate levels at sector-specific promotion speeds.",
        formula:
          "level(years) = min(5, ⌊years / interval⌋);  intervalₘₑₙ = base;  interval𝓌ₒₘₑₙ = base · delay.  Time-to-C-suite = 5 · interval.",
        inputs: "Sector (base interval, women's delay factor); play/pause/speed.",
        assumptions:
          "Base promotion intervals and delay factors approximated from McKinsey/LeanIn 'Women in the Workplace' attrition data.",
      },
      {
        index: "08",
        name: "Venture Capital Allocator Game",
        summary:
          "Allocates a $10M fund across founder pairs with identical fundamentals, then contrasts the user's gender allocation with the real market's.",
        formula:
          "userWomen = Σ potᵢ·splitᵢ;  marketWomen = Σ potᵢ · shareᵦ/(shareₐ+shareᵦ);  redirected = userWomen − marketWomen.",
        inputs: "Per-round allocation sliders.",
        assumptions:
          "All-women teams receive ≈2% of U.S. venture dollars (PitchBook). Fundamentals are held identical so demographics are the only variable.",
      },
      {
        index: "09",
        name: "Intersectional Regression Matrix",
        summary:
          "Crosses gender with race, education, or region and renders earnings as median $K or as cents per reference-group dollar.",
        formula:
          "cents = round(value / referenceValue · 100);  within-group gap = (men − women)/men.",
        inputs: "Lens (race/education/region); display mode.",
        assumptions:
          "Median earnings by intersecting group approximated from Census/BLS; reference = the highest-earning male subgroup in each lens.",
      },
    ],
  },
  {
    title: "Module 4 · The Micro-Intervention Toolbelt",
    specs: [
      {
        index: "10",
        name: "Automated Pay-Equity Script Builder",
        summary:
          "Generates a tailored, copyable wage-audit request from the user's figures, in three tones.",
        formula:
          "gap = market − current;  gap% = gap/current.  Values are interpolated into tone-specific templates.",
        inputs: "Name, role, current salary, market average, years experience, tone.",
        assumptions:
          "References the Equal Pay Act of 1963 and state pay-equity statutes illustratively; educational template, not legal advice.",
      },
      {
        index: "11",
        name: "Pink Tax Micro-Audit Indexer",
        summary:
          "Converts category spending into an annual 'Gender Inflation Premium' and projects forgone investment growth.",
        formula:
          "premiumᵢ = annualSpendᵢ · markupᵢ/(1+markupᵢ);  invested = premium · ((1+r)ᴺ − 1)/r, r = 6%, N = 50.",
        inputs: "Monthly spend per category.",
        assumptions:
          "Markups from the NYC DCA 'From Cradle to Cane' (2015) study: personal care +13%, apparel +8%, services ≈+15%.",
      },
      {
        index: "12",
        name: "Wealth Gap Mitigation Engine",
        summary:
          "Solves for the additional monthly investment required to close a target wealth gap by age 65.",
        formula:
          "FV = savings·(1+r)ᴹ + monthly·((1+r)ᴹ−1)/r;  target = FV·(1+gap);  extra = (target − savings·(1+r)ᴹ)/annuity − monthly.",
        inputs: "Age, current savings, monthly investment, return, wealth gap to close.",
        assumptions:
          "Monthly compounding to age 65; the gap target reflects lower female lifetime savings (Federal Reserve SCF).",
      },
    ],
  },
  {
    title: "Standalone Model · Predictive Policy",
    specs: [
      {
        index: "P",
        name: "Econometric Policy Simulator",
        summary:
          "Projects the national gender wage gap over 10 years as a function of four policy levers.",
        formula:
          "gapₜ = max(floor, base − Σeffectᵢ · (1 − e^(−t/τ)));  leave follows an inverted-U peaking ≈28 weeks; τ ≈ 3.2 yrs, base 16pp, floor 2.5pp.",
        inputs: "Paid leave (weeks), wage transparency, subsidized childcare, flexible-work coverage.",
        assumptions:
          "Lever coefficients calibrated to be directionally faithful to the parental-leave and pay-transparency literature.",
      },
    ],
  },
]

export function InstrumentMethodology() {
  return (
    <div className="not-prose space-y-8">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="font-display text-xl font-bold mb-4">{group.title}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {group.specs.map((s) => (
              <div
                key={s.index}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-mono text-xs text-amber font-semibold">
                    {s.index}
                  </span>
                  <h4 className="font-display text-lg font-bold leading-tight">
                    {s.name}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.summary}
                </p>
                <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-secondary/40 p-3 text-[12px] leading-relaxed font-mono text-foreground/90 whitespace-pre-wrap">
                  {s.formula}
                </pre>
                <dl className="mt-3 space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-semibold text-foreground">Inputs:</dt>
                    <dd className="text-muted-foreground">{s.inputs}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 font-semibold text-foreground">
                      Calibration:
                    </dt>
                    <dd className="text-muted-foreground">{s.assumptions}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
