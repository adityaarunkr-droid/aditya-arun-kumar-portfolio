import { useEffect, useState } from 'react'

/** Section ids in document order (must match `#id` on the home page). */
const NAV_SECTION_IDS = ['home', 'experience', 'resume', 'contact'] as const

/** Viewport ratio from top used as the “reading line” for which section is active. */
const ACTIVATION_RATIO = 0.22
/** Switch nav orientation a touch before Experience becomes active. */
const BELOW_HOME_LEAD_PX = 28

function getDocumentTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY
}

export type ScrollSpyState = {
  activeId: string | null
  belowHome: boolean
}

export function useScrollSpy(enabled: boolean): ScrollSpyState {
  const [activeId, setActiveId] = useState<string | null>(() =>
    enabled ? NAV_SECTION_IDS[0] : null,
  )
  const [belowHome, setBelowHome] = useState<boolean>(false)

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => {
        setActiveId(null)
        setBelowHome(false)
      })
      return
    }

    const measure = () => {
      const offset = window.innerHeight * ACTIVATION_RATIO
      let current: (typeof NAV_SECTION_IDS)[number] = NAV_SECTION_IDS[0]

      for (const id of NAV_SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = getDocumentTop(el)
        if (window.scrollY + offset >= top - 0.5) {
          current = id
        }
      }

      setActiveId((prev) => (prev === current ? prev : current))

      const experienceEl = document.getElementById('experience')
      if (experienceEl) {
        const experienceTop = getDocumentTop(experienceEl)
        const shouldBeBelow = window.scrollY + offset >= experienceTop - BELOW_HOME_LEAD_PX
        setBelowHome((prev) => (prev === shouldBeBelow ? prev : shouldBeBelow))
      } else {
        setBelowHome(false)
      }
    }

    let raf = 0
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    const ro = new ResizeObserver(() => schedule())
    for (const id of NAV_SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) ro.observe(el)
    }

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled])

  return { activeId: enabled ? activeId : null, belowHome: enabled ? belowHome : false }
}
