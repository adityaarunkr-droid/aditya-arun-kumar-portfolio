import { useState } from 'react'
import { MotionPage } from '../components/MotionPage'
import { Button } from '@/components/ui/button'
import { useErrorOverlay } from '@/components/ui/error'

function AboutRenderErrorDemo() {
  const [crash, setCrash] = useState(false)
  if (crash) {
    throw new Error('Demo render error (Error Boundary)')
  }
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => setCrash(true)}>
      Trigger render error
    </Button>
  )
}

function AboutErrorOverlayDemos() {
  const { showError } = useErrorOverlay()

  return (
    <section
      className="mt-10 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/[0.06] p-5 dark:border-amber-400/30 dark:bg-amber-400/[0.06]"
      aria-label="Development error overlay demos"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-800 dark:text-amber-200/90">
        Dev only — error overlay
      </p>
      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
        Exercise the global error dialog: React boundary, unhandled rejection, and manual{' '}
        <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/10">showError</code>.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <AboutRenderErrorDemo />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            queueMicrotask(() => {
              void Promise.reject(new Error('Demo async rejection'))
            })
          }}
        >
          Trigger async error
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            showError({
              title: 'Manual test',
              message: 'This overlay was opened with showError() for QA.',
              source: 'manual',
            })
          }
        >
          Manual overlay
        </Button>
      </div>
    </section>
  )
}

export function AboutPage() {
  return (
    <MotionPage>
      <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
            About
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Hi, I’m Your Name.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Write a short story here: what you do, what you love building, and
            what makes your work distinct. Keep it punchy and specific.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
            If you want a vibe like `thibaut.cool`, lean into personality, bold
            typography, and a tight set of “cool stuff” with clear years and
            breakdown pages.
          </p>
        </div>

        <aside className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Tools I use
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>TypeScript</li>
            <li>React</li>
            <li>Motion / micro-interactions</li>
            <li>Performance-first UI</li>
          </ul>
        </aside>
      </section>
      {import.meta.env.DEV ? <AboutErrorOverlayDemos /> : null}
    </MotionPage>
  )
}

