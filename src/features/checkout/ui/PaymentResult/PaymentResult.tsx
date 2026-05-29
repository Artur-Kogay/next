'use client';

import { CheckCircle2, Loader2, QrCode } from 'lucide-react';

import styles from './PaymentResult.module.scss';
import { type PaymentResultProps } from './PaymentResult.types';

export const PaymentResult = ({ state, onFinish }: PaymentResultProps) => {
  if (state.kind === 'redirecting') {
    return (
      <div className={styles.result}>
        <Loader2 size={40} className={`${styles.resultIcon} ${styles.spin}`} aria-hidden />
        <h2 className={styles.resultTitle}>Перенаправление на оплату…</h2>
        <p className={styles.resultText}>Не закрывайте страницу.</p>
      </div>
    );
  }

  if (state.kind === 'qr') {
    const src = state.qr.startsWith('data:') ? state.qr : `data:image/png;base64,${state.qr}`;
    return (
      <div className={styles.result}>
        <QrCode size={32} className={styles.resultIcon} aria-hidden />
        <h2 className={styles.resultTitle}>Оплата по QR-коду</h2>
        {state.orderNumber ? (
          <p className={styles.resultText}>
            Заказ №<b>{state.orderNumber}</b>
          </p>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="QR код для оплаты" className={styles.qrImage} />
        <p className={styles.resultText}>
          Отсканируйте код в приложении банка. После оплаты нажмите кнопку ниже.
        </p>
        <button type="button" className={styles.resultBtn} onClick={onFinish}>
          Я оплатил — к заказам
        </button>
      </div>
    );
  }

  return (
    <div className={styles.result}>
      <CheckCircle2
        size={44}
        className={`${styles.resultIcon} ${styles.resultIconSuccess}`}
        aria-hidden
      />
      <h2 className={styles.resultTitle}>Заказ создан</h2>
      {state.orderNumber ? (
        <p className={styles.resultText}>
          Номер заказа: <b>{state.orderNumber}</b>
        </p>
      ) : null}
      {state.otpPhone ? (
        <p className={styles.resultText}>
          Подтвердите оплату кодом из SMS, отправленного на {state.otpPhone}.
        </p>
      ) : (
        <p className={styles.resultText}>Билеты появятся в вашем профиле после оплаты.</p>
      )}
      <button type="button" className={styles.resultBtn} onClick={onFinish}>
        Перейти к заказам
      </button>
    </div>
  );
};
