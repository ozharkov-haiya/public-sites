---
name: implement-design
description: Turn a provided design (Figma link, screenshots, or a description) into production Astro sections for one of the public sites. Use when the user shares a design, mockup, or Figma frame and wants it built, or asks to restyle or replace the placeholder landing content.
---

# Implement a design

Work in this order. Each step builds on the one before.

## 1. Read the design

- Figma link: use the Figma MCP tools (authenticate if needed) to pull frames, variables,
  and assets. Screenshots: study every breakpoint provided.
- Write a short inventory before coding:
  - **Tokens:** colors, font families and weights, type scale, spacing rhythm, radii, shadows,
    easing and durations.
  - **Sections,** top to bottom, each with a PascalCase name (`Hero`, `LogoCloud`, `Pricing`, ...).
  - **Reused primitives** (buttons, badges, cards, icons).
  - **Motion:** what animates on load, on scroll, and on hover.
  - **Copy:** every string, including alt text and aria labels.
- Ask about anything the design leaves ambiguous (missing breakpoints, hover states,
  translated copy) instead of guessing, if it changes the build.

## 2. Tokens first

Update `@theme` in `apps/<site>/src/styles/global.css`. Replace the placeholder tokens rather than
adding next to them. Self-host fonts in `public/fonts/` with `@font-face`. See `.claude/rules/styling.md`.

## 3. Copy into dictionaries

Add one group per section to `src/i18n/dictionaries/en.ts`, then to every other locale. If
translations aren't provided, copy the English text, mark each copied value with a
`// TODO(i18n): translate` comment, and tell the user. Never leave a locale out.

## 4. Primitives, then sections

- Primitives go in `src/components/` (e.g. `Button.astro` with `variant` props, rendering `<a>`
  when given `href`, `<button>` otherwise).
- Sections go in `src/components/sections/<Name>.astro`. Each takes `locale` and reads only its
  own dictionary group.
- Assets go in `src/assets/` through `<Image>`/`<Picture>`. Export SVG icons from Figma and
  import them as components.
- Compose the sections in `src/pages/[...locale]/index.astro`. Delete placeholder sections that
  are no longer used, along with their dictionary keys.

## 5. Motion

Use `data-animate` / `data-animate-stagger` presets first. Add presets to
`src/scripts/animations.ts` for recurring patterns. Write bespoke Motion code in a component
`<script>` only for one-off effects. Follow `.claude/rules/animations.md` (reduced motion, no
hidden content without JS).

## 6. Verify visually

Run the `verify-site` skill. Then compare against the design at 375, 768, and 1440 px widths in
every locale. Longer translations often break layouts, so check the longest locale. Fix
differences and repeat until it matches. Report any remaining deviations to the user.
