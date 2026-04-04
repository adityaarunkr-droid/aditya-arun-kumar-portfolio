import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { MotionPage } from './MotionPage'
import {
  SkeletonContactPage,
  SkeletonDefaultPage,
  SkeletonHomeHero,
  SkeletonHomeRest,
  SkeletonProjectDetailPage,
  SkeletonWorkPage,
} from '@/components/ui/skeleton'

/** Suspense fallback while route chunks load — layout-aware per path. */
export function RouteFallback() {
  const { pathname } = useLocation()

  let inner: ReactNode
  if (pathname === '/') {
    inner = (
      <>
        <section id="home" className="home-page-flow" aria-label="Home">
          <SkeletonHomeHero />
        </section>
        <SkeletonHomeRest />
      </>
    )
  } else if (pathname === '/work') {
    inner = <SkeletonWorkPage />
  } else if (pathname.startsWith('/work/')) {
    inner = <SkeletonProjectDetailPage />
  } else if (pathname === '/contact') {
    inner = <SkeletonContactPage />
  } else {
    inner = <SkeletonDefaultPage />
  }

  return <MotionPage>{inner}</MotionPage>
}
