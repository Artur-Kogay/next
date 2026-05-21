'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { apiCall, http } from '@/shared/api';

import { eventKeys } from './keys';
import { sessionListSchema, type SessionListItem } from './schemas';

const unwrap = (raw: unknown): unknown =>
  typeof raw === 'object' && raw !== null && 'payload' in raw ? raw.payload : raw;

export const useSearchSessions = (query: string) => {
  const locale = useLocale();
  return useQuery<SessionListItem[]>({
    queryKey: eventKeys.search(locale, query),
    queryFn: () =>
      apiCall(async () => {
        const raw = await http<unknown>('/session', { query: { query } });
        return sessionListSchema.parse(unwrap(raw));
      }),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};
