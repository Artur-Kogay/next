'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { apiCall, http, unwrapPayload } from '@/shared/api';

import { authKeys } from './keys';
import {
  authResponseSchema,
  smsServicesSchema,
  type AuthResponse,
  type SmsService,
} from './schemas';

export const useSmsServices = () =>
  useQuery<SmsService[]>({
    queryKey: authKeys.smsServices(),
    queryFn: () =>
      apiCall(async () => {
        const raw = await http<unknown>('/sms/services');
        const list = smsServicesSchema.parse(unwrapPayload(raw));
        return list.filter((s) => s.is_enabled);
      }),
    staleTime: 5 * 60_000,
  });

interface SendOtpInput {
  phone_number: string;

  sms_service_code: string;
}

export const useSendOtp = () =>
  useMutation({
    mutationFn: (input: SendOtpInput) =>
      apiCall(async () => {
        await http('/user/send-verification-code', {
          method: 'POST',
          body: input,
        });
      }),
  });

interface VerifyOtpInput {
  phone_number: string;
  verification_code: string;
  sms_service_code: string;
}

export const useVerifyOtp = () =>
  useMutation<AuthResponse, Error, VerifyOtpInput>({
    mutationFn: (input) =>
      apiCall(async () => {
        const raw = await http<{
          payload: unknown;
          result: string | number;
          status: string;
        }>('/user/confirm-verification-code', {
          method: 'POST',
          body: input,
        });

        if (raw.status !== 'success') {
          const payload = raw.payload as { message?: string } | null;
          throw new Error(payload?.message ?? 'Invalid code');
        }

        return authResponseSchema.parse(raw.payload);
      }),
  });
