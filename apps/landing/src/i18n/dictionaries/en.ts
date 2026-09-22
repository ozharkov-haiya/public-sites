// Source of truth for UI copy. Every other locale is type-checked against
// this shape, so add keys here first. Use `{name}` for interpolated values.
const en = {
  meta: {
    siteName: 'Haiya',
    title: 'Haiya',
    description: 'Placeholder description. Replace once the copy is ready.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main',
    languageSwitcher: 'Choose language',
  },
  nav: {
    features: 'Features',
    contact: 'Contact',
  },
  hero: {
    eyebrow: 'Coming soon',
    title: 'A calm place to start building',
    subtitle: 'This is a placeholder hero. The real design will replace it.',
    cta: 'Get in touch',
  },
  features: {
    title: 'What you get',
    items: [
      { title: 'Static by default', body: 'Plain HTML and CSS. JavaScript only where needed.' },
      { title: 'Every language', body: 'Each page is built once per locale.' },
      {
        title: 'Motion that respects users',
        body: 'Animations turn off when reduced motion is on.',
      },
    ],
  },
  footer: {
    copyright: '© {year} Haiya. All rights reserved.',
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist or has moved.',
    back: 'Back to the home page',
  },
};

export type Dictionary = typeof en;

export default en;
