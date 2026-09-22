import type { Dictionary } from './en';

const da: Dictionary = {
  meta: {
    siteName: 'Haiya',
    title: 'Haiya',
    description: 'Midlertidig beskrivelse. Erstattes, når teksten er klar.',
  },
  a11y: {
    skipToContent: 'Gå til indhold',
    mainNav: 'Hovedmenu',
    languageSwitcher: 'Vælg sprog',
  },
  nav: {
    features: 'Funktioner',
    contact: 'Kontakt',
  },
  hero: {
    eyebrow: 'Kommer snart',
    title: 'Et roligt sted at begynde',
    subtitle: 'Dette er en midlertidig hero-sektion. Det rigtige design erstatter den.',
    cta: 'Kontakt os',
  },
  features: {
    title: 'Det får du',
    items: [
      {
        title: 'Statisk som standard',
        body: 'Ren HTML og CSS. JavaScript kun hvor det er nødvendigt.',
      },
      { title: 'Alle sprog', body: 'Hver side bygges én gang pr. sprog.' },
      {
        title: 'Animationer med omtanke',
        body: 'Animationer slås fra, når reduceret bevægelse er valgt.',
      },
    ],
  },
  footer: {
    copyright: '© {year} Haiya. Alle rettigheder forbeholdes.',
  },
  notFound: {
    title: 'Siden blev ikke fundet',
    body: 'Siden, du leder efter, findes ikke eller er flyttet.',
    back: 'Tilbage til forsiden',
  },
};

export default da;
