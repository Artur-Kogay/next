import 'server-only';

import { httpWithLocale, unwrapPayload } from '@/shared/api/http';

import { categoriesSchema, type Category } from './schemas';

const sortSessions = <T extends Category['last_sessions'][number]>(items: T[]) =>
  items
    .slice()
    .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
    .sort((a, b) => (a.event.is_pinned ? -1 : 0) - (b.event.is_pinned ? -1 : 0));

export const getCategories = async (locale: string): Promise<Category[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/category', {
      query: { _with_data: 'banners,last_sessions' },
    });
    const list = categoriesSchema.parse(unwrapPayload(raw));
    return list.map((c) => ({ ...c, last_sessions: sortSessions(c.last_sessions) }));
  } catch {
    return [];
  }
};
