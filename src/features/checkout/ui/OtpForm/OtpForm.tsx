'use client';

import { useEffect, useRef, useState } from 'react';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatCartTimer } from '@/shared/lib';

import styles from './OtpForm.module.scss';
import { type OtpFormProps } from './OtpForm.types';

export const OtpForm = ({
  phone,
  codeLength,
  timer,
  name,
  confirmPending,
  onConfirm,
  onExpire,
  onCancel,
}: OtpFormProps) => {
  const t = useTranslations('checkout');
  const [otp, setOtp] = useState('');
  const [left, setLeft] = useState(timer);
  const expiredRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left === 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpire();
    }
  }, [left, onExpire]);

  return (
    <div className={styles.root}>
      <ShieldCheck size={40} className={styles.icon} aria-hidden />
      <h2 className={styles.title}>{t('otp-title')}</h2>
      {name ? <p className={styles.text}>{t('greeting', { name })}</p> : null}
      <p className={styles.text}>{t('otp-sent', { phone })}</p>
      <input
        className={styles.input}
        inputMode="numeric"
        maxLength={codeLength}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, codeLength))}
        placeholder={t('sms-code-placeholder')}
      />
      {left > 0 ? (
        <p className={styles.timer}>{t('pay-within', { time: formatCartTimer(left) })}</p>
      ) : null}
      <button
        type="button"
        className={styles.btn}
        onClick={() => onConfirm(otp)}
        disabled={confirmPending || otp.length !== codeLength}
      >
        {confirmPending ? t('checking') : t('confirm')}
      </button>
      <button
        type="button"
        className={styles.cancelBtn}
        onClick={onCancel}
        disabled={confirmPending}
      >
        {t('cancel')}
      </button>
    </div>
  );
};
