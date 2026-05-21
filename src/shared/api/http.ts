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

const LOCALE_TO_HEADER: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  kg: 'ky-KG',
  uz: 'uz-UZ',
  tj: 'tg-TJ',
};

const API_VERSION = 'v1';
const apiBase = `${env.NEXT_PUBLIC_BASE_API_URL.replace(/\/$/, '')}/${API_VERSION}`;
const ipBase = `${env.NEXT_PUBLIC_IP_API_URL.replace(/\/$/, '')}/${API_VERSION}`;

export const http = ofetch.create({
  baseURL: apiBase,
  retry: 0,
  onRequest({ options }) {
    const headers = new Headers(options.headers);
    if (!headers.has('Accept')) headers.set('Accept', 'application/json');
    if (!headers.has('Country-Code')) headers.set('Country-Code', env.NEXT_PUBLIC_COUNTRY_CODE);
    options.headers = headers;
  },
  onResponseError({ error, response }) {
    if (env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.error('[http] request failed', response?.status, response?.url, error);
    }
  },
});

export const ipApi = ofetch.create({
  baseURL: ipBase,
  retry: 0,
});

export const httpWithLocale = (locale: string) =>
  ofetch.create({
    baseURL: apiBase,
    retry: 0,
    onRequest({ options }) {
      const headers = new Headers(options.headers);
      if (!headers.has('Accept')) headers.set('Accept', 'application/json');
      if (!headers.has('Accept-Language')) {
        headers.set('Accept-Language', LOCALE_TO_HEADER[locale] ?? locale);
      }
      if (!headers.has('Country-Code')) headers.set('Country-Code', env.NEXT_PUBLIC_COUNTRY_CODE);
      options.headers = headers;
    },
  });

export const apiCall = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    throw normalizeError(error as FetchError);
  }
};
