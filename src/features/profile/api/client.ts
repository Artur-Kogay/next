'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiCall, http } from '@/shared/api';

import { profileKeys } from './keys';
import {
  ordersListSchema,
  profileSchema,
  type Order,
  type ProfileResponse,
  type RefundInput,
  type UpdateProfileInput,
} from './schemas';

const unwrap = (raw: unknown): unknown =>
  typeof raw === 'object' && raw !== null && 'payload' in raw ? raw.payload : raw;

export const useProfileData = (enabled = true) =>
  useQuery<ProfileResponse>({
    queryKey: profileKeys.me(),
    enabled,
    queryFn: () =>
      apiCall(async () => {
        const raw = await http<unknown>('/user');
        return profileSchema.parse(unwrap(raw));
      }),
    staleTime: 60_000,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, UpdateProfileInput>({
    mutationFn: (input) =>
      apiCall(async () => {
        await http('/user', { method: 'POST', body: input });
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};

export const useOrders = (status: 'completed' | 'pending_for_payment', enabled = true) =>
  useQuery<Order[]>({
    queryKey: profileKeys.orders(status),
    enabled,
    queryFn: () =>
      apiCall(async () => {
        const raw = await http<unknown>('/order', { query: { status } });
        const payload = unwrap(raw) ?? [];
        console.log(`[profile/orders] status=${status}`, { raw, payload });
        const parsed = ordersListSchema.safeParse(payload);
        if (!parsed.success) {
          console.error(`[profile/orders] Zod error for status=${status}`, parsed.error.issues);
        }
        return parsed.success ? parsed.data : [];
      }),
    staleTime: 30_000,
  });

export const useRefundOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RefundInput>({
    mutationFn: (input) =>
      apiCall(async () => {
        await http('/refund/client', { method: 'POST', body: input });
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
