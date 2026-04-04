import * as React from 'react'
import { cn } from '@/lib/utils'

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

/** Base shimmer block — theme-aware, subtle sweep (no harsh flash). */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-md bg-zinc-200/70 dark:bg-zinc-800/80',
        className,
      )}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/45 to-transparent dark:via-white/[0.06]"
        aria-hidden
      />
    </div>
  )
}

export function SkeletonText({
  lines = 3,
  className,
  gapClassName = 'space-y-2.5',
}: {
  lines?: number
  className?: string
  gapClassName?: string
}) {
  const widths = ['w-full', 'w-[92%]', 'w-[78%]', 'w-[86%]', 'w-[70%]']
  return (
    <div className={cn('w-full', gapClassName, className)} aria-hidden>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3.5 rounded-md', widths[i % widths.length])}
        />
      ))}
    </div>
  )
}

export function SkeletonHeading({ className }: { className?: string }) {
  return <Skeleton className={cn('h-8 w-48 rounded-lg md:h-10 md:w-64', className)} />
}

export function SkeletonLabel({ className }: { className?: string }) {
  return <Skeleton className={cn('h-3 w-24 rounded-md', className)} />
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-full rounded-md sm:w-36', className)} />
}

export function SkeletonCircle({ className }: { className?: string }) {
  return <Skeleton className={cn('rounded-full', className)} />
}

/** Full hero runway matching AboutIntroSection (sticky + story stack). */
export function SkeletonHomeHero() {
  return (
    <div className="about-intro" aria-busy="true" aria-label="Loading hero">
      <div className="about-intro__heroBleed">
        <div className="relative h-[500vh] w-full">
          <div className="sticky top-0 flex h-[100dvh] min-h-[100svh] w-full items-center justify-center overflow-hidden bg-zinc-100 dark:bg-[#121212]">
            <Skeleton className="h-full w-full max-w-none rounded-none bg-zinc-200/50 dark:bg-zinc-900/60" />
          </div>
        </div>
      </div>
      <div className="about-intro__stack">
        <SkeletonText lines={4} className="max-w-xl" />
      </div>
    </div>
  )
}

/** Experience + resume + contact + end bookmark placeholders. */
export function SkeletonHomeRest() {
  return (
    <div className="pointer-events-none" aria-busy="true" aria-label="Loading sections">
      <section className="content-section experience-section">
        <SkeletonLabel className="mx-auto md:mx-0" />
        <Skeleton className="mx-auto mt-3 h-10 w-56 rounded-xl md:mx-0 md:w-72" />
        <SkeletonText lines={2} className="mx-auto mt-5 max-w-2xl md:mx-0" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl md:h-80" />
          <Skeleton className="h-72 rounded-2xl md:h-80" />
        </div>
      </section>

      <section className="resume-page-section">
        <div className="content-section resume-details resume-page-section__intro">
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
        <div className="resume-page-section__tv mt-6 px-4">
          <Skeleton className="mx-auto aspect-[4/3] w-full max-w-2xl rounded-[28px]" />
        </div>
      </section>

      <section className="content-section">
        <SkeletonLabel className="mx-auto md:mx-0" />
        <Skeleton className="mx-auto mt-3 h-10 w-64 rounded-xl md:mx-0" />
        <SkeletonText lines={2} className="mx-auto mt-5 max-w-2xl md:mx-0" />
        <div className="mt-8 space-y-4">
          <SkeletonContactForm />
        </div>
      </section>

      <section className="content-section home-end-bookmark border-t border-zinc-200/80 dark:border-white/[0.06]">
        <Skeleton className="mx-auto aspect-[498/280] w-full max-w-md rounded-2xl" />
        <Skeleton className="mx-auto mt-6 h-5 w-64 rounded-md" />
        <SkeletonCircle className="mx-auto mt-4 h-12 w-12" />
      </section>
    </div>
  )
}

export function SkeletonProjectCard() {
  return (
    <div
      className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
      aria-hidden
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-6 w-[80%] max-w-[240px] rounded-lg" />
          <Skeleton className="h-4 w-full max-w-sm rounded-md" />
        </div>
        <SkeletonCircle className="h-9 w-9 shrink-0" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonWorkPage() {
  return (
    <div className="space-y-10 px-1" aria-busy="true" aria-label="Loading work">
      <div className="space-y-3">
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="h-10 w-full max-w-lg rounded-xl" />
        <SkeletonText lines={2} className="max-w-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonProjectCard key={i} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonDefaultPage() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <div className="space-y-3">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-9 w-2/3 max-w-md rounded-xl" />
        <SkeletonText lines={3} className="max-w-2xl" />
      </div>
      <Skeleton className="h-48 w-full max-w-3xl rounded-2xl" />
      <SkeletonText lines={5} className="max-w-3xl" />
    </div>
  )
}

export function SkeletonProjectDetailPage() {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03] md:p-10">
      <Skeleton className="h-3 w-40 rounded-md" />
      <Skeleton className="mt-4 h-12 w-full max-w-2xl rounded-xl" />
      <SkeletonText lines={2} className="mt-4 max-w-2xl" />
      <div className="mt-6 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-10 h-40 w-full rounded-2xl" />
    </div>
  )
}

/** Matches Contact2 form layout (two columns, fields, CTA). */
export function SkeletonContactForm({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card/30 p-5 backdrop-blur-sm sm:p-8 md:p-10',
        className,
      )}
      aria-hidden
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="grid w-full gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid w-full gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="mt-5 grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
      <div className="mt-5 grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      <SkeletonButton className="mt-6" />
    </div>
  )
}

export function SkeletonContactPage() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading contact">
      <div className="mx-auto max-w-lg space-y-3 text-center">
        <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
        <SkeletonText lines={2} className="mx-auto max-w-md" />
      </div>
      <SkeletonContactForm className="mx-auto max-w-screen-md" />
    </div>
  )
}

/** Dark canvas placeholder (sequence / hero loading). */
export function SkeletonCanvasSequence({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        'rounded-none bg-zinc-300/40 dark:bg-zinc-950/90',
        className,
      )}
      aria-label="Loading"
    />
  )
}

/** Matches ExperienceSkillPanels / esp grid footprint. */
export function SkeletonExperiencePanels() {
  return (
    <div
      className="mt-6 grid min-h-[280px] gap-6 md:min-h-[320px] md:grid-cols-2"
      aria-busy="true"
      aria-label="Loading skills"
    >
      <Skeleton className="min-h-[280px] rounded-2xl md:min-h-[300px]" />
      <Skeleton className="min-h-[280px] rounded-2xl md:min-h-[300px]" />
    </div>
  )
}
