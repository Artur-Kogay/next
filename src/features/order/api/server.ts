import 'server-only';

import { httpWithLocale, unwrapPayload } from '@/shared/api/http';
import { SCHEMES_URL } from '@/shared/config';

import { orderSessionSchema, type OrderSession } from './schemas';

export const getOrderSession = async (
  slug: string,
  locale: string,
): Promise<OrderSession | null> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/session/order', {
      query: { slug },
    });
    const payload = unwrapPayload(raw);
    const result = orderSessionSchema.safeParse(payload);
    if (!result.success) {
      console.error('[getOrderSession] parse error', result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
};

export const getSchemeHtml = async (htmlPath: string): Promise<string> => {
  if (!htmlPath) return '';
  try {
    const res = await fetch(`${SCHEMES_URL}${htmlPath}`, {
      cache: 'no-store',
    });
    return await res.text();
  } catch {
    return '';
  }
};
