const OFFICE_GIF =
  'https://media1.tenor.com/m/QdrfMv2CxRgAAAAC/office.gif'
const TENOR_SOURCE = 'https://tenor.com/view/office-gif-24798470'

function IconArrowUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

export function HomeEndBookmark() {
  return (
    <section
      className="content-section home-end-bookmark border-t border-zinc-200/80 dark:border-white/[0.06]"
      aria-labelledby="home-end-bookmark-title"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-3 text-center sm:px-0">
        <figure className="w-full max-w-[min(100%,420px)] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
          <img
            src={OFFICE_GIF}
            alt="The Office: two coworkers in suits celebrating with hands in the air"
            className="mx-auto block h-auto w-full object-cover"
            width={498}
            height={280}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="border-t border-zinc-100 px-3 py-2 text-[10px] text-zinc-500 dark:border-white/5">
            GIF via{' '}
            <a
              href={TENOR_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-400"
            >
              Tenor
            </a>
          </figcaption>
        </figure>

        <h2
          id="home-end-bookmark-title"
          className="mt-6 text-base font-medium leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg"
        >
          You&apos;ve made it this far — now head back up.
        </h2>

        <button
          type="button"
          className="mt-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-md transition hover:-translate-y-0.5 hover:border-lime-500/45 hover:bg-zinc-50 hover:text-lime-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:border-white/15 dark:bg-white/[0.06] dark:text-zinc-200 dark:shadow-[0_8px_28px_rgba(0,0,0,0.4)] dark:hover:border-lime-300/40 dark:hover:bg-white/[0.1] dark:hover:text-lime-200 dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.45),0_0_24px_-8px_rgba(190,242,100,0.25)] dark:focus-visible:ring-lime-400/50 dark:focus-visible:ring-offset-black"
          title="Back to top"
          aria-label="Back to top"
          onClick={() => {
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            window.history.replaceState(null, '', '/')
          }}
        >
          <IconArrowUp className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
