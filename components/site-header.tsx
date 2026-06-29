"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/models", label: "Models" },
  { href: "/archive", label: "Archive" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-shadow",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-border shadow-[0_1px_0_0_var(--border)]"
          : "bg-background border-border",
      )}
    >
      {/* Top hairline meta strip — editorial masthead touch */}
      <div className="hidden md:block border-b border-border/60">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 flex items-center justify-between h-7">
          <span className="eyebrow">The Economics of Gender Inequality</span>
          <span className="eyebrow tabular-nums">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/equinomics-logo.png"
              alt="EquiNomics"
              width={34}
              height={34}
              priority
              className="h-[34px] w-[34px] rounded-md ring-1 ring-border"
            />
            <span className="font-display text-2xl font-bold tracking-tight leading-none">
              Equi<span className="text-primary">Nomics</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium tracking-wide transition-colors py-1",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground link-underline",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-px left-0 h-0.5 w-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <Link
            href="/contribute"
            className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Contribute Data
          </Link>

          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-5 py-3 divide-rule">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-3 text-sm font-medium",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contribute"
              className="mt-3 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md"
            >
              Contribute Data
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
