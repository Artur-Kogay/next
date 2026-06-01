export const checkoutKeys = {
  all: ['checkout'] as const,
  user: () => [...checkoutKeys.all, 'user'] as const,
};
