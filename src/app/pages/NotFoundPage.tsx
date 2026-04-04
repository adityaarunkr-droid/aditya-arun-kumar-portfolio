import { Link } from 'react-router-dom'
import { MotionPage } from '../components/MotionPage'

export function NotFoundPage() {
  return (
    <MotionPage>
      <div className="rounded-2xl border border-zinc-200 bg-zinc-100/80 p-6 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex rounded-xl bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950"
        >
          Go home
        </Link>
      </div>
    </MotionPage>
  )
}

