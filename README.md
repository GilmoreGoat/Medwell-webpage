# MEDWELL @ UCSD — Landing Page

A pure React + Vite SPA with Tailwind CSS and Framer Motion. No SSR — 100% statically exportable for GitHub Pages.

## Stack

- **Vite** (SPA, static build)
- **React 18**
- **Tailwind CSS**
- **Framer Motion** (splash + text reveals + custom cursor)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  App.jsx                     AnimatePresence + splash → hero orchestration
  main.jsx                    React entry
  index.css                   Tailwind + mesh-sunset background + cursor CSS var
  context/CursorContext.jsx   Cursor hover + intensity state (scroll-dimmable)
  components/
    LoadingScreen.jsx         Dusk-blue splash, flame draw-in, upward wipe
    Navbar.jsx                Transparent minimal nav (logo + socials + Join Us)
    Hero.jsx                  Headline + subhead + "Join the Collective" CTA
    FlameMark.jsx             Inline animatable flame SVG
    CustomCursor.jsx          Spring-followed flame cursor + useHoverCursor hook
  assets/
    cursor-flame.svg          Replace with your own cursor asset
    flame-logo.svg            Replace with your own logo asset
public/
  favicon.svg
```

### Swapping art

- **Cursor image** — replace `src/assets/cursor-flame.svg` with any SVG/PNG.
  The import in `CustomCursor.jsx` stays the same.
- **Logo** — replace `src/assets/flame-logo.svg`, or edit the inline path in
  `FlameMark.jsx` (inline is required for the self-drawing animation).

### Scroll-linked cursor

The cursor dims as the user scrolls. Wiring lives in `App.jsx`:

```js
setIntensity(1 - ratio * 0.65); // 1.0 bright → 0.35 dim
```

Consumers read `intensity` via `useCursor()`, and it's also exposed as the
CSS variable `--cursor-glow` on `<html>` for any downstream CSS effects.

## Deploy to GitHub Pages

Two paths — pick ONE.

### Option A — GitHub Actions (recommended)

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Commit + push to `main`. The included
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
   publishes `dist/` automatically.
3. Site goes live at `https://<user>.github.io/Medwell-webpage/`.

### Option B — `gh-pages` branch (manual)

```bash
npm run deploy     # builds and pushes dist/ to the gh-pages branch
```

Then in repo **Settings → Pages**, set **Source: Deploy from a branch** →
`gh-pages` / `/ (root)`.

### Base path

`vite.config.js` sets `base: '/Medwell-webpage/'` — required when the repo is
served at `https://<user>.github.io/Medwell-webpage/`.

- **Custom domain or user/organization site** (`<user>.github.io` root): set
  `base: '/'` in `vite.config.js`.
- **Renamed repo**: change the `base` to match the new path.

### SPA 404 fallback (optional)

GitHub Pages has no client-side routing, but it serves `404.html` on unknown
paths. If you later add client routes, copy `dist/index.html` to
`dist/404.html` after build so deep links work.
