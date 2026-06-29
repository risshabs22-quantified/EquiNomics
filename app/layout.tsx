import type React from "react"
import type { Metadata } from "next"
import { Inter, Source_Serif_4, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "EquiNomics — A Narrative Economics of Gender Inequality",
    template: "%s | EquiNomics",
  },
  description:
    "EquiNomics intersects rigorous labor economics with qualitative human case studies to examine gender economic inequality — occupational segregation, the motherhood penalty, the care economy, and the gender wealth gap.",
  keywords: [
    "narrative economics",
    "gender pay gap",
    "occupational segregation",
    "motherhood penalty",
    "care economy",
    "labor economics",
    "human capital",
  ],
  authors: [{ name: "EquiNomics Research Collective" }],
  openGraph: {
    title: "EquiNomics — A Narrative Economics of Gender Inequality",
    description:
      "Where macroeconomic data meets lived experience. A research platform on the economics of gender inequality.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sourceSerif.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  )
}
