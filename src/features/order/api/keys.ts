export const orderKeys = {
  all: ['order'] as const,
  session: (slug: string) => [...orderKeys.all, 'session', slug] as const,
  basket: () => [...orderKeys.all, 'basket'] as const,
  orderItems: (slug: string) => [...orderKeys.all, 'items', slug] as const,
};
