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
  // {
  //   title: 'aboutCompany',
  //   links: [
  //     {
  //       href: {
  //         kg: '/content/public-offer-kassir',
  //         uz: '/about/public_offer',
  //         tj: '/about/public_offer',
  //         ru: '/about/public_offer',
  //       },
  //       labelKey: 'public',
  //     },
  //     {
  //       href: {
  //         kg: '/content/for-organizators-kassir',
  //         uz: '/about/organizations',
  //         tj: '/about/organizations',
  //         ru: '/about/organizations',
  //       },
  //       labelKey: 'organizeshion',
  //     },
  //     {
  //       href: {
  //         kg: '/about/logotips',
  //         uz: '/about/logotips',
  //         tj: '/about/logotips',
  //         ru: '/about/logotips',
  //       },
  //       labelKey: 'logo',
  //     },
  //   ],
  // },
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
      // {
      //   href: {
      //     kg: '/content/buy-rules-kassir',
      //     uz: '/about/howtobuy',
      //     tj: '/about/howtobuy',
      //     ru: '/about/howtobuy',
      //   },
      //   labelKey: 'purchaseinstructions',
      // },
      // {
      //   href: {
      //     kg: '/content/faq-kassir',
      //     uz: '/about/faq',
      //     tj: '/about/faq',
      //     ru: '/about/faq',
      //   },
      //   labelKey: 'questionfooter',
      // },
      // {
      //   href: { kg: '/content/ticket-usage-rules' },
      //   labelKey: 'ticketsRules',
      // },
      // {
      //   href: { kg: '/content/refund-rules-kassir' },
      //   labelKey: 'roots',
      // },
      // {
      //   href: {
      //     kg: '/content/terms-and-conditions-kassir',
      //     uz: '/about/termsconditions',
      //     tj: '/about/termsconditions',
      //     ru: '/about/termsconditions',
      //   },
      //   labelKey: 'foydalanishShartlari',
      // },
      // {
      //   href: {
      //     kg: '/content/online-tickets-kassir',
      //     uz: '/about/etickets',
      //     tj: '/about/etickets',
      //     ru: '/about/etickets',
      //   },
      //   labelKey: 'etickets',
      // },
      // {
      //   href: { kg: '/scun' },
      //   labelKey: 'checkTicket',
      // },
    ],
  },
];
