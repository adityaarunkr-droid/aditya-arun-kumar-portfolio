# Aditya Arun Kumar — Portfolio

Personal portfolio site built with **React 19**, **TypeScript**, and **Vite**. It showcases work, experience, and contact information with a scroll-driven home experience, responsive layout, and optional Supabase-backed visitor analytics.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, Tailwind CSS |
| Routing | React Router 7 |
| Motion | Framer Motion |
| Forms / overlays | Radix UI primitives, Ark UI (dialogs) |
| Backend (optional) | Supabase (`site_stats`, `record_visit` RPC) |
| Tooling | Vite 8, ESLint 9, TypeScript 5.9 |

## Project layout

```
src/
├── app/
│   ├── components/     # Feature UI (home sections, cards, nav-related)
│   ├── content/        # Static data (projects, profile links)
│   ├── hooks/          # e.g. useScrollSpy
│   ├── layout/         # Shell layout + nav styles
│   ├── lib/            # App-specific helpers (e.g. scroll sequence paths)
│   ├── pages/          # Route-level pages + page CSS
│   ├── styles/         # Global theme tweaks
│   └── theme/          # ThemeProvider (light/dark)
├── components/         # Shared UI (VisitorCounter, error overlay, shadcn-style UI)
├── lib/                # Shared utilities (cn, Supabase client, favicon, visit tracking)
├── App.tsx
├── main.tsx
└── index.css           # Tailwind + design tokens
public/
├── favicon.svg
└── sequence/           # Optional PNG frames for the scroll hero (see below)
supabase/migrations/      # SQL for visitor counter (optional)
scripts/                  # e.g. clean-vite-cache.mjs
.env.example              # Template for optional Supabase env (copy → .env locally)
```

## Getting started

```bash
npm install
npm run dev
```

- **Dev server:** [http://localhost:5173](http://localhost:5173) (Vite default port).
- **Production build:** `npm run build` → output in `dist/`.
- **Preview build:** `npm run preview`.

### Visitor counter / Supabase (optional)

The **“Portfolio views”** line counts how many times people load the site. It is **optional**: the rest of the portfolio works without it.

**What you need (only if you want live counts):**

1. **Supabase project** (free tier is fine).
2. **One-time SQL:** in Supabase → **SQL Editor**, run `supabase/migrations/001_visitor_counter.sql`. That creates `site_stats` and the `record_visit` RPC (safe: browser uses **anon** key only; no direct table writes from clients).
3. **Environment variables** (must start with `VITE_` so Vite exposes them to the client):

| Variable | Where to get it |
|----------|------------------|
| `VITE_SUPABASE_URL` | Supabase → **Project Settings** → **API** → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Same page → **anon public** key |

**Security:** use the **anon** key in the frontend only. **Never** put the **service_role** key in `.env` or in your host’s public env vars — it would be bundled or exposed and is full database access.

**Local dev:** copy `.env.example` to `.env` and fill in real values (`.env` is gitignored).

**Production (Vercel, Netlify, Cloudflare Pages, etc.):** add the **same two variables** in the host’s **Environment Variables** UI for **Production** (and Preview if you want counts there). Rebuild/redeploy after saving.

Without these variables, production hides the counter; in **development** you’ll see a short hint explaining how to turn analytics on.

### Scroll hero frames (optional)

The home hero can scrub through PNGs in `public/sequence/` (see `src/app/lib/sequence.ts`).

**Performance:** Loading ~95 separate PNGs causes many network requests. Prefer a **single atlas** (one WebP + one JSON):

1. Put `frame_000_…png`, `frame_001_…`, … in `public/sequence/` (names must match `getFrameSrc` / `sequence.ts`).
2. Run:

   ```bash
   npm run build:atlas
   ```

   This writes `public/sequence/atlas.webp` and `public/sequence/atlas.json` (frames packed in a **grid** so the file stays within WebP size limits). Commit those (or generate in CI before `vite build`).

3. At runtime the canvas loads **only** `atlas.json` + `atlas.webp` (2 requests). If `atlas.json` is missing, it falls back to **one request per frame** (slower).

`sharp` is a devDependency used only by `build:atlas`.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm run dev:fresh` | Clear Vite cache + dev with `--force` |
| `npm run build:atlas` | Stitch `public/sequence/frame_*.png` → `atlas.webp` + `atlas.json` |

## Deploy

1. `npm run build` → upload or connect the repo so the host runs that command; artifact is **`dist/`**.
2. **SPA routing:** configure the host to serve `index.html` for unknown paths (fallback).
3. **Visitor counter:** if you use it, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on the host (see above). No other API keys are required for this template.
4. **Subpath deploy** (e.g. `username.github.io/repo/`): set `base` in `vite.config.ts` and redeploy.

## License

Private / personal portfolio — adjust as you prefer for your public repo.
