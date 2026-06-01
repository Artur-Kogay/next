'use client';

import { useTranslations } from 'next-intl';

import styles from './PaymentMethodList.module.scss';
import { type PaymentMethodListProps } from './PaymentMethodList.types';

export const PaymentMethodList = ({ methods, selected, onSelect }: PaymentMethodListProps) => {
  const t = useTranslations('checkout');

  if (!methods.length) {
    return <p className={styles.emptyMethods}>{t('no-methods')}</p>;
  }

  return (
    <div className={styles.methods}>
      {methods.map((method) => {
        const active = method.code === selected;
        return (
          <button
            type="button"
            key={method.id}
            className={`${styles.method} ${active ? styles.methodActive : ''}`}
            onClick={() => onSelect(method.code)}
            aria-pressed={active}
          >
            <span className={styles.methodTitle}>{method.title}</span>
            <span className={styles.radio} aria-hidden>
              <span className={styles.radioDot} />
            </span>
          </button>
        );
      })}
    </div>
  );
};
