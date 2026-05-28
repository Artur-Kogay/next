'use client';

import { Sparkles } from 'lucide-react';

import { currency } from '@/shared/config';

import styles from './Discounts.module.scss';
import { getDiscountCondition, getDiscountText, type EventDiscount } from '../../lib/discounts';

interface DiscountsProps {
  discounts: EventDiscount[];
}

export const Discounts = ({ discounts }: DiscountsProps) => {
  if (!discounts.length) return null;

  return (
    <div className={styles.card}>
      <span className={styles.border} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.head}>
          <Sparkles size={16} aria-hidden />
          <span className={styles.headText}>Скидки и акции</span>
        </div>

        <ul className={styles.list}>
          {discounts.map((d) => (
            <li key={d.id} className={styles.item}>
              <span className={styles.tag}>
                −{getDiscountText(d, currency.label)}
                <span className={styles.shine} aria-hidden />
              </span>
              <span className={styles.cond}>{getDiscountCondition(d)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
