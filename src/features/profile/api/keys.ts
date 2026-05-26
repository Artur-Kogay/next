export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  orders: (status: 'completed' | 'pending_for_payment') =>
    [...profileKeys.all, 'orders', status] as const,
};
