import { MotionPage } from '../components/MotionPage'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../content/projects'

export function WorkPage() {
  return (
    <MotionPage>
      <section>
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
            Work
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Cool stuff I’ve built
          </h1>
          <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
            A mix of personal experiments and shipped product work. Click a
            project for the breakdown.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </MotionPage>
  )
}

