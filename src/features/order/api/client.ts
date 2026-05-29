'use client';

import { useCallback } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { basketKeys } from '@/entities/basket';
import { http } from '@/shared/api/http';
import { SCHEMES_URL } from '@/shared/config';
import { getOrCreateUserUuid } from '@/shared/model';

import { orderKeys } from './keys';
import { orderItemsResponseSchema, type OrderItem } from './schemas';

export { useBasket } from '@/entities/basket';

export const useAddToBasket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      event_id: number;
      session_id: number;
      ticket_seat_id?: number;
      ticket_area_id?: number;
      ticket_type_id?: number;
      ticket_id?: number;
      sector_id?: number;
    }) => {
      const userUuid = getOrCreateUserUuid();
      await http('/order/item', {
        method: 'POST',
        body: { ...data, user_uuid: userUuid },
      });
    },
    onSuccess: () => {
      toast.success('Билет добавлен в корзину');
      void qc.invalidateQueries({ queryKey: basketKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        err && typeof err === 'object' && 'payload' in err
          ? String((err as { payload?: { message?: string } }).payload?.message)
          : 'Ошибка при добавлении в корзину';
      toast.error(msg);
    },
  });
};

export const useRemoveFromBasket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const userUuid = getOrCreateUserUuid();
      await http('/order/item', {
        method: 'DELETE',
        body: { id, user_uuid: userUuid },
      });
    },
    onSuccess: () => {
      toast.success('Билет удален из корзины');
      void qc.invalidateQueries({ queryKey: basketKeys.all });
    },
    onError: () => {
      toast.error('Ошибка при удалении из корзины');
    },
  });
};

export const useClearBasket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const userUuid = getOrCreateUserUuid();
      await http('/basket/clear', {
        method: 'POST',
        body: { user_uuid: userUuid },
      });
    },
    onSuccess: () => {
      toast.success('Корзина очищена');
      void qc.invalidateQueries({ queryKey: basketKeys.all });
    },
    onError: () => {
      toast.error('Ошибка при очистке корзины');
    },
  });
};

export const useOrderItems = (slug: string) => {
  return useQuery<OrderItem[]>({
    queryKey: orderKeys.orderItems(slug),
    queryFn: async () => {
      const userUuid = getOrCreateUserUuid();
      const raw = await http<unknown>('/session/order/item', {
        query: { slug, user_uuid: userUuid },
      });
      const result = orderItemsResponseSchema.safeParse(raw);
      if (!result.success) return [];
      return result.data.payload.order_items;
    },
  });
};

export const useSectorSchemaHtml = () => {
  const fetchSectorHtml = useCallback(async (htmlPath: string): Promise<string> => {
    if (!htmlPath) return '';
    try {
      const res = await fetch(`${SCHEMES_URL}${htmlPath}`);
      return await res.text();
    } catch {
      return '';
    }
  }, []);

  return fetchSectorHtml;
};
