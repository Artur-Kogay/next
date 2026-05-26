'use client';

import { useCallback, useMemo, useState } from 'react';

import { useSetAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { type Country } from '@/shared/config';
import { Link } from '@/shared/i18n/navigation';
import { fullPhone } from '@/shared/lib';

import styles from './AuthFlow.module.scss';
import { useSendOtp, useVerifyOtp } from '../../api/client';
import { type SmsService } from '../../api/schemas';
import { tokenAtom, userIdAtom } from '../../model/atoms';
import { useAuthFlow } from '../../model/useAuthFlow';
import { OtpStep } from '../OtpStep/OtpStep';
import { PhoneStep } from '../PhoneStep/PhoneStep';
import { SmsServiceStep } from '../SmsServiceStep/SmsServiceStep';

interface AuthFlowProps {
  onSuccess: () => void;
  cancelHref?: string;
}

export const AuthFlow = ({ onSuccess, cancelHref = '/' }: AuthFlowProps) => {
  const t = useTranslations('auth');

  const flow = useAuthFlow();
  const setToken = useSetAtom(tokenAtom);
  const setUserId = useSetAtom(userIdAtom);
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const [otpError, setOtpError] = useState<string | null>(null);

  const phoneFull = useMemo(
    () => fullPhone(flow.country, flow.digits),
    [flow.country, flow.digits],
  );

  const handlePhoneSubmit = useCallback(
    (input: { country: Country; digits: string }) => {
      flow.goToService(input);
    },
    [flow],
  );

  const handleServiceSelect = useCallback(
    async (service: SmsService) => {
      try {
        await sendOtp.mutateAsync({
          phone_number: phoneFull,
          sms_service_code: service.code,
        });
        setOtpError(null);
        flow.goToOtp(service);
      } catch {
        setOtpError(null);
      }
    },
    [flow, phoneFull, sendOtp],
  );

  const handleOtpSubmit = useCallback(
    async (code: string) => {
      if (!flow.service) return;
      try {
        const result = await verifyOtp.mutateAsync({
          phone_number: phoneFull,
          verification_code: code,
          sms_service_code: flow.service.code,
        });
        setToken(result.token);
        if (result.user_id != null) setUserId(String(result.user_id));
        onSuccess();
      } catch {
        setOtpError(t('otpInvalid'));
      }
    },
    [flow.service, phoneFull, verifyOtp, setToken, setUserId, onSuccess, t],
  );

  const handleResend = useCallback(() => {
    if (!flow.service) return;
    setOtpError(null);
    void sendOtp.mutateAsync({
      phone_number: phoneFull,
      sms_service_code: flow.service.code,
    });
  }, [flow.service, phoneFull, sendOtp]);

  const isFirstStep = flow.step === 'phone';

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        {isFirstStep ? (
          <Link href={cancelHref} className={styles.backLink}>
            <ArrowLeft size={18} aria-hidden />
            <span>{t('back')}</span>
          </Link>
        ) : (
          <button type="button" className={styles.backLink} onClick={flow.back}>
            <ArrowLeft size={18} aria-hidden />
            <span>{t('back')}</span>
          </button>
        )}
      </div>

      <div className={styles.card}>
        {flow.step === 'phone' && (
          <PhoneStep
            initialCountry={flow.country}
            initialDigits={flow.digits}
            onSubmit={handlePhoneSubmit}
          />
        )}
        {flow.step === 'service' && (
          <SmsServiceStep phone={phoneFull} country={flow.country} onSelect={handleServiceSelect} />
        )}
        {flow.step === 'otp' && (
          <OtpStep
            onSubmit={handleOtpSubmit}
            onResend={handleResend}
            error={otpError}
            loading={verifyOtp.isPending}
          />
        )}
      </div>
    </div>
  );
};
