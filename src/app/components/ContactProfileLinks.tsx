import { PROFILE_LINKS } from '../content/profileLinks'
import { cn } from '@/lib/utils'

const linkBase =
  'group relative isolate inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ' +
  'border border-zinc-300/80 bg-white text-zinc-600 shadow-[0_2px_12px_rgba(0,0,0,0.08)] ' +
  'transition-all duration-200 ease-out ' +
  'hover:-translate-y-1 hover:border-lime-500/50 hover:bg-zinc-50 hover:text-zinc-900 ' +
  'hover:shadow-[0_8px_28px_rgba(0,0,0,0.12),0_0_28px_-6px_rgba(132,204,22,0.25)] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/50 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 ' +
  'active:translate-y-0 active:scale-[0.98] ' +
  'dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-zinc-300 dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)] ' +
  'dark:hover:border-lime-300/35 dark:hover:bg-white/[0.07] dark:hover:text-white ' +
  'dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.45),0_0_28px_-6px_rgba(190,242,100,0.35)] ' +
  'dark:focus-visible:ring-lime-400/55 dark:focus-visible:ring-offset-black ' +
  'sm:h-[52px] sm:w-[52px]'

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-[22px] w-[22px] sm:h-6 sm:w-6', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-[22px] w-[22px] sm:h-6 sm:w-6', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.833.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.606 9.606 0 0112 6.098c.85.004 1.705.114 2.504.336 1.909-1.291 2.747-1.022 2.747-1.022.546 1.379.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  )
}

function IconLeetCode({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-[22px] w-[22px] sm:h-6 sm:w-6', className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  )
}

const items = [
  {
    href: PROFILE_LINKS.linkedin,
    label: 'LinkedIn',
    Icon: IconLinkedIn,
  },
  {
    href: PROFILE_LINKS.github,
    label: 'GitHub',
    Icon: IconGitHub,
  },
  {
    href: PROFILE_LINKS.leetcode,
    label: 'LeetCode',
    Icon: IconLeetCode,
  },
] as const

export function ContactProfileLinks() {
  return (
    <ul
      className="mt-2 flex list-none flex-wrap items-center gap-3 p-0 sm:gap-4"
      aria-label="Professional profiles"
    >
      {items.map(({ href, label, Icon }) => (
        <li key={label} className="m-0 p-0">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBase}
            title={label}
            aria-label={`${label} (opens in a new tab)`}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden
            />
            <Icon className="relative z-[1]" />
          </a>
        </li>
      ))}
    </ul>
  )
}
