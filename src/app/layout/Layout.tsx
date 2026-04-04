import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BackgroundMusicProvider, BackgroundMusicToggle } from '@/components/BackgroundMusic'
import { PortfolioVisitProvider } from '@/components/VisitorCounter'
import { ThemeToggle } from '../components/ThemeToggle'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import './layout-nav.css'

function FloatingNavLink({
  sectionId,
  active,
  children,
  className,
  onAfterNavigate,
}: PropsWithChildren<{
  sectionId: string
  active: boolean
  className?: string
  onAfterNavigate?: () => void
}>) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Link
      className={cn('floating-nav__link', active && 'floating-nav__link--active', className)}
      to={`/#${sectionId}`}
      aria-current={active ? 'location' : undefined}
      onClick={(e) => {
        if (location.pathname === '/') {
          e.preventDefault()
          document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
          void navigate({ pathname: '/', hash: sectionId }, { replace: true })
        }
        onAfterNavigate?.()
      }}
    >
      {children}
    </Link>
  )
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Layout({ children }: PropsWithChildren) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { activeId: activeSection, belowHome } = useScrollSpy(isHome)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setMobileMenuOpen(false))
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mobileMenuOpen])

  return (
    <PortfolioVisitProvider dedupeMode="24h">
    <BackgroundMusicProvider>
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <ThemeToggle />
      <BackgroundMusicToggle />
      <div className="pointer-events-none fixed inset-0 noise opacity-[0.04] dark:opacity-[0.05]" />

      <nav
        className={cn('floating-nav', belowHome && 'floating-nav--horizontal')}
        aria-label="Primary"
      >
        <FloatingNavLink sectionId="home" active={activeSection === 'home'}>
          Home
        </FloatingNavLink>
        <FloatingNavLink sectionId="experience" active={activeSection === 'experience'}>
          Experience
        </FloatingNavLink>
        <FloatingNavLink sectionId="resume" active={activeSection === 'resume'}>
          Resume
        </FloatingNavLink>
        <FloatingNavLink sectionId="contact" active={activeSection === 'contact'}>
          Contact
        </FloatingNavLink>
      </nav>

      <div className="mobile-nav__root">
        <button
          type="button"
          className="mobile-nav__toggle"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>

        {mobileMenuOpen && (
          <>
            <button
              type="button"
              className="mobile-nav__backdrop"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav
              id="mobile-nav-panel"
              className="mobile-nav__panel"
              aria-label="Primary mobile"
            >
              <FloatingNavLink
                sectionId="home"
                active={activeSection === 'home'}
                className="mobile-nav__link"
                onAfterNavigate={() => setMobileMenuOpen(false)}
              >
                Home
              </FloatingNavLink>
              <FloatingNavLink
                sectionId="experience"
                active={activeSection === 'experience'}
                className="mobile-nav__link"
                onAfterNavigate={() => setMobileMenuOpen(false)}
              >
                Experience
              </FloatingNavLink>
              <FloatingNavLink
                sectionId="resume"
                active={activeSection === 'resume'}
                className="mobile-nav__link"
                onAfterNavigate={() => setMobileMenuOpen(false)}
              >
                Resume
              </FloatingNavLink>
              <FloatingNavLink
                sectionId="contact"
                active={activeSection === 'contact'}
                className="mobile-nav__link"
                onAfterNavigate={() => setMobileMenuOpen(false)}
              >
                Contact
              </FloatingNavLink>
            </nav>
          </>
        )}
      </div>

      <main
        className={cn(
          'w-full',
          !isHome &&
            'mx-auto max-w-6xl py-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] md:py-10 md:pr-8 md:pl-[max(2rem,calc(8.25rem+env(safe-area-inset-left,0px)))]',
        )}
        data-nav-mode={
          isHome ? (belowHome ? 'horizontal' : 'column') : undefined
        }
      >
        {children}
      </main>

      <footer className="border-t border-zinc-200 dark:border-white/10">
        <div className="layout-footer-inner mx-auto w-full max-w-6xl text-sm text-zinc-500 dark:text-zinc-400">
          <p className="mb-0">
            © {new Date().getFullYear()} Aditya Arun Kumar. Built with React + Vite.
          </p>
        </div>
      </footer>
    </div>
    </BackgroundMusicProvider>
    </PortfolioVisitProvider>
  )
}
