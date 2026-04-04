import { useTheme } from '../theme/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[1002] flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-zinc-300/90 bg-white/90 px-2.5 text-lg leading-none shadow-md backdrop-blur-md transition hover:scale-[1.05] active:scale-[0.98] dark:border-white/12 dark:bg-zinc-950/75 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:right-6 sm:top-6 md:right-8 md:top-8"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span aria-hidden className="select-none">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
