# EquiNomics

**A Narrative Economics of Gender Inequality.**

EquiNomics is a research platform that intersects rigorous labor-economics data
with qualitative human case studies to examine gender economic inequality —
occupational segregation, the motherhood penalty, the care economy, and the
gender wealth gap. It pairs a quantitative **Macro Dashboard** with a structured,
filterable **Case Study Archive** in which lived experiences are treated as data
points and annotated with the economic theory that explains them.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **Tailwind CSS v4** + **shadcn/ui** (new-york), adapted into a scholarly
  "ink & parchment" dark editorial theme
- **Recharts** for data visualization
- **Source Serif 4 / Inter / Geist Mono** type system
- No backend required — contributions persist in `localStorage` and feed the
  archive in real time.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build && npm run start
```

> Node was installed via Homebrew (`brew install node`). If `node` isn't on your
> PATH, ensure `/opt/homebrew/bin` is included.

## Pages

| Route               | Purpose                                                          |
| ------------------- | ---------------------------------------------------------------- |
| `/`                 | **Macro Dashboard** — indicators, live charts, opportunity-cost calculator, curated case panel |
| `/archive`          | **Case Study Archive** — filter by sector, phenomenon, demographics; grid/list views |
| `/archive/[slug]`   | **Analysis & Deep Dive** — dual-column narrative + Economic Sidebar with footnotes |
| `/contribute`       | **Data Contribution Portal** — validated intake form with live preview |
| `/methodology`      | Sourcing notes + economic glossary                               |
| `/about`            | Project thesis                                                   |
| `/ethics`, `/privacy`, `/terms` | Data ethics & consent, privacy policy, terms of use |

## Key interactive features

- **Lifetime Opportunity-Cost Estimator** — models forgone earnings vs. an
  unconstrained peer, recomputing live as you move the inputs.
- **Live archive** — submitting a case study via the portal immediately updates
  the dashboard panel, archive stats, and filters via a custom storage event.
- **Annotated narratives** — narrative phrases link to numbered economic
  footnotes in the sidebar.
- **Animated count-up indicators** that trigger on scroll into view.

## Data & ethics

All macro figures are approximate, rounded values drawn from public datasets
(BLS, U.S. Census Bureau, OECD) and peer-reviewed labor economics, presented as
illustrative reference points — see `/methodology`. Contributions are anonymized
by design and stored locally in the browser; see `/ethics` and `/privacy`.

_An academic passion project for education and research._
