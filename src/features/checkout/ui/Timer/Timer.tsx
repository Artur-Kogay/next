'use client';

import { useEffect, useMemo, useState } from 'react';

import { formatCartTimer } from '@/shared/lib';

import styles from './Timer.module.scss';
import { type TimerProps } from './Timer.types';

export const Timer = ({ timer }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer]);

  const isRunning = timeLeft > 0;
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const percentage = useMemo(() => Math.min(100, (timeLeft / 900) * 100), [timeLeft]);

  if (timeLeft < 1) return null;

  return (
    <div className={styles.timer}>
      <div className={styles.timerTop}>
        <span className={styles.timerLabel}>Места забронированы</span>
        <span className={styles.timerTime}>{formatCartTimer(timeLeft)}</span>
      </div>
      <div className={styles.timerBar}>
        <div className={styles.timerFill} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
