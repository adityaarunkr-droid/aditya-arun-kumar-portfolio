import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import type { MotionValue } from 'framer-motion'
import { useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import {
  markUniqueBrowserRegistered,
  markVisitRecorded,
  shouldCountAsUniqueBrowser,
  shouldRecordVisit,
  type VisitDedupeMode,
} from '@/lib/visitTracking'
import { cn } from '@/lib/utils'

type Stats = { total: number; unique: number }

function parseRpcPayload(data: unknown): Stats | null {
  if (!data) return null
  const row = Array.isArray(data) ? data[0] : data
  if (!row || typeof row !== 'object') return null
  const o = row as Record<string, unknown>
  const total = Number(o.total_visits)
  const unique = Number(o.unique_visitors)
  if (!Number.isFinite(total)) return null
  return { total, unique: Number.isFinite(unique) ? unique : 0 }
}

function formatCount(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

type VisitStatus = 'idle' | 'loading' | 'error' | 'disabled'

type PortfolioVisitContextValue = {
  stats: Stats | null
  status: VisitStatus
  spring: MotionValue<number>
}

const PortfolioVisitContext = createContext<PortfolioVisitContextValue | null>(null)

export function usePortfolioVisit(): PortfolioVisitContextValue | null {
  return useContext(PortfolioVisitContext)
}

/**
 * Wrap the app (or layout) once so every VisitorCounter shares the same fetch + increment.
 * Prevents double-counting when the counter appears in the footer and on the home page.
 */
export function PortfolioVisitProvider({
  children,
  dedupeMode = '24h',
}: PropsWithChildren<{ dedupeMode?: VisitDedupeMode }>) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [status, setStatus] = useState<VisitStatus>('idle')
  /** Prevents double `record_visit` when React Strict Mode runs the effect twice. */
  const recordVisitClaimedRef = useRef(false)

  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 90, damping: 22, mass: 0.4 })

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setStatus('disabled')
      return
    }

    let cancelled = false
    setStatus('loading')
    let loadedFromDb = false

    void (async () => {
      try {
        const { data: row, error: readErr } = await supabase
          .from('site_stats')
          .select('total_visits, unique_visitors')
          .eq('id', 1)
          .maybeSingle()

        if (cancelled) return
        if (readErr) throw readErr

        const initial: Stats = {
          total: Number(row?.total_visits ?? 0),
          unique: Number(row?.unique_visitors ?? 0),
        }
        loadedFromDb = true
        setStats(initial)
        mv.set(initial.total)
        setStatus('idle')

        const eligible = shouldRecordVisit(dedupeMode)
        if (!eligible) return

        if (recordVisitClaimedRef.current) return
        recordVisitClaimedRef.current = true

        const countUnique = shouldCountAsUniqueBrowser()

        const { data: rpcData, error: rpcErr } = await supabase.rpc('record_visit', {
          p_count_as_unique: countUnique,
        })

        if (cancelled) return
        if (rpcErr) throw rpcErr

        const next = parseRpcPayload(rpcData)
        if (next) {
          setStats(next)
          mv.set(next.total)
          markVisitRecorded(dedupeMode)
          if (countUnique) markUniqueBrowserRegistered()
        }
      } catch {
        if (!cancelled) setStatus(loadedFromDb ? 'idle' : 'error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dedupeMode, mv])

  const value: PortfolioVisitContextValue = { stats, status, spring }

  return (
    <PortfolioVisitContext.Provider value={value}>{children}</PortfolioVisitContext.Provider>
  )
}

type VisitorCounterProps = {
  className?: string
  /** Footer | home (pill) | hero (top-right over dark/light hero). */
  variant?: 'footer' | 'home' | 'hero'
  /** When true, show both total visits and "unique browsers" (first-time flag). */
  showUniqueLine?: boolean
  /** When Supabase env is missing in dev, show setup hint (footer only avoids duplicate hints). */
  showEnvHint?: boolean
}

export function VisitorCounter({
  className,
  variant = 'footer',
  showUniqueLine = false,
  showEnvHint = true,
}: VisitorCounterProps) {
  const ctx = usePortfolioVisit()

  if (!ctx) return null

  const { stats, status, spring } = ctx

  if (status === 'disabled') {
    if (!import.meta.env.DEV) return null
    if (!showEnvHint) return null
    return (
      <div
        className={cn(
          'max-w-md space-y-1.5 text-[11px] leading-snug text-amber-800/95 dark:text-amber-300/90',
          className,
        )}
      >
        <p>
          <span className="font-medium text-amber-900 dark:text-amber-200">Visitor analytics (optional):</span>{' '}
          when enabled, this counter records how many people open your portfolio (totals in Supabase, with
          simple per-browser deduping — no personal data).
        </p>
        <p>
          Add to <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env</code>:{' '}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_SUPABASE_ANON_KEY</code>{' '}
          (public anon key only — never the service_role key). Run the SQL in{' '}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">supabase/migrations/</code>. See{' '}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">README.md</code> for production setup.
        </p>
      </div>
    )
  }

  if (status === 'error' && !stats) {
    return (
      <p
        className={cn(
          'text-xs',
          variant === 'hero'
            ? 'text-red-200/90 drop-shadow-md dark:text-red-300/90'
            : 'text-zinc-500 dark:text-zinc-400',
          className,
        )}
      >
        Couldn&apos;t load visitor stats.
      </p>
    )
  }

  const align =
    variant === 'home'
      ? 'items-center text-center'
      : variant === 'hero'
        ? 'items-end text-right'
        : 'items-start text-left sm:items-end sm:text-right'

  const lineClass =
    variant === 'hero'
      ? 'text-[11px] leading-snug text-zinc-700/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)] dark:text-white/80 sm:text-xs'
      : 'text-xs text-zinc-500 dark:text-zinc-400'

  const numClass =
    variant === 'hero'
      ? 'font-semibold tabular-nums text-zinc-900 drop-shadow-[0_1px_10px_rgba(0,0,0,0.2)] dark:text-white dark:drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]'
      : 'font-medium tabular-nums text-zinc-700 dark:text-zinc-200'

  return (
    <div
      className={cn(
        'flex flex-col gap-0.5',
        align,
        variant === 'home' &&
          'mt-5 rounded-full border border-zinc-200/80 bg-zinc-50/80 px-4 py-2 dark:border-white/10 dark:bg-white/[0.04]',
        className,
      )}
    >
      <p className={lineClass}>
        Portfolio views:{' '}
        <span className={numClass}>{stats ? <AnimatedNumber spring={spring} /> : '…'}</span>
      </p>
      {showUniqueLine && stats && variant !== 'hero' ? (
        <p className="text-[11px] leading-snug text-zinc-400 dark:text-zinc-500">
          <span className="tabular-nums">{formatCount(stats.unique)}+</span> unique browsers
          <span className="hidden sm:inline"> (first visit, this device)</span>
        </p>
      ) : null}
    </div>
  )
}

function AnimatedNumber({ spring }: { spring: MotionValue<number> }) {
  const [n, setN] = useState(() => Math.round(spring.get()))
  useMotionValueEvent(spring, 'change', (v) => {
    setN(Math.round(v))
  })
  return <>{formatCount(n)}</>
}
