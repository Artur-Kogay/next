'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import { apiCall, http, unwrapPayload } from '@/shared/api';

import { eventKeys } from './keys';
import { sessionListSchema, type SessionListItem } from './schemas';

export const useSearchSessions = (query: string) => {
  const locale = useLocale();
  return useQuery<SessionListItem[]>({
    queryKey: eventKeys.search(locale, query),
    queryFn: () =>
      apiCall(async () => {
        const raw = await http<unknown>('/session', { query: { query } });
        return sessionListSchema.parse(unwrapPayload(raw));
      }),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};
