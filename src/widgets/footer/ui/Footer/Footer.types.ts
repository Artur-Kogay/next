export type FooterLinkHref = Partial<Record<string, string>>;

export interface FooterLink {
  href: FooterLinkHref;
  labelKey: string;
}

export interface FooterGroup {
  title: string;
  links: readonly FooterLink[];
}

export const NAV_GROUPS: readonly FooterGroup[] = [
  {
    title: 'navigation',
    links: [
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'main',
      },
      {
        href: {
          kg: '/allStars',
          uz: '/allStars',
          tj: '/allStars',
          ru: '/allStars',
        },
        labelKey: 'stars',
      },
      {
        href: {
          kg: '/catalog',
          uz: '/catalog',
          tj: '/catalog',
          ru: '/catalog',
        },
        labelKey: 'catalog',
      },
    ],
  },
  {
    title: 'rules',
    links: [
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'userAgreement',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'returnPolicy',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'delivery',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'forHolders',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'privacyPolicy',
      },
    ],
  },
];
