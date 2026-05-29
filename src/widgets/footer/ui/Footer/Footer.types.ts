export const NAV_GROUPS = [
  {
    title: 'aboutCompany',
    links: [
      { href: '/about/company', labelKey: 'aboutCompany' },
      { href: '/about/public_offer', labelKey: 'public' },
      { href: '/about/organizations', labelKey: 'organizeshion' },
    ],
  },
  {
    title: 'howBuy',
    links: [
      { href: '/about/howtobuy', labelKey: 'purchaseinstructions' },
      { href: '/about/faq', labelKey: 'questionfooter' },
      { href: '/about/termsconditions', labelKey: 'foydalanishShartlari' },
      { href: '/about/etickets', labelKey: 'etickets' },
    ],
  },
] as const;
