'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { http, unwrapPayload } from '@/shared/api/http';
import { getOrCreateUserUuid } from '@/shared/model';

import { checkoutKeys } from './keys';
import { payResponseSchema, type PayInput, type PayResponse } from './schemas';

export interface CheckoutUser {
  full_name: string;
  email: string;
  phone_number: string;
  birthday: string;
  gender: string;
}

const toDateInput = (raw: string): string => {
  if (!raw) return '';
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

export const useCheckoutUser = (enabled = true) => {
  return useQuery<CheckoutUser>({
    queryKey: checkoutKeys.user(),
    enabled,
    queryFn: async () => {
      const raw = await http<unknown>('/user');
      const p = (unwrapPayload(raw) ?? {}) as Record<string, unknown>;
      const str = (v: unknown) => (typeof v === 'string' ? v : '');
      return {
        full_name: str(p.full_name),
        email: str(p.email),
        phone_number: str(p.phone_number),
        birthday: toDateInput(str(p.birthday)),
        gender: str(p.gender),
      };
    },
    staleTime: 60_000,
  });
};

export const useApplyPromo = () => {
  return useMutation<number, unknown, { code: string; paymentMethodCode: string }>({
    mutationFn: async ({ code, paymentMethodCode }) => {
      const userUuid = getOrCreateUserUuid();
      const raw = await http<unknown>('/discount/apply/promo-code', {
        method: 'POST',
        body: { user_uuid: userUuid, value: code.trim(), payment_method_code: paymentMethodCode },
      });
      const payload = unwrapPayload(raw) as { discount?: number | null } | null;
      const discount = payload?.discount ?? 0;
      if (!discount) throw new Error('invalid_promo');
      return discount;
    },
  });
};

export const usePay = () => {
  return useMutation<PayResponse, unknown, { paymentTypeCode: string; data: PayInput }>({
    mutationFn: async ({ paymentTypeCode, data }) => {
      const phone = data.phone_number
        ? `${data.phone_number.startsWith('+') ? '' : '+'}${data.phone_number}`
        : '';
      const raw = await http<unknown>('/pay', {
        method: 'POST',
        body: {
          payment_type_code: paymentTypeCode,
          payment_data: { ...data, phone_number: phone },
        },
      });
      return payResponseSchema.parse(unwrapPayload(raw));
    },
  });
};

export const useConfirmOtp = () => {
  return useMutation<void, unknown, { code: string; otp: string; orderNumber: string }>({
    mutationFn: async ({ code, otp, orderNumber }) => {
      const path = code === 'plum' ? '/pay/plum/confirm' : `/pay/${code}/confirm-otp`;
      const body: Record<string, unknown> = { otp, order_number: orderNumber };
      if (code === 'megapay') body.user_uuid = getOrCreateUserUuid();
      await http(path, { method: 'POST', body });
    },
  });
};

// Pre-validates that the phone is registered with the provider (mbank/bakai).
// Returns the account holder name on success, or null on failure (caller shows the toast).
export const checkPhone = async (code: string, phone: string): Promise<string | null> => {
  const normalized = phone.startsWith('+') ? phone : `+${phone}`;
  try {
    const raw = await http<unknown>(`/pay/${code}/exist-phone/${encodeURIComponent(normalized)}`);
    const p = unwrapPayload(raw) as { name?: string } | null;
    return p?.name ?? '';
  } catch {
    return null;
  }
};

export interface ApiErrorInfo {
  status: number;
  message: string;
}

export const parseApiError = (err: unknown): ApiErrorInfo => {
  const e = err as
    | {
        response?: { status?: number };
        statusCode?: number;
        data?: { payload?: { message?: string }; message?: string };
      }
    | null
    | undefined;
  const status = e?.response?.status ?? e?.statusCode ?? 0;
  const message = e?.data?.payload?.message ?? e?.data?.message ?? '';
  return { status, message };
};

export const clearBasket = async (): Promise<void> => {
  try {
    const userUuid = getOrCreateUserUuid();
    await http('/basket/clear', { method: 'POST', body: { user_uuid: userUuid } });
  } catch {
    // best-effort cleanup
  }
};
