'use client';

import { http, unwrapPayload } from '@/shared/api/http';

import type { BakaiData, ElsomData, MegapayData } from '../model/types';

interface TokenPayload {
  token: string;
}

interface MegapayPayload extends TokenPayload {
  first_auth?: boolean;
  user?: {
    full_name?: string;
    phone_number?: string;
    email?: string | null;
  };
}

const tokenFrom = (raw: unknown): string | null => {
  const p = unwrapPayload(raw) as TokenPayload | null;
  return p?.token ?? null;
};

export const getBakaiToken = async (data: BakaiData): Promise<string | null> => {
  try {
    const raw = await http<unknown>('/webview/payment/bakai/auth', {
      method: 'POST',
      body: { ...data, phone: data.phone.trim() },
    });
    return tokenFrom(raw);
  } catch {
    return null;
  }
};

export const getMegapayToken = async (data: MegapayData): Promise<MegapayPayload | null> => {
  try {
    const raw = await http<unknown>('/webview/payment/megapay/auth', {
      method: 'POST',
      body: { ...data, phone: data.phone.trim() },
    });
    return (unwrapPayload(raw) as MegapayPayload | null) ?? null;
  } catch {
    return null;
  }
};

export const getKicbToken = async (data: {
  phone: string;
  full_name: string;
  sign: string;
}): Promise<string | null> => {
  try {
    const raw = await http<unknown>('/webview/payment/kicb/auth', {
      method: 'POST',
      body: data,
    });
    return tokenFrom(raw);
  } catch {
    return null;
  }
};

export const getElsomToken = async (data: ElsomData): Promise<string | null> => {
  try {
    const raw = await http<unknown>('/webview/payment/elsom/auth', {
      method: 'POST',
      body: data,
    });
    return tokenFrom(raw);
  } catch {
    return null;
  }
};
