"use client"

/**
 * Client-side persistence for user-submitted case studies.
 *
 * Submissions are stored in localStorage so the Data Contribution Portal feeds
 * the Archive and Story views in real time, without a backend. A custom event
 * keeps every open tab/component in sync the moment a new data point lands.
 */

import type { CaseStudy } from "./data"
import { CASE_STUDIES } from "./data"

const KEY = "equinomics:contributions:v1"
export const CONTRIB_EVENT = "equinomics:contrib-updated"

export function loadContributions(): CaseStudy[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CaseStudy[]) : []
  } catch {
    return []
  }
}

export function saveContribution(study: CaseStudy): void {
  if (typeof window === "undefined") return
  const existing = loadContributions()
  const next = [{ ...study, userContributed: true }, ...existing]
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(CONTRIB_EVENT))
}

export function deleteContribution(slug: string): void {
  if (typeof window === "undefined") return
  const next = loadContributions().filter((c) => c.slug !== slug)
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(CONTRIB_EVENT))
}

/** Seed studies + user contributions, newest contributions first. */
export function allStudies(): CaseStudy[] {
  return [...loadContributions(), ...CASE_STUDIES]
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48)
  return `${base || "case"}-${Math.random().toString(36).slice(2, 6)}`
}
