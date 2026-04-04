# GitHub notepad — portfolio reference

Quick reference for **tech stack**, **how things work**, and **where to look in the repo**. For setup, deploy, and Supabase steps, see **`README.md`**.

---

## Tech stack

| Layer | Technologies |
|--------|----------------|
| **Runtime / UI** | React 19, React DOM |
| **Language** | TypeScript (~5.9) |
| **Build / dev server** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer |
| **Motion** | Framer Motion 12 |
| **Headless UI** | Radix UI (`@radix-ui/react-label`, `@radix-ui/react-slot`), Ark UI (`@ark-ui/react` — dialogs / portals) |
| **Icons** | Lucide React |
| **Class utilities** | `clsx`, `tailwind-merge`, `class-variance-authority` |
| **Optional analytics** | Supabase JS client → Postgres RPC + RLS (`site_stats`, `record_visit`) |
| **Lint** | ESLint 9 + `typescript-eslint` + React Hooks + React Refresh |
| **Atlas build (dev)** | `sharp` (via `npm run build:atlas`) |

**Path alias:** `@/` → `src/` (see `vite.config.ts`, `tsconfig.app.json`).

---

## App bootstrap & shell

1. **`src/main.tsx`** — Mounts the app: `StrictMode` → `BrowserRouter` → `ThemeProvider` → `ErrorOverlayProvider` → `App`. Calls `syncFavicon()` from `src/lib/syncFavicon.ts`.
2. **`src/App.tsx`** — Defines **lazy-loaded** route chunks and `Suspense` with `RouteFallback`. Routes live under `Layout`.
3. **`src/app/layout/Layout.tsx`** — Global shell: `PortfolioVisitProvider`, `BackgroundMusicProvider`, floating nav, mobile menu, `ThemeToggle`, `BackgroundMusicToggle`, `<main>`, footer. Uses `useScrollSpy` on the home page for section highlighting. Styles: `src/app/layout/layout-nav.css`.

---

## Routing logic

| Path | Page component | File |
|------|----------------|------|
| `/` | `HomePage` | `src/app/pages/HomePage.tsx` |
| `/work` | `WorkPage` | `src/app/pages/WorkPage.tsx` |
| `/work/:slug` | `ProjectPage` | `src/app/pages/ProjectPage.tsx` |
| `/about` | `AboutPage` | `src/app/pages/AboutPage.tsx` |
| `/contact` | `ContactPage` | `src/app/pages/ContactPage.tsx` |
| `*` | `NotFoundPage` | `src/app/pages/NotFoundPage.tsx` |

Lazy imports keep initial JS smaller; `Suspense` shows `src/app/components/RouteFallback.tsx` while chunks load.

---

## Home page logic (scroll + hero)

- **`src/app/pages/HomePage.tsx`** — Composes the long home experience (imports `home-rest` and related sections).
- **`src/app/pages/home-rest.tsx`** — Main home sections below the intro hero.
- **`src/app/components/RetroMonitorHero.tsx`** + **`retro-monitor-hero.css`** — Top hero (“monitor”) block.
- **`src/app/components/AboutIntroSection.tsx`** + **`about-intro-section.css`** — Scroll-driven “story” lane: `useScroll` (Framer Motion) targets a tall runway; sticky viewport holds the canvas + overlay.
- **`src/app/components/AboutScrollyCanvas.tsx`** — Renders scroll-scrubbed frames: prefers **`public/sequence/atlas.webp`** + **`public/sequence/atlas.json`** when present; otherwise falls back to per-frame PNGs (paths/helpers in **`src/app/lib/sequence.ts`**).
- **`src/app/lib/atlas.ts`** — Types + helpers for atlas JSON (grid or horizontal layout) and slice rects.
- **`src/app/components/AboutScrollyOverlay.tsx`** — Text overlay tied to `scrollYProgress`.
- **`scripts/build-sequence-atlas.mjs`** — Dev script: `npm run build:atlas` → writes `public/sequence/atlas.webp` and `atlas.json`.

---

## Navigation & scroll spy

- **`src/app/hooks/useScrollSpy.ts`** — On `/`, observes section IDs (`#home`, `#experience`, etc.) and reports which is active + whether the user has scrolled past the hero (nav switches column ↔ horizontal). Consumed by **`Layout.tsx`**.

---

## Theme (light / dark)

- **`src/app/theme/ThemeProvider.tsx`** — Persists preference; exposes context for toggling.
- **`src/app/components/ThemeToggle.tsx`** — Fixed control (top-right).
- **`src/index.css`** — Tailwind layers + global tokens.
- **`src/app/styles/theme-light-overrides.css`** — Light theme tweaks.

---

## Visitor counter (optional Supabase)

- **`src/components/VisitorCounter.tsx`** — `PortfolioVisitProvider` (single fetch + optional `record_visit` RPC) and `VisitorCounter` UI (hero variant, etc.). Uses Framer Motion spring for the number.
- **`src/lib/supabase.ts`** — One shared browser `SupabaseClient` (singleton) from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
- **`src/lib/visitTracking.ts`** — `localStorage` / `sessionStorage` dedupe so refreshes don’t inflate counts; “unique browser” flag.
- **`src/app/components/HeroVisitorCounter.tsx`** — Positions the hero “Portfolio views” line near the theme toggle.
- **SQL** — `supabase/migrations/001_visitor_counter.sql` — Table `site_stats`, RLS read policy, `SECURITY DEFINER` function `record_visit`.

---

## Background music (optional)

- **`src/components/BackgroundMusic.tsx`** — `BackgroundMusicProvider` + floating `BackgroundMusicToggle`; autoplay-safe `play()`, fade volume, `localStorage` mute preference.
- **`src/config/ambientAudio.ts`** — Public audio path (`/audio/ambient-loop.mp3`), target volume, fade duration, storage key.

---

## Errors & resilience

- **`src/components/ui/error.tsx`** — `ErrorOverlayProvider`, global error reporting, Ark UI dialog.
- **`src/components/app-error-boundary.tsx`** — React error boundary wiring.

---

## Content & forms (high level)

- **`src/app/content/projects.ts`** — Project metadata for work grid / detail routes.
- **`src/app/content/profileLinks.ts`** — Social / profile URLs.
- **`src/app/components/ContactProfileLinks.tsx`** — Renders profile links.
- **`src/components/ui/contact-2.tsx`** — Contact form UI (with related `input`, `textarea`, `button`, `label` under `src/components/ui/`).

---

## Utilities

- **`src/lib/utils.ts`** — `cn()` (Tailwind class merging).
- **`src/lib/syncFavicon.ts`** — Favicon sync for theme/route if applicable.

---

## Config & env

| File | Role |
|------|------|
| `vite.config.ts` | React plugin, `@` alias, manual chunks, build target |
| `tsconfig.json` / `tsconfig.app.json` | TS project + paths |
| `eslint.config.js` | Lint rules + ignores |
| `tailwind.config.js` / `postcss.config.js` | Tailwind + PostCSS |
| `.env.example` | Template for optional `VITE_*` vars (never commit real `.env`) |

---

## Public assets

| Path | Role |
|------|------|
| `public/sequence/` | Scroll frames: `atlas.webp`, `atlas.json`, or numbered PNGs |
| `public/audio/` | Optional `ambient-loop.mp3` for background music |
| `public/favicon.svg` | Favicon |

---

*Last aligned with repo layout as of this notepad file. Update this document when you add major features or move entry points.*
