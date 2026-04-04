import { VisitorCounter } from '@/components/VisitorCounter'
import { cn } from '@/lib/utils'

/**
 * Top-right of the hero (sticky home section), immediately left of the theme toggle.
 * Spacing mirrors ThemeToggle: same top + safe-area; `right` = toggle inset + 44px button + gap (~1.125rem).
 */
export function HeroVisitorCounter() {
  return (
    <div
      className={cn(
        'pt-3.5 pointer-events-none absolute z-[1001] max-w-[min(11rem,calc(100vw-6.5rem))] text-right',
        'top-[max(0.75rem,env(safe-area-inset-top,0px))] sm:top-6 md:top-8',
        'right-[calc(max(0.75rem,env(safe-area-inset-right,0px))+2.75rem+1.125rem)]',
        'sm:right-[calc(1.5rem+2.75rem+1.125rem)] md:right-[calc(2rem+2.75rem+1.125rem)]',
      )}
    >
      <div className="pointer-events-auto">
        <VisitorCounter variant="hero" showEnvHint={false} />
      </div>
    </div>
  )
}
