import 'server-only';

import { httpWithLocale, unwrapPayload } from '@/shared/api/http';

import { bannersSchema, type Banner } from './schemas';

export const getBanners = async (locale: string): Promise<Banner[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/banner');
    const banners = bannersSchema.parse(unwrapPayload(raw));
    return banners.slice().sort((a, b) => a.priority - b.priority);
  } catch {
    return [];
  }
};
