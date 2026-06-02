'use client';

import { http } from '@/shared/api/http';

import type { TicketCheckResult, TicketScanPayload } from '../model/types';

interface RawResponse {
  payload?: TicketScanPayload;
  result?: number;
  status?: string;
}

export const checkTicket = async (raw: string): Promise<TicketCheckResult> => {
  try {
    const res = await http<RawResponse>('/client/scan/check_ticket', {
      method: 'POST',
      body: { data: { payload: raw } },
    });
    if (res.payload) {
      return { ok: true, payload: res.payload, status: res.status ?? 'OK' };
    }
    return { ok: false, status: res.status ?? '' };
  } catch (err) {
    const e = err as { data?: { status?: string; message?: string } } | null;
    return { ok: false, status: e?.data?.status ?? e?.data?.message ?? '' };
  }
};
