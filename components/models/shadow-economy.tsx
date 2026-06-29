"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, RotateCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { CARE_CATEGORIES, CARE_REGIONS } from "@/lib/models-data"

const PALETTE = {
  paper: "#FBFAF7",
  ink: "#262A31",
  slate: "#2E4068",
  amber: "#C8881F",
  green: "#3F6B52",
  border: "#E3E1DB",
  muted: "#6B7280",
}

interface LineItem {
  label: string
  role: string
  annualHours: number
  rate: number
  amount: number
}

function money(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

/** Build a fully self-contained SVG invoice string (hex colors, system fonts). */
function buildInvoiceSVG(
  items: LineItem[],
  total: number,
  regionLabel: string,
  invoiceNo: string,
  date: string,
) {
  const width = 660
  const headerH = 188
  const rowH = 34
  const tableTop = headerH + 40
  const totalsH = 96
  const footerH = 70
  const height = tableTop + 28 + items.length * rowH + totalsH + footerH

  const rows = items
    .map((it, i) => {
      const y = tableTop + 28 + i * rowH
      return `
    <text x="40" y="${y}" font-family="Georgia, serif" font-size="13" fill="${PALETTE.ink}">${escapeXml(it.label)}</text>
    <text x="40" y="${y + 15}" font-family="Arial, sans-serif" font-size="10" fill="${PALETTE.muted}">${escapeXml(it.role)}</text>
    <text x="360" y="${y}" font-family="'Courier New', monospace" font-size="12" fill="${PALETTE.muted}" text-anchor="end">${it.annualHours.toLocaleString()}</text>
    <text x="470" y="${y}" font-family="'Courier New', monospace" font-size="12" fill="${PALETTE.muted}" text-anchor="end">$${it.rate.toFixed(2)}</text>
    <text x="620" y="${y}" font-family="'Courier New', monospace" font-size="13" fill="${PALETTE.ink}" text-anchor="end">${money(it.amount)}</text>
    <line x1="40" y1="${y + 22}" x2="620" y2="${y + 22}" stroke="${PALETTE.border}" stroke-width="1"/>`
    })
    .join("")

  const totalsY = tableTop + 28 + items.length * rowH + 30
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${PALETTE.paper}"/>
  <rect x="0" y="0" width="${width}" height="6" fill="${PALETTE.slate}"/>
  <text x="40" y="58" font-family="Georgia, serif" font-size="30" font-weight="bold" fill="${PALETTE.ink}">Invoice to the Economy</text>
  <text x="40" y="80" font-family="Arial, sans-serif" font-size="12" fill="${PALETTE.muted}">Statement of uncompensated household &amp; care labor · EquiNomics</text>

  <text x="620" y="44" font-family="'Courier New', monospace" font-size="12" fill="${PALETTE.slate}" text-anchor="end">${invoiceNo}</text>
  <text x="620" y="62" font-family="Arial, sans-serif" font-size="11" fill="${PALETTE.muted}" text-anchor="end">Issued ${date}</text>
  <text x="620" y="80" font-family="Arial, sans-serif" font-size="11" fill="${PALETTE.muted}" text-anchor="end">Region: ${escapeXml(regionLabel)}</text>

  <line x1="40" y1="104" x2="620" y2="104" stroke="${PALETTE.border}" stroke-width="1"/>
  <text x="40" y="132" font-family="Arial, sans-serif" font-size="10" letter-spacing="2" fill="${PALETTE.muted}">BILLED TO</text>
  <text x="40" y="154" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="${PALETTE.ink}">The National Economy</text>
  <text x="40" y="172" font-family="Arial, sans-serif" font-size="11" fill="${PALETTE.muted}">c/o Gross Domestic Product · Unpaid Care Sector (excluded from GDP)</text>

  <text x="40" y="${tableTop}" font-family="Arial, sans-serif" font-size="10" letter-spacing="1.5" fill="${PALETTE.muted}">DESCRIPTION</text>
  <text x="360" y="${tableTop}" font-family="Arial, sans-serif" font-size="10" letter-spacing="1.5" fill="${PALETTE.muted}" text-anchor="end">HRS / YR</text>
  <text x="470" y="${tableTop}" font-family="Arial, sans-serif" font-size="10" letter-spacing="1.5" fill="${PALETTE.muted}" text-anchor="end">RATE</text>
  <text x="620" y="${tableTop}" font-family="Arial, sans-serif" font-size="10" letter-spacing="1.5" fill="${PALETTE.muted}" text-anchor="end">AMOUNT</text>
  <line x1="40" y1="${tableTop + 8}" x2="620" y2="${tableTop + 8}" stroke="${PALETTE.ink}" stroke-width="1.5"/>
  ${rows}

  <rect x="360" y="${totalsY}" width="260" height="52" fill="${PALETTE.slate}"/>
  <text x="376" y="${totalsY + 22}" font-family="Arial, sans-serif" font-size="11" fill="#C9D4E8">ANNUAL AMOUNT DUE</text>
  <text x="604" y="${totalsY + 38}" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="end">${money(total)}</text>

  <text x="40" y="${height - 38}" font-family="Georgia, serif" font-style="italic" font-size="11" fill="${PALETTE.muted}">This labor sustains the formal economy yet appears in no ledger. Terms: payable in recognition, policy, and redistribution.</text>
  <text x="40" y="${height - 20}" font-family="Arial, sans-serif" font-size="10" fill="${PALETTE.amber}">equinomics · figures are illustrative replacement-wage estimates</text>
</svg>`
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!,
  )
}

export function ShadowEconomy() {
  const [hours, setHours] = useState<Record<string, number>>(
    Object.fromEntries(CARE_CATEGORIES.map((c) => [c.id, c.defaultHours])),
  )
  const [regionId, setRegionId] = useState("national")
  // Invoice no. is randomized on the client only (post-mount) to avoid an SSR
  // hydration mismatch; the date is day-stable so it can render immediately.
  const [invoiceNo, setInvoiceNo] = useState("EQ-0000-0000")
  const [date, setDate] = useState("")

  useEffect(() => {
    setInvoiceNo(
      `EQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    )
    setDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }, [])

  const region = CARE_REGIONS.find((r) => r.id === regionId)!

  const { items, weekly, total } = useMemo(() => {
    const items: LineItem[] = CARE_CATEGORIES.map((c) => {
      const rate = +(c.baseRate * region.multiplier).toFixed(2)
      const h = hours[c.id] ?? 0
      const annualHours = h * 52
      return {
        label: c.label,
        role: c.mappedRole,
        annualHours,
        rate,
        amount: Math.round(annualHours * rate),
      }
    })
    const total = items.reduce((s, i) => s + i.amount, 0)
    const weekly = Math.round(total / 52)
    return { items, weekly, total }
  }, [hours, region])

  const svgString = useMemo(
    () => buildInvoiceSVG(items, total, region.label, invoiceNo, date),
    [items, total, region, invoiceNo, date],
  )

  const totalWeeklyHours = Object.values(hours).reduce((s, h) => s + h, 0)

  function download() {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-to-the-economy-${Date.now()}.svg`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,380px)_1fr] gap-8">
      {/* Controls */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="eyebrow">Hours per week</h3>
          <button
            onClick={() =>
              setHours(
                Object.fromEntries(CARE_CATEGORIES.map((c) => [c.id, c.defaultHours])),
              )
            }
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

        <div className="space-y-6">
          {CARE_CATEGORIES.map((c) => (
            <div key={c.id}>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-sm font-medium">{c.label}</label>
                <span className="font-mono text-sm font-semibold text-primary tabular-nums">
                  {hours[c.id]} <span className="text-muted-foreground text-xs">hrs</span>
                </span>
              </div>
              <Slider
                value={[hours[c.id]]}
                min={0}
                max={60}
                step={1}
                onValueChange={([v]) => setHours((p) => ({ ...p, [c.id]: v }))}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Valued as: {c.mappedRole} · ${(c.baseRate * region.multiplier).toFixed(2)}/hr
              </p>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Localized wage region
            </label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {CARE_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} (×{r.multiplier})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-px bg-border border border-border rounded-md overflow-hidden">
          <MiniStat label="Hrs / week" value={String(totalWeeklyHours)} />
          <MiniStat label="Value / week" value={money(weekly)} />
          <MiniStat label="Annual" value={money(total)} tone />
        </div>
      </div>

      {/* Live invoice preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="eyebrow">Invoice to the Economy</h3>
          <button
            onClick={download}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" /> Download SVG
          </button>
        </div>
        <div className="rounded-lg border border-border overflow-hidden shadow-sm bg-[#FBFAF7]">
          <div
            className="w-full [&>svg]:w-full [&>svg]:h-auto"
            // The same string used for download — guarantees parity.
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Valued at market replacement wages — the cost to <em>hire out</em> each task.
          Aggregated nationally, unpaid care work is estimated at 15–25% of GDP yet is
          excluded from official accounts.
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: boolean
}) {
  return (
    <div className="bg-background p-3">
      <div className="eyebrow leading-tight mb-1">{label}</div>
      <div
        className={`font-mono text-lg font-bold tabular-nums ${tone ? "text-amber" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  )
}
