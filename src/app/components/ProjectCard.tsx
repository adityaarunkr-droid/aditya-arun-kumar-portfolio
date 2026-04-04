import { Link } from 'react-router-dom'
import type { Project } from '../content/projects'
import { cn } from '@/lib/utils'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none dark:hover:bg-white/[0.06]"
    >
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div
          className={cn(
            'absolute -inset-24 bg-gradient-to-br blur-3xl',
            project.color
          )}
        />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            {project.kind} · {project.year}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-zinc-300">{project.tagline}</p>
        </div>
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 transition group-hover:bg-zinc-200 dark:bg-white/5 dark:ring-white/10 dark:group-hover:bg-white/10">
          <span className="text-zinc-600 dark:text-zinc-200">↗</span>
        </span>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {project.highlights.slice(0, 3).map((h) => (
          <span
            key={h}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 ring-1 ring-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10"
          >
            {h}
          </span>
        ))}
      </div>
    </Link>
  )
}

