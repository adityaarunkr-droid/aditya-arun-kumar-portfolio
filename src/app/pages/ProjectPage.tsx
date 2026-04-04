import { Link, useParams } from 'react-router-dom'
import { MotionPage } from '../components/MotionPage'
import { getProject } from '../content/projects'
import { cn } from '@/lib/utils'

export function ProjectPage() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined

  if (!project) {
    return (
      <MotionPage>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Project not found
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            That link doesn’t match a project yet.
          </p>
          <Link
            to="/work"
            className="mt-4 inline-flex rounded-xl bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950"
          >
            Back to work
          </Link>
        </div>
      </MotionPage>
    )
  }

  return (
    <MotionPage>
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
        <div className="pointer-events-none absolute inset-0">
          <div
            className={cn(
              'absolute -inset-24 bg-gradient-to-br blur-3xl opacity-35',
              project.color
            )}
          />
        </div>

        <div className="relative p-6 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-300/80">
            {project.kind} · {project.year}
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-200/90 md:text-lg">
            {project.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-800 ring-1 ring-zinc-200 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10"
              >
                {h}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/work"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-white/15 dark:bg-white/[0.02] dark:text-zinc-50 dark:hover:bg-white/[0.05]"
            >
              ← Back
            </Link>

            <div className="flex flex-wrap gap-3">
              {(project.links ?? []).map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white"
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-white/10 dark:bg-white/[0.03]">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Breakdown
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Replace this section with your real case study: your role, the
              challenge, constraints, and what you shipped. This template is
              intentionally editorial — big type, clean spacing, motion on page
              transitions — similar energy to `thibaut.cool`.
            </p>
          </div>
        </div>
        <aside className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Stack
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <li>React + Vite</li>
            <li>Tailwind CSS</li>
            <li>Framer Motion</li>
          </ul>
        </aside>
      </section>
    </MotionPage>
  )
}

