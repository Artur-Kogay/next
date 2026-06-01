'use client';

import { CheckCircle2, Loader2, QrCode } from 'lucide-react';
import { useTranslations } from 'next-intl';

import styles from './PaymentResult.module.scss';
import { type PaymentResultProps } from './PaymentResult.types';
import { OtpForm } from '../OtpForm/OtpForm';

export const PaymentResult = ({
  state,
  onFinish,
  onConfirmOtp,
  confirmPending,
  onExpire,
  onCancel,
}: PaymentResultProps) => {
  const t = useTranslations('checkout');

  if (state.kind === 'redirecting') {
    return (
      <div className={styles.result}>
        <Loader2 size={40} className={`${styles.resultIcon} ${styles.spin}`} aria-hidden />
        <h2 className={styles.resultTitle}>{t('redirecting')}</h2>
        <p className={styles.resultText}>{t('dont-close')}</p>
      </div>
    );
  }

  if (state.kind === 'qr') {
    const src =
      state.qr.startsWith('data:') || state.qr.startsWith('http')
        ? state.qr
        : `data:image/png;base64,${state.qr}`;
    return (
      <div className={styles.result}>
        <QrCode size={32} className={styles.resultIcon} aria-hidden />
        <h2 className={styles.resultTitle}>{t('qr-title')}</h2>
        {state.orderNumber ? (
          <p className={styles.resultText}>
            {t.rich('order-short', {
              number: state.orderNumber,
              b: (chunks) => <b>{chunks}</b>,
            })}
          </p>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={t('qr-alt')} className={styles.qrImage} />
        <p className={styles.resultText}>{t('qr-text')}</p>
        <button type="button" className={styles.resultBtn} onClick={onFinish}>
          {t('paid-to-orders')}
        </button>
      </div>
    );
  }

  if (state.kind === 'otp') {
    return (
      <OtpForm
        phone={state.phone}
        codeLength={state.codeLength}
        timer={state.timer}
        name={state.name}
        confirmPending={confirmPending}
        onConfirm={onConfirmOtp}
        onExpire={onExpire}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className={styles.result}>
      <CheckCircle2
        size={44}
        className={`${styles.resultIcon} ${styles.resultIconSuccess}`}
        aria-hidden
      />
      <h2 className={styles.resultTitle}>{t('order-created')}</h2>
      {state.orderNumber ? (
        <p className={styles.resultText}>
          {t.rich('order-number', {
            number: state.orderNumber,
            b: (chunks) => <b>{chunks}</b>,
          })}
        </p>
      ) : null}
      <p className={styles.resultText}>{t('tickets-in-profile')}</p>
      <button type="button" className={styles.resultBtn} onClick={onFinish}>
        {t('to-orders')}
      </button>
    </div>
  );
};
