# public-sites

Our public marketing websites. Each site is a static site built with [Astro](https://astro.build),
styled with [Tailwind CSS v4](https://tailwindcss.com), animated with [Motion](https://motion.dev),
available in multiple languages, and hosted on [Vercel](https://vercel.com). There is no React or
other UI framework: the build produces plain HTML and CSS, plus a few kilobytes of JavaScript.

| Site    | Path                           | Locales              | Vercel Root Directory |
| ------- | ------------------------------ | -------------------- | --------------------- |
| Landing | [`apps/landing`](apps/landing) | `en` (default), `da` | `apps/landing`        |

- [Stack](#stack)
- [Prerequisites](#prerequisites)
- [Run locally](#run-locally)
- [Develop](#develop)
- [Test](#test)
- [Deploy](#deploy)
- [Troubleshooting](#troubleshooting)

## Stack

| Layer          | Tool                                                 | Role                                                         |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| Site generator | Astro 7                                              | Renders `.astro` files to static HTML at build time          |
| Styling        | Tailwind CSS v4                                      | Utility classes; design tokens are defined in CSS (`@theme`) |
| Animation      | Motion (`motion/mini`)                               | Scroll-reveal animations through `data-animate` attributes   |
| i18n           | Astro i18n routing + typed dictionaries              | Builds every page once per language                          |
| Hosting        | Vercel                                               | Serves the static build from its CDN, with preview deploys   |
| Tooling        | pnpm workspace, TypeScript, Prettier, GitHub Actions | Installs, type checks, formats, runs CI                      |

All of the work happens at build time. `pnpm build` renders every page in every language to
`apps/<site>/dist/`, and Vercel serves those files as they are. No server code runs per request.

## Prerequisites

- **Node.js ≥ 22.12.** `.nvmrc` pins Node 24, so `nvm use` or `fnm use` picks it up.
- **pnpm 10.** The version is pinned in `package.json` under `packageManager`. Running
  `corepack enable` once makes the right pnpm version available automatically.

```sh
git clone <repo-url> public-sites
cd public-sites
corepack enable
pnpm install
```

Recommended editor extensions are in `.vscode/extensions.json` (Astro, Tailwind CSS IntelliSense,
Prettier). WebStorm supports Astro and Tailwind out of the box.

## Run locally

Run all commands from the repository root.

### Dev server (day-to-day work)

```sh
pnpm dev
```

- English: http://localhost:4321
- Danish: http://localhost:4321/da

The dev server reloads on save. Extra flags are passed through to Astro:

```sh
pnpm dev --port 4000        # use another port
pnpm dev --host             # expose on your network to test on a phone
```

### Production build and preview (what Vercel will serve)

```sh
pnpm build      # writes apps/landing/dist/
pnpm preview    # serves dist/ at http://localhost:4321
```

Use the preview before deploying anything that affects animations, fonts, images, or URLs. It
serves the real build output, which can differ from the dev server.

### Environment variables

| Variable   | Used for                                                                  | Default                                                            |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `SITE_URL` | Absolute URLs in canonical, hreflang, Open Graph, sitemap, and robots.txt | Vercel's production URL on Vercel, `http://localhost:4321` locally |

`astro.config.mjs` reads `SITE_URL` from the real environment, **not from a `.env` file**. To
build with it locally, set it inline:

```sh
SITE_URL=https://haiya.dk pnpm build
```

## Develop

### Project structure

```
apps/landing/
├── astro.config.mjs            # site URL, i18n, sitemap, Tailwind
├── vercel.json                 # clean URLs, caching and security headers
├── public/                     # files served as-is (favicon, fonts, og images)
└── src/
    ├── pages/
    │   ├── [...locale]/        # localized pages; each file is built for every locale
    │   ├── 404.astro
    │   └── robots.txt.ts
    ├── layouts/BaseLayout.astro    # <html>, <head>, SEO tags, header and footer
    ├── components/             # Container, Header, Footer, LanguageSwitcher, ...
    │   └── sections/           # page sections: Hero, Features, ...
    ├── i18n/
    │   ├── config.ts           # list of locales and the default locale
    │   ├── index.ts            # getDictionary, localizePath, format, ...
    │   └── dictionaries/       # en.ts (source of truth), da.ts, ...
    ├── scripts/animations.ts   # data-animate scroll reveals
    └── styles/global.css       # Tailwind entry point and design tokens
```

### Common tasks

**Change text.** Edit `src/i18n/dictionaries/en.ts` and the same key in every other locale file.
Components never contain user-facing text directly.

```astro
---
const t = getDictionary(locale);
---

<h1>{t.hero.title}</h1>
<p>{format(t.footer.copyright, { year: 2026 })}</p>
<!-- "© {year} …" → "© 2026 …" -->
```

**Add a section.** Create `src/components/sections/<Name>.astro`. Give it a `locale` prop, add a
`<name>` group to the dictionaries, and place the section in `src/pages/[...locale]/index.astro`.

**Add a page.** Create `src/pages/[...locale]/<slug>.astro` and export
`getStaticPaths() { return getLocaleStaticPaths(); }`. This produces `/<slug>` and
`/da/<slug>`. Link to pages with `localizePath(locale, '/<slug>')`, never with hardcoded `/da/...`
paths.

**Add a language.** Add the code to `locales` in `src/i18n/config.ts`, create
`dictionaries/<code>.ts` typed as `Dictionary`, and register it in `src/i18n/index.ts`. Routing,
the sitemap, and the language switcher pick it up automatically.

**Change the look.** Edit the tokens in `src/styles/global.css`:

```css
@theme {
  --color-brand: oklch(0.55 0.2 265); /* → bg-brand, text-brand, border-brand, … */
  --font-display: 'Our Font', sans-serif; /* → font-display */
}
```

**Animate something.** Add a data attribute. No JavaScript is needed:

```html
<h2 data-animate="fade-up">…</h2>
<p data-animate="fade-in" data-animate-delay="0.2">…</p>
<ul data-animate-stagger="fade-up">
  <li>…</li>
  <li>…</li>
</ul>
```

Presets are `fade-up`, `fade-in`, and `scale-in`. Add new presets in `src/scripts/animations.ts`.
Animations are skipped for users who prefer reduced motion, and content stays visible when
JavaScript is off.

**Add images.** Put them in `src/assets/` and render them with `<Image>` or `<Picture>` from
`astro:assets`, which optimize them at build time. Use `public/` only for files that need a fixed
URL.

### Conventions

The full rules are in [`CLAUDE.md`](CLAUDE.md), and the detailed guides are in
[`.claude/rules/`](.claude/rules). The key rules:

- No UI frameworks (React, Vue, Svelte, …).
- No hardcoded user-facing text.
- Use Tailwind tokens instead of raw values.
- Animations must respect reduced motion.
- The site stays static.

Formatting is handled by Prettier, which also sorts Tailwind classes. Run `pnpm format`, or let
your editor format on save.

### Working with Claude Code

This repo is set up for [Claude Code](https://claude.com/claude-code):

- **`CLAUDE.md`**: stack, commands, and rules. Claude loads it automatically.
- **`.claude/rules/`**: guides for i18n, styling, animations, and Astro. Each guide loads when
  Claude works on matching files.
- **`.claude/skills/`**: step-by-step workflows:
  - `implement-design`
  - `add-page`
  - `add-locale`
  - `new-site`
  - `verify-site`

  Ask for the task ("build this design", "add a pricing page") and Claude uses the matching skill.

- **`.claude/settings.json`**: formats every file Claude edits and blocks Claude from deploying
  to production.

## Test

The sites are static and contain almost no logic, so there are no unit tests. Correctness is
checked by the type checker, the build, and a review of the built site in a browser.

### Automated checks

```sh
pnpm verify
```

| Step                | Command             | Catches                                                                |
| ------------------- | ------------------- | ---------------------------------------------------------------------- |
| Formatting          | `pnpm format:check` | Unformatted files, unsorted Tailwind classes                           |
| Types / diagnostics | `pnpm check`        | Type errors, invalid props, **missing or extra translation keys**      |
| Build               | `pnpm build`        | Broken imports, failing pages, invalid routes, broken image references |

Run `pnpm verify` before every push. CI (`.github/workflows/ci.yml`) runs the same command on every
pull request and on every push to `main`.

### Manual checks

After a visual change, run `pnpm build && pnpm preview`, then check every locale:

- [ ] The layout works at 375 px (mobile), 768 px (tablet), and 1440 px (desktop), with no
      horizontal scroll. Check the longest translation.
- [ ] Every animated element shows up after scrolling through the page.
- [ ] With reduced motion on, all content is visible immediately. In Chrome DevTools, open the
      Rendering panel and set `prefers-reduced-motion` to `reduce`.
- [ ] The language switcher opens the same page in the other language.
- [ ] The browser console shows no errors, and the Network panel shows no 404s.
- [ ] Lighthouse (Chrome DevTools) scores 95+ for Performance, Accessibility, Best Practices,
      and SEO.

To inspect SEO output, open the built files directly. For example, check that `<html lang>`,
`<link rel="canonical">`, and the `hreflang` links in `apps/landing/dist/da.html` point at clean
URLs. Also check `dist/sitemap-0.xml`.

Every pull request also gets a Vercel preview deployment. It's the best place for a final check
and for sharing work with others.

## Deploy

Deployments go through Git. Nothing is deployed from a laptop.

```
feature branch / pull request ──▶ Vercel preview deployment (unique URL, not indexed by search engines)
merge to main                 ──▶ Vercel production deployment (the site's domain)
```

### First-time setup (once per site)

1. In the Vercel dashboard, open our team and choose **Add New → Project**. Import this
   repository.
2. Set **Root Directory** to `apps/landing`. Keep the defaults for everything else:
   - **Framework preset:** Astro (from `vercel.json`)
   - **Install command:** `pnpm install` (from the workspace lockfile)
   - **Build command:** `astro build`
   - **Output directory:** `dist`
   - **Node.js version:** taken from `engines` in `package.json`
3. Under **Settings → Environment Variables**, add `SITE_URL` (for example
   `https://haiya.dk`) for the **Production** environment.
4. Under **Settings → Domains**, attach the domain and follow Vercel's DNS instructions.
5. Under **Settings → Git**, confirm that the production branch is `main`.

### Everyday deploys

1. Push a branch and open a pull request. CI runs `pnpm verify`, and Vercel posts a preview URL
   on the PR.
2. Review the preview.
3. Merge to `main`. Vercel builds and publishes to production, usually within a minute.

### Rollback

To roll back, go to **Deployments** in the Vercel dashboard, pick an earlier production
deployment, and choose **Instant Rollback**. The switch is immediate and nothing is rebuilt. Then
revert the bad commit on `main`, so the next deploy doesn't bring the problem back.

### What `vercel.json` configures

- **`cleanUrls`:** `da.html` is served at `/da`, and `about.html` at `/about`.
- **Caching:** hashed build assets in `/_astro/*` are cached for one year. HTML is always
  revalidated.
- **Security headers:** `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and
  `Permissions-Policy`.

### Adding another site

Each site is its own Vercel project that points at its own `apps/<name>` folder. See
[`.claude/skills/new-site/SKILL.md`](.claude/skills/new-site/SKILL.md) for the steps.

## Troubleshooting

| Symptom                                              | Fix                                                                                                                                           |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check` reports a missing property in `da.ts`   | A key was added to `en.ts` but not to that locale. Add it there.                                                                              |
| Canonical or sitemap URLs show `localhost` on Vercel | `SITE_URL` isn't set for that environment. Set it in the project settings.                                                                    |
| An element stays invisible                           | It has `data-animate` but the script didn't run. Check the console for errors. Elements added after page load aren't picked up automatically. |
| `/da/` redirects to `/da`                            | Expected: URLs have no trailing slash.                                                                                                        |
| Tailwind classes not sorted or formatted             | Run `pnpm format`. The Prettier plugin reads `apps/landing/src/styles/global.css`.                                                            |
| Wrong pnpm version                                   | Run `corepack enable`. The version is pinned in `package.json` (`packageManager`).                                                            |
