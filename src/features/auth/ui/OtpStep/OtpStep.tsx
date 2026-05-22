'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';

import { useTranslations } from 'next-intl';

import styles from './OtpStep.module.scss';

interface OtpStepProps {
  length?: number;
  resendIn?: number;
  onSubmit: (code: string) => void;
  onResend: () => void;
  error?: string | null;
  loading?: boolean;
}

export const OtpStep = ({
  length = 6,
  resendIn = 60,
  onSubmit,
  onResend,
  error,
  loading = false,
}: OtpStepProps) => {
  const t = useTranslations('auth');

  const [digits, setDigits] = useState<string[]>(() => Array.from({ length }, () => ''));
  const [secondsLeft, setSecondsLeft] = useState(resendIn);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => digits.join(''), [digits]);
  const lastSubmittedRef = useRef<string>('');

  useEffect(() => {
    setSecondsLeft(resendIn);
    const tick = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
  }, [resendIn]);

  useEffect(() => {
    if (code.length === length && !loading && code !== lastSubmittedRef.current) {
      lastSubmittedRef.current = code;
      onSubmit(code);
    }
  }, [code, length, loading, onSubmit]);

  const focusAt = useCallback((idx: number) => {
    inputsRef.current[idx]?.focus();
  }, []);

  useEffect(() => {
    if (error) {
      setDigits(Array.from({ length }, () => ''));
      lastSubmittedRef.current = '';
      focusAt(0);
    }
  }, [error, length, focusAt]);

  const onCellChange = (idx: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 0) {
      setDigits((d) => d.map((v, i) => (i === idx ? '' : v)));
      return;
    }
    setDigits((d) => {
      const next = [...d];
      const chars = raw.slice(0, length - idx).split('');
      chars.forEach((ch, i) => {
        next[idx + i] = ch;
      });
      return next;
    });
    focusAt(Math.min(idx + raw.length, length - 1));
  };

  const onCellKeyDown = (idx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      e.preventDefault();
      setDigits((d) => d.map((v, i) => (i === idx - 1 ? '' : v)));
      focusAt(idx - 1);
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      focusAt(idx - 1);
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      focusAt(idx + 1);
    }
  };

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (!pasted) return;
      setDigits(() => Array.from({ length }, (_, i) => pasted[i] ?? ''));
      focusAt(Math.min(pasted.length, length - 1));
    },
    [length, focusAt],
  );

  const onResendClick = useCallback(() => {
    if (secondsLeft > 0 || loading) return;
    setDigits(Array.from({ length }, () => ''));
    setSecondsLeft(resendIn);
    focusAt(0);
    onResend();
  }, [secondsLeft, loading, length, resendIn, focusAt, onResend]);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h1 className={styles.title}>{t('otpTitle')}</h1>
        <p className={styles.subtitle}>{t('otpSubtitle')}</p>
      </div>

      <div className={styles.cells} role="group" aria-label={t('otpTitle')}>
        {Array.from({ length }, (_, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="tel"
            inputMode="numeric"
            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            value={digits[idx] ?? ''}
            onChange={onCellChange(idx)}
            onKeyDown={onCellKeyDown(idx)}
            onPaste={idx === 0 ? onPaste : undefined}
            disabled={loading}
            className={styles.cell}
            aria-label={`${t('otpTitle')} ${idx + 1}`}
          />
        ))}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.resend}>
        {secondsLeft > 0 ? (
          <span className={styles.timer}>{t('otpResendIn', { seconds: secondsLeft })}</span>
        ) : (
          <button type="button" className={styles.resendBtn} onClick={onResendClick}>
            {t('otpResend')}
          </button>
        )}
      </div>
    </div>
  );
};
