---
name: new-site
description: Scaffold an additional public website in this monorepo (e.g. a product microsite or campaign page) that follows the same Astro + Tailwind + Motion + i18n + Vercel setup as apps/landing. Use when the user wants another site or domain.
---

# Add a new site

1. **Copy the landing site** without build output or dependencies:
   ```sh
   rsync -a --exclude node_modules --exclude dist --exclude .astro apps/landing/ apps/<name>/
   ```
2. In `apps/<name>/package.json`, set `"name": "@public-sites/<name>"`.
3. Remove landing-specific sections and copy. Keep `Container`, `Header`, `Footer`,
   `LanguageSwitcher`, `BaseLayout`, `i18n/`, `scripts/animations.ts`, and the token structure
   in `global.css`. Set the site's locales in `src/i18n/config.ts`.
4. **Extract shared code only when it's actually duplicated.** If both sites need the same
   component or helper unchanged, move it to `packages/<pkg>` (e.g. `packages/i18n`,
   `packages/ui` with `.astro` files), add it as `"@public-sites/<pkg>": "workspace:*"`, and
   import from there. Don't create packages speculatively.
5. **Root scripts:** `build`/`check` already run recursively. Add `"dev:<name>": "pnpm --filter
@public-sites/<name> dev"` to the root `package.json`, and use a different dev port
   (`server: { port: 4322 }` in astro.config).
6. **Prettier:** if the site has its own `global.css`, add a `.prettierrc.mjs` override so the
   Tailwind plugin reads that stylesheet for `apps/<name>/**`.
7. `pnpm install`, then run the `verify-site` skill.
8. **Vercel:** tell the user to create a new project in the existing Vercel team, import this
   repo, set Root Directory to `apps/<name>`, set `SITE_URL`, and attach the domain. Optionally set
   an "Ignored Build Step" of `npx turbo-ignore` or
   `git diff --quiet HEAD^ HEAD -- . ../../packages ../../pnpm-lock.yaml` so the site only
   rebuilds when its files change.
9. Update the Layout section in `CLAUDE.md`.
