---
paths:
  - 'apps/*/src/**'
  - 'apps/*/astro.config.mjs'
---

# Astro conventions

- **Component shape:** frontmatter imports, then `interface Props`, then destructure
  `Astro.props`, then markup. Sections take `locale: Locale` and call `getDictionary(locale)`.
- **Imports** use the `@/` alias (`@/components/...`, `@/i18n`), never long relative paths.
- **Sections** go in `src/components/sections/<Name>.astro`, one section per file, named after
  the design's section. Pages only compose sections inside `<BaseLayout>`.
- **Shared primitives** (`Container`, `Button`, `Icon`, ...) go in `src/components/`. Pass extra
  attributes through with `...attrs` and merge `class` with `class:list`.
- **Client scripts:** a `<script>` tag in the component (bundled, deduplicated, runs once per page).
  Query elements with `data-*` hooks, not classes. Use `is:inline` only for tiny scripts that
  must run before paint.
- **Images:** put them in `src/assets/` and render with `<Image>` / `<Picture>` from `astro:assets`
  with `widths`/`sizes`. Above-the-fold images get `loading="eager"` and `fetchpriority="high"`.
  SVG icons can be imported as components.
- **Content-heavy pages** (legal, blog) use content collections (`src/content.config.ts`) with a
  locale folder per language, not giant dictionary entries.
- **SEO** is handled by `BaseLayout` (title, description, canonical, hreflang, OG). Pass `title`
  and `description` from the dictionary. Use `noindex` for utility pages.
- Don't change `output`, `build.format`, `trailingSlash`, or `i18n.routing` without updating
  `vercel.json` and the Gotchas section of CLAUDE.md.
