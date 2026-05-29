import 'server-only';

import { httpWithLocale, unwrapPayload } from '@/shared/api/http';

import { paymentMethodsResponseSchema, type PaymentMethod } from './schemas';

export const getPaymentMethods = async (locale: string): Promise<PaymentMethod[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/payment/method');
    const result = paymentMethodsResponseSchema.safeParse({ payload: unwrapPayload(raw) });
    if (!result.success) {
      console.error('[getPaymentMethods] parse error', result.error.flatten());
      return [];
    }
    return result.data.payload;
  } catch {
    return [];
  }
};
