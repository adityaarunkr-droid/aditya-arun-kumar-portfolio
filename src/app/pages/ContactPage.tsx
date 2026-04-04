import { MotionPage } from '../components/MotionPage'

export function ContactPage() {
  return (
    <MotionPage>
      <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Let’s make something that feels expensive.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Best way to reach me is email. If you share a link and a rough
            timeline, I can reply with next steps.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:adityaarunkr@gmail.com"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white"
            >
              Email me
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-white/15 dark:bg-white/[0.02] dark:text-zinc-50 dark:hover:bg-white/[0.05]"
            >
              X / Twitter
            </a>
          </div>
        </div>

        <aside className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quick info
          </h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <p>
              <span className="text-zinc-800 dark:text-zinc-200">Email:</span> adityaarunkr@gmail.com
            </p>
            <p>
              <span className="text-zinc-800 dark:text-zinc-200">Timezone:</span> IST
            </p>
            <p>
              <span className="text-zinc-800 dark:text-zinc-200">Availability:</span> Open for
              freelance / full-time
            </p>
          </div>
        </aside>
      </section>
    </MotionPage>
  )
}

