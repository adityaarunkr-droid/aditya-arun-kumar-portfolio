import { useMotionValue, type MotionValue } from 'framer-motion'
import { useEffect } from 'react'
import type { RefObject } from 'react'

function viewportHeight(): number {
  if (typeof window === 'undefined') return 0
  return window.visualViewport?.height ?? window.innerHeight
}

/**
 * Progress 0→1 while scrolling through a runway taller than the viewport,
 * aligned with Framer's useScroll({ target, offset: ['start start', 'end end'] }).
 * Uses getBoundingClientRect + visualViewport so iOS Safari updates during touch scroll
 * (offsetParent-based tracking used internally by useScroll is flaky with sticky sections).
 */
function computeRunwayProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  const vh = viewportHeight()
  const denom = rect.height - vh
  if (denom <= 1) return 0
  const raw = -rect.top / denom
  return Math.min(1, Math.max(0, raw))
}

export function useRunwayScrollProgress(
  targetRef: RefObject<HTMLElement | null>,
  reduceMotion: boolean | null,
): MotionValue<number> {
  const progress = useMotionValue(0)

  useEffect(() => {
    if (reduceMotion) {
      progress.set(0)
      return
    }

    const update = () => {
      const el = targetRef.current
      if (!el) return
      progress.set(computeRunwayProgress(el))
    }

    update()

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const vv = window.visualViewport
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)

    const el = targetRef.current
    const ro = new ResizeObserver(() => update())
    if (el) ro.observe(el)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [reduceMotion, progress, targetRef])

  return progress
}
