import 'server-only';

import { httpWithLocale, unwrapPayload } from '@/shared/api/http';

import { contentPageSchema, type ContentPage } from './schemas';

export const getContentPage = async (slug: string, locale: string): Promise<ContentPage | null> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>(`/content/${encodeURIComponent(slug)}`, {
      query: { lang: locale },
    });
    return contentPageSchema.parse(unwrapPayload(raw));
  } catch {
    return null;
  }
};
