/**
 * Client-side deduplication for visitor counts.
 *
 * The REAL total lives in Supabase. This file only decides whether THIS browser
 * should call `record_visit` again — so refreshes / same-day visits do not inflate
 * the database every time.
 *
 * - `24h` mode: at most one counted visit per browser per 24 hours (localStorage).
 * - `session` mode: at most one counted visit per browser tab session (sessionStorage).
 *
 * "Unique visitors" in the DB is a separate column: we increment it only the first
 * time this browser ever records a visit (permanent localStorage flag). That is
 * not the same as true server-side unique users (which would need IP/cookies on
 * the server), but it is simple and honest for a portfolio.
 */

export const VISIT_LAST_TS_KEY = 'portfolio_visit_last_ts'
/** Set permanently after we count this browser as a "new" unique once. */
export const VISIT_UNIQUE_KEY = 'portfolio_visit_unique_registered'
/** Session-scoped flag when using dedupeMode === 'session'. */
export const VISIT_SESSION_KEY = 'portfolio_visit_session_recorded'

export const TWENTY_FOUR_H_MS = 24 * 60 * 60 * 1000

export type VisitDedupeMode = '24h' | 'session'

/** True if we should call Supabase `record_visit` for this page load. */
export function shouldRecordVisit(mode: VisitDedupeMode): boolean {
  try {
    if (mode === 'session') {
      return !sessionStorage.getItem(VISIT_SESSION_KEY)
    }
    const raw = localStorage.getItem(VISIT_LAST_TS_KEY)
    if (!raw) return true
    const last = Number(raw)
    if (Number.isNaN(last)) return true
    return Date.now() - last > TWENTY_FOUR_H_MS
  } catch {
    // Private mode / blocked storage → still allow one server count this load
    return true
  }
}

/** Persist dedupe state after a successful RPC (call once per counted visit). */
export function markVisitRecorded(mode: VisitDedupeMode): void {
  try {
    if (mode === 'session') {
      sessionStorage.setItem(VISIT_SESSION_KEY, '1')
    } else {
      localStorage.setItem(VISIT_LAST_TS_KEY, String(Date.now()))
    }
  } catch {
    /* ignore */
  }
}

/** True if this browser has never been counted as a "unique" visitor before. */
export function shouldCountAsUniqueBrowser(): boolean {
  try {
    return !localStorage.getItem(VISIT_UNIQUE_KEY)
  } catch {
    return true
  }
}

export function markUniqueBrowserRegistered(): void {
  try {
    localStorage.setItem(VISIT_UNIQUE_KEY, '1')
  } catch {
    /* ignore */
  }
}
