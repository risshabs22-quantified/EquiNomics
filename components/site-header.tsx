"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/archive", label: "Case Archive" },
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

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-border"
          : "bg-background/50 backdrop-blur-sm border-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/equinomics-logo.png"
              alt="EquiNomics"
              width={32}
              height={32}
              priority
              className="h-8 w-8 rounded-md"
            />
            <span className="font-serif text-xl font-semibold tracking-tight">
              Equi<span className="text-primary">Nomics</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors",
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="block h-px w-full bg-primary mt-1" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contribute"
              className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
            >
              Contribute Data
            </Link>
          </div>

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
          <nav className="flex flex-col px-5 py-4 gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2.5 text-sm font-medium",
                  isActive(item.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contribute"
              className="mt-2 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-sm"
            >
              Contribute Data
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
