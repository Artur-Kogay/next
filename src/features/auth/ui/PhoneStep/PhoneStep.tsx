'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { useTranslations } from 'next-intl';

import { type Country } from '@/shared/config';
import { defaultCountry, formatPhone, isValidPhone, sanitizePhone } from '@/shared/lib';

import styles from './PhoneStep.module.scss';
import { type PhoneStepProps } from './PhoneStep.types';
import { CountryPicker } from '../CountryPicker/CountryPicker';

export const PhoneStep = ({ initialCountry, initialDigits = '', onSubmit }: PhoneStepProps) => {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const [country, setCountry] = useState<Country>(initialCountry ?? defaultCountry());
  const [digits, setDigits] = useState(() =>
    sanitizePhone(initialCountry ?? defaultCountry(), initialDigits),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const valid = isValidPhone(country, digits);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setDigits(sanitizePhone(country, e.target.value)),
    [country],
  );

  const onCountryChange = useCallback((next: Country) => {
    setCountry(next);
    setDigits((d) => sanitizePhone(next, d));
  }, []);

  const onFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (valid) onSubmit({ country, digits });
    },
    [valid, onSubmit, country, digits],
  );

  return (
    <form onSubmit={onFormSubmit} className={styles.root} noValidate>
      <div className={styles.head}>
        <h1 className={styles.title}>{t('phoneTitle')}</h1>
        <p className={styles.subtitle}>{t('phoneSubtitle')}</p>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{tCommon('phone')}</span>
        <div className={styles.inputWrap}>
          <CountryPicker value={country} onChange={onCountryChange} />
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={formatPhone(country, digits)}
            onChange={onChange}
            placeholder="700 123 456"
            className={styles.input}
            aria-label={tCommon('phone')}
          />
        </div>
      </label>

      <button type="submit" disabled={!valid} className={styles.submit}>
        {tCommon('continue')}
      </button>
    </form>
  );
};
