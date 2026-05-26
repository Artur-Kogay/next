import 'server-only';

import { httpWithLocale } from '@/shared/api/http';

import { sessionDetailResponseSchema, type SessionDetail } from './session-schema';

export const getSession = async (slug: string, locale: string): Promise<SessionDetail | null> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/session', {
      query: { slug },
    });
    const result = sessionDetailResponseSchema.safeParse(raw);
    if (!result.success) {
      console.error('[getSession] parse error', result.error.flatten());
      return null;
    }
    return result.data.payload;
  } catch {
    return null;
  }
};
