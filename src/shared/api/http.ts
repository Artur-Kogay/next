import { ofetch, type FetchError } from 'ofetch';

import { env } from '@/shared/config/env';

import { ApiError } from './types';

const normalizeError = (error: FetchError): ApiError => {
  const status = error.response?.status ?? 0;
  const data = error.data as { message?: string; code?: string } | undefined;
  return new ApiError(
    status,
    data?.message ?? error.message ?? 'Network error',
    data?.code,
    error.data,
  );
};

export const http = ofetch.create({
  baseURL: env.NEXT_PUBLIC_BASE_API_URL,
  retry: 0,
  onRequest({ options }) {
    const headers = new Headers(options.headers);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    options.headers = headers;
  },
  onResponseError({ error, response }) {
    if (env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.error('[http] request failed', response?.status, response?.url, error);
    }
  },
});

export const ipApi = ofetch.create({
  baseURL: env.NEXT_PUBLIC_IP_API_URL,
  retry: 0,
});

export const apiCall = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    throw normalizeError(error as FetchError);
  }
};
