'use client';

import { useMemo } from 'react';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { isHomeCountry } from '@/shared/lib';
import { Loader } from '@/shared/ui';

import styles from './SmsServiceStep.module.scss';
import { HINT_KEY, PHONE_BASED_CODES, type SmsServiceStepProps } from './SmsServiceStep.types';
import { useSmsServices } from '../../api/client';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  telegram: (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.24 3.64 11.93c-.88-.27-.89-.88.2-1.3l16.07-6.2c.73-.34 1.43.18 1.15 1.3l-2.74 12.9c-.19.91-.74 1.13-1.5.7L13.46 16l-1.95 1.88c-.22.23-.41.42-.82.42z" />
    </svg>
  ),
  smspro: (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
};

export const SmsServiceStep = ({ phone, country, onSelect }: SmsServiceStepProps) => {
  const t = useTranslations('auth');
  const tHint = useTranslations('auth.serviceHint');
  const { data, isPending, isError } = useSmsServices();

  const services = useMemo(() => {
    if (!data) return [];
    const home = isHomeCountry(country);
    return data.filter((s) => (home ? true : !PHONE_BASED_CODES.has(s.code)));
  }, [data, country]);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h1 className={styles.title}>{t('serviceTitle')}</h1>
        <p className={styles.subtitle}>{t('serviceSubtitle', { phone })}</p>
      </div>

      {isPending ? (
        <div className={styles.state}>
          <Loader />
        </div>
      ) : isError || services.length === 0 ? (
        <div className={styles.state}>{t('serviceError')}</div>
      ) : (
        <ul className={styles.list}>
          {services.map((service) => {
            const hintKey = HINT_KEY[service.code];
            return (
              <li key={service.id}>
                <button type="button" className={styles.item} onClick={() => onSelect(service)}>
                  <span className={styles.icon} aria-hidden>
                    {SERVICE_ICONS[service.code] ?? <ChevronRight size={24} />}
                  </span>
                  <span className={styles.itemBody}>
                    <span className={styles.itemTitle}>{service.title}</span>
                    {hintKey ? <span className={styles.itemHint}>{tHint(hintKey)}</span> : null}
                  </span>
                  <ChevronRight size={20} className={styles.arrow} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
