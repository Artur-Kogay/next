'use client';

import { useEffect, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { formatCartTimer } from '@/shared/lib';

import styles from './Timer.module.scss';
import { type TimerProps } from './Timer.types';

export function Timer({ timer }: TimerProps) {
  const t = useTranslations('cart-modal');
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer]);

  const isRunning = timeLeft > 0;
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const percentage = useMemo(() => (timeLeft / 900) * 100, [timeLeft]);

  if (timeLeft < 1) return null;

  return (
    <div className={styles.timerRow}>
      <div className={styles.timerInfo}>
        <div className={styles.timerLabel}>{t('booking-time')}</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <div className={styles.timerTime}>{formatCartTimer(timeLeft)}</div>
    </div>
  );
}
