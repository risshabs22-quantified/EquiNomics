"use client"

import { useEffect, useRef, useState } from "react"

interface StatCounterProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  durationMs?: number
  className?: string
}

/**
 * Counts up to `value` once the element scrolls into view — a small piece of
 * "real-time" motion that makes the macro indicators feel alive.
 */
export function StatCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className,
}: StatCounterProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (prefersReduced) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - start) / durationMs, 1)
            // easeOutExpo
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
            setDisplay(value * eased)
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, durationMs])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
