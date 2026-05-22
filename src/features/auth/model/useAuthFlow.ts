'use client';

import { useCallback, useState } from 'react';

import { type Country } from '@/shared/config';
import { defaultCountry } from '@/shared/lib';

import { type SmsService } from '../api/schemas';

export type AuthStep = 'phone' | 'service' | 'otp';

export interface AuthFlowState {
  step: AuthStep;
  country: Country;
  digits: string;
  service: SmsService | null;
}

export interface PhoneInput {
  country: Country;
  digits: string;
}

interface UseAuthFlowResult extends AuthFlowState {
  goToService: (input: PhoneInput) => void;
  goToOtp: (service: SmsService) => void;
  back: () => void;
  reset: () => void;
}

const buildInitial = (): AuthFlowState => ({
  step: 'phone',
  country: defaultCountry(),
  digits: '',
  service: null,
});

export const useAuthFlow = (): UseAuthFlowResult => {
  const [state, setState] = useState<AuthFlowState>(buildInitial);

  const goToService = useCallback(({ country, digits }: PhoneInput) => {
    setState((s) => ({ ...s, country, digits, step: 'service' }));
  }, []);

  const goToOtp = useCallback((service: SmsService) => {
    setState((s) => ({ ...s, service, step: 'otp' }));
  }, []);

  const back = useCallback(() => {
    setState((s) => {
      if (s.step === 'otp') return { ...s, step: 'service' };
      if (s.step === 'service') return { ...s, step: 'phone' };
      return s;
    });
  }, []);

  const reset = useCallback(() => setState(buildInitial()), []);

  return { ...state, goToService, goToOtp, back, reset };
};
