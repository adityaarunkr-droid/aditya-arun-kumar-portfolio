import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SkeletonHomeHero,
  SkeletonHomeRest,
} from '@/components/ui/skeleton'
import './home-page.css'
import '../styles/theme-light-overrides.css'

const AboutIntroSection = lazy(() =>
  import('../components/AboutIntroSection').then((m) => ({ default: m.AboutIntroSection })),
)

const HomeRest = lazy(() =>
  import('./home-rest').then((m) => ({ default: m.HomeRest })),
)

export function HomePage() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (pathname !== '/') return
    const id = hash.replace(/^#/, '')
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <>
      <section id="home" className="home-page-flow" aria-label="Home">
        <Suspense fallback={<SkeletonHomeHero />}>
          <AboutIntroSection />
        </Suspense>
      </section>

      <Suspense fallback={<SkeletonHomeRest />}>
        <HomeRest />
      </Suspense>
    </>
  )
}
