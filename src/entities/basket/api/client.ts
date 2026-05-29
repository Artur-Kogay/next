'use client';

import { useQuery } from '@tanstack/react-query';

import { http, unwrapPayload } from '@/shared/api/http';
import { env } from '@/shared/config';
import { getOrCreateUserUuid } from '@/shared/model';

import { basketKeys } from './keys';
import { basketResponseSchema, type Basket } from './schemas';

export const useBasket = () => {
  return useQuery<Basket>({
    queryKey: basketKeys.all,
    queryFn: async () => {
      const userUuid = getOrCreateUserUuid();
      const raw = await http<unknown>('/basket', { query: { user_uuid: userUuid } });
      const payload = unwrapPayload(raw);
      const result = basketResponseSchema.safeParse({ payload });
      if (!result.success) {
        if (env.NEXT_PUBLIC_APP_ENV !== 'production') {
          console.error('[useBasket] parse error', result.error.flatten(), payload);
        }
        return { basket: [], timer: 0 };
      }
      return result.data.payload;
    },
    refetchInterval: 10_000,
  });
};
