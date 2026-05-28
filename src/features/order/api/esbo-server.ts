import 'server-only';

import { z } from 'zod';

import { httpWithLocale, unwrapPayload } from '@/shared/api/http';

import { esboPriceSchema, esboSeatSchema, type EsboPrice, type EsboSeat } from './esbo-schemas';

export const getEsboPricing = async (sessionId: string, locale: string): Promise<EsboPrice[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>(`/esbo/pricing/${sessionId}`);
    const result = z.array(esboPriceSchema).safeParse(unwrapPayload(raw));
    if (!result.success) return [];
    return result.data.filter((p) => p.price > 0).sort((a, b) => a.price - b.price);
  } catch {
    return [];
  }
};

export const getEsboSeats = async (sessionId: string, locale: string): Promise<EsboSeat[]> => {
  try {
    const raw = await httpWithLocale(locale)<unknown>(`/esbo/seat/tickets-by-session/${sessionId}`);
    const result = z.array(esboSeatSchema).safeParse(unwrapPayload(raw));
    if (!result.success) return [];
    return result.data;
  } catch {
    return [];
  }
};
