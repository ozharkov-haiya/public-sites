---
name: verify-site
description: Verify a public site end to end (format, types, build output, i18n/SEO correctness, and a real-browser visual and animation check in every locale). Use before calling any site change done, before committing, or when the user asks to check or preview the site.
---

# Verify a site

## 1. Static checks (repo root)

```sh
pnpm verify        # prettier --check, astro check, astro build
```

Fix failures. Don't silence them. If formatting is the only failure, run `pnpm format`.

## 2. Build output (`apps/<site>/dist`)

- Every localized page exists: `index.html`, `<locale>.html`, `<slug>.html`, and `<locale>/<slug>.html`.
- `<html lang>` matches the locale. `<link rel="canonical">` and the `hreflang` alternates
  (including `x-default`) point at clean URLs (no `.html`, no `/index`, no doubled locale).
- `sitemap-0.xml` lists every page with alternates, and `robots.txt` points to the sitemap.
- JS budget: `gzip -c dist/_astro/*.js | wc -c` stays under ~15 kB for the landing page.

## 3. In the browser

Run `pnpm --filter @public-sites/<site> preview` in the background. The preview serves the real
build, which is closer to Vercel than dev.

With the chrome-devtools MCP tools, for **each locale**:

- Screenshot at 375, 768, and 1440 px widths. Check for no horizontal scroll and no overflow
  from long translations.
- Scroll to the bottom, then confirm every `[data-animate]` and every
  `[data-animate-stagger] > *` has computed `opacity: 1` (no content stuck hidden).
- Check the console for errors, and the network panel for 404s.
- Click the language switcher and confirm it lands on the same page in the other locale.
- Optional: run a Lighthouse audit and aim for 95+ in Performance, Accessibility, Best
  Practices, and SEO.
- Emulate `prefers-reduced-motion: reduce` and confirm everything is visible immediately.

Stop the preview server afterwards. Report exactly what was checked and what failed. Don't
report "verified" for steps that were skipped.
