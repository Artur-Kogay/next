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
    title: 'aboutCompany',
    links: [
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'aboutProject',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'partners',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'public',
      },
      {
        href: {
          kg: '/',
          uz: '/',
          tj: '/',
          ru: '/',
        },
        labelKey: 'logo',
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
