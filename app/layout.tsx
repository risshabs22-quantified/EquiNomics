import type React from "react"
import type { Metadata } from "next"
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
  IBM_Plex_Mono,
  Merriweather,
} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://equinomics.vercel.app"),
  title: {
    default: "EquiNomics — The Economics of Gender Inequality",
    template: "%s | EquiNomics",
  },
  description:
    "A high school economics project that pairs labor-market data with real people's stories — pay gaps, unpaid care, the motherhood penalty, and why the numbers keep getting worse over a lifetime.",
  keywords: [
    "gender pay gap",
    "occupational segregation",
    "motherhood penalty",
    "care economy",
    "labor economics",
    "human capital",
  ],
  authors: [{ name: "EquiNomics" }],
  openGraph: {
    title: "EquiNomics — The Economics of Gender Inequality",
    description:
      "Charts, models, and real stories about why a small pay gap at 22 can turn into a huge one by 65.",
    type: "website",
    siteName: "EquiNomics",
    url: "https://equinomics.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "EquiNomics — The Economics of Gender Inequality",
    description:
      "Charts, models, and real stories about why a small pay gap at 22 can turn into a huge one by 65.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${jakarta.variable} ${plexMono.variable} ${merriweather.variable} font-sans antialiased min-h-screen flex flex-col overflow-x-clip`}
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
