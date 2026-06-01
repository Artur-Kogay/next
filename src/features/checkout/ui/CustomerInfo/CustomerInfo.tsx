'use client';

import { CalendarDays, Mail, Phone, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib';

import styles from './CustomerInfo.module.scss';
import { type CustomerInfoProps } from './CustomerInfo.types';

export const CustomerInfo = ({
  customer,
  onChange,
  showName,
  showEmail,
  showBirthday,
}: CustomerInfoProps) => {
  const t = useTranslations('checkout');

  return (
    <div className={styles.fields}>
      {showName ? (
        <label className={styles.field}>
          <span className={styles.label}>{t('full-name-label')}</span>
          <div className={styles.inputWrap}>
            <UserRound size={16} className={styles.inputIcon} aria-hidden />
            <input
              className={styles.input}
              value={customer.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder={t('full-name-placeholder')}
            />
          </div>
        </label>
      ) : null}

      {showEmail ? (
        <label className={styles.field}>
          <span className={styles.label}>{t('email-label')}</span>
          <div className={styles.inputWrap}>
            <Mail size={16} className={styles.inputIcon} aria-hidden />
            <input
              className={styles.input}
              type="email"
              value={customer.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder={t('email-placeholder')}
            />
          </div>
        </label>
      ) : null}

      <label className={cn(styles.field, styles.fieldFull)}>
        <span className={styles.label}>{t('phone-label')}</span>
        <div className={styles.inputWrap}>
          <Phone size={16} className={styles.inputIcon} aria-hidden />
          <input
            className={styles.input}
            type="tel"
            value={customer.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+996 700 000 000"
          />
        </div>
      </label>

      {showBirthday ? (
        <>
          <label className={styles.field}>
            <span className={styles.label}>{t('birthday-label')}</span>
            <div className={styles.inputWrap}>
              <CalendarDays size={16} className={styles.inputIcon} aria-hidden />
              <input
                className={styles.input}
                type="date"
                value={customer.birthday}
                onChange={(e) => onChange({ birthday: e.target.value })}
              />
            </div>
          </label>

          <div className={cn(styles.field, styles.fieldFull)}>
            <span className={styles.label}>{t('gender-label')}</span>
            <div className={styles.genderRow}>
              <button
                type="button"
                className={cn(styles.gender, customer.gender === 'male' && styles.genderActive)}
                onClick={() => onChange({ gender: 'male' })}
              >
                {t('male')}
              </button>
              <button
                type="button"
                className={cn(styles.gender, customer.gender === 'female' && styles.genderActive)}
                onClick={() => onChange({ gender: 'female' })}
              >
                {t('female')}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
