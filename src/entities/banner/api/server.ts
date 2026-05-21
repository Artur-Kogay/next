import 'server-only';

import { httpWithLocale } from '@/shared/api/http';

import { bannersSchema, type Banner } from './schemas';

export const getBanners = async (locale: string): Promise<Banner[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/banner');
    const payload = (raw as { payload?: unknown }).payload ?? raw;
    const banners = bannersSchema.parse(payload);
    return banners.slice().sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
};
