import 'server-only';

import { httpWithLocale } from '@/shared/api/http';

import { sessionListSchema, type SessionListItem } from './schemas';

const PINNED_EVENT_IDS: number[] = [];

const unwrap = (raw: unknown): unknown =>
  typeof raw === 'object' && raw !== null && 'payload' in raw ? raw.payload : raw;

export const getPopular = async (locale: string): Promise<SessionListItem[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>('/session/popular');
    const list = sessionListSchema.parse(unwrap(raw));
    return list.slice().sort((a, b) => {
      const ai = PINNED_EVENT_IDS.indexOf(a.event.id);
      const bi = PINNED_EVENT_IDS.indexOf(b.event.id);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      if ((a.event.is_pinned ?? false) !== (b.event.is_pinned ?? false)) {
        return a.event.is_pinned ? -1 : 1;
      }
      return new Date(a.date_time).getTime() - new Date(b.date_time).getTime();
    });
  } catch {
    return [];
  }
};

export const searchSessionsServer = async (
  locale: string,
  query: string,
): Promise<SessionListItem[]> => {
  if (!query.trim()) return [];
  try {
    const raw = await httpWithLocale(locale)<unknown>('/session', {
      query: { query },
    });
    return sessionListSchema.parse(unwrap(raw));
  } catch {
    return [];
  }
};
