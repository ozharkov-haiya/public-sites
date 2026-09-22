# public-sites

Monorepo for our public marketing websites. Each site is a **static Astro site** styled with
**Tailwind CSS v4**, animated with **Motion**, translated with Astro's built-in **i18n routing**,
and deployed to **Vercel**. There is no React, Vue, or other UI framework. Pages are plain HTML
and CSS, with small vanilla TypeScript scripts only where needed.

## Layout

```
apps/
  landing/                 # the landing site (one Vercel project, Root Directory = apps/landing)
    astro.config.mjs       # site URL, i18n, sitemap, Tailwind plugin
    vercel.json            # clean URLs, cache and security headers
    src/
      i18n/
        config.ts          # locales, defaultLocale, localeNames (no astro:* imports)
        index.ts           # getDictionary, format, localizePath/Url, getLocaleStaticPaths
        dictionaries/      # en.ts is the source of truth; other locales are typed against it
      layouts/BaseLayout.astro   # <head>, SEO/hreflang, header/footer, animation script
      components/          # shared building blocks (Container, Header, Footer, LanguageSwitcher)
        sections/          # page sections (Hero, Features, ...), one file each
      pages/
        [...locale]/       # every localized page lives here; one file serves all locales
        404.astro          # single static 404 (default locale)
        robots.txt.ts
      scripts/animations.ts  # data-attribute scroll reveals (Motion)
      styles/global.css      # Tailwind entry + design tokens (@theme)
packages/                  # shared code; only create when a SECOND site needs it
```

## Commands (run from the repo root)

| Command        | What it does                                                    |
| -------------- | --------------------------------------------------------------- |
| `pnpm dev`     | Landing dev server on http://localhost:4321                     |
| `pnpm build`   | Build every site to `apps/*/dist`                               |
| `pnpm preview` | Serve the built landing site                                    |
| `pnpm check`   | `astro check` (TypeScript + .astro diagnostics)                 |
| `pnpm format`  | Prettier (with Astro and Tailwind class-sorting plugins)        |
| `pnpm verify`  | format:check + check + build. **Run before calling work done.** |

Target one site with `pnpm --filter @public-sites/<name> <script>`.

## Non-negotiable rules

1. **No UI frameworks.** Do not add React/Vue/Svelte/Solid/Preact or `@astrojs/<framework>`
   integrations. Interactivity is a `<script>` in the `.astro` component (Astro bundles it) or a
   module in `src/scripts/`. Prefer CSS or native HTML (`<details>`, `<dialog>`, `popover`) first.
2. **No hardcoded user-facing text.** Every visible string, `alt`, `aria-label`, and meta value
   comes from `src/i18n/dictionaries/*`. Add the key to `en.ts` first, then to every other
   locale. `pnpm check` fails if a locale is missing a key.
3. **Localized pages live in `src/pages/[...locale]/`** and export
   `getStaticPaths() { return getLocaleStaticPaths(); }`. Never duplicate a page per locale.
4. **Internal links go through `localizePath(locale, '/path')`.** Never write `/da/...` by hand.
5. **Styling is Tailwind utilities + tokens from `@theme` in `global.css`.** No raw hex values
   or magic numbers in markup when a token fits. Add new tokens instead. No CSS-in-JS, no
   extra CSS frameworks. A scoped `<style>` block is fine for things utilities can't express.
6. **Animations respect `prefers-reduced-motion`** and never hide content when JS is off. Use
   the `data-animate` attributes (see `.claude/rules/animations.md`) before writing custom code.
7. **Stay static.** `output: 'static'`, no adapter. If a form/API is ever needed, raise it
   first. It likely means a Vercel Function or a third-party form endpoint, not SSR.
8. **Accessibility:** semantic landmarks, one `<h1>` per page, visible focus, real `<a>`/`<button>`,
   meaningful `alt`, and color contrast of at least 4.5:1 for body text.
9. **Performance budget:** the landing page should ship < 15 kB gzipped JS. Images go through
   `astro:assets` (`<Image>`/`<Picture>`) from `src/assets/`, not `public/` (only files that need
   a fixed URL go there: favicons, `og` images, and similar).

Detailed, path-scoped guidance lives in `.claude/rules/`. Repeatable workflows live in
`.claude/skills/` (implement a design, add a page, add a locale, add a new site, verify).

## Deployment (Vercel)

- One Vercel project per site. Set **Root Directory** to `apps/<site>`. The framework preset
  (Astro) and pnpm are detected automatically. Node version comes from `engines` (>= 22.12).
- Every push gets a preview deployment, and `main` deploys to production. Do not run
  `vercel --prod` from here.
- `SITE_URL` (for example `https://haiya.dk`) should be set in the Vercel project for
  production. Without it, `VERCEL_PROJECT_PRODUCTION_URL` is used for canonical/hreflang/sitemap URLs.

## Gotchas

- `build.format: 'file'` + `trailingSlash: 'never'` + Vercel `cleanUrls` go together. Changing
  one breaks the others (duplicate URLs or 404s on `/da`).
- During a static build `Astro.url.pathname` is a file path (`/da.html`). Use `getRoutePath()`
  instead of parsing it yourself.
- `src/i18n/config.ts` is imported by `astro.config.mjs`, so it must not import `astro:*` modules.
- The Prettier Tailwind plugin reads `apps/landing/src/styles/global.css` (see `.prettierrc.mjs`).
