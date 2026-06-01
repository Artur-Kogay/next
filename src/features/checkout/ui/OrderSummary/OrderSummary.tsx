'use client';

import { useMemo } from 'react';

import { ShieldCheck, Tag, Ticket } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatPrice } from '@/shared/config/currency';
import { formatSessionDateTime } from '@/shared/lib';

import styles from './OrderSummary.module.scss';
import { type OrderSummaryProps } from './OrderSummary.types';
import { Timer } from '../Timer/Timer';

export const OrderSummary = ({
  basket,
  timer,
  totals,
  promo,
  onPromoChange,
  onApplyPromo,
  promoPending,
  promoApplied,
  onPay,
  payPending,
  payLabel,
}: OrderSummaryProps) => {
  const t = useTranslations('checkout');

  const groups = useMemo(() => {
    const map = new Map<string, { title: string; date: string; count: number; sum: number }>();
    basket.forEach((item) => {
      const date = item.session?.date_time ?? '';
      const key = `${item.event?.title ?? ''}__${date}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        existing.sum += item.price + item.service_fee;
      } else {
        map.set(key, {
          title: item.event?.title ?? t('ticket-fallback'),
          date,
          count: 1,
          sum: item.price + item.service_fee,
        });
      }
    });
    return [...map.values()];
  }, [basket, t]);

  return (
    <aside className={styles.summary}>
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>{t('your-order')}</h2>

        <Timer timer={timer} />

        <div className={styles.groups}>
          {groups.map((g, i) => (
            <div key={i} className={styles.group}>
              <Ticket size={16} className={styles.groupIcon} aria-hidden />
              <div className={styles.groupBody}>
                <div className={styles.groupTitle}>{g.title}</div>
                {g.date ? (
                  <div className={styles.groupMeta}>{formatSessionDateTime(g.date)}</div>
                ) : null}
                <div className={styles.groupMeta}>{t('tickets-count', { count: g.count })}</div>
              </div>
              <div className={styles.groupPrice}>{formatPrice(g.sum)}</div>
            </div>
          ))}
        </div>

        <div className={styles.promo}>
          <div className={styles.inputWrap}>
            <Tag size={16} className={styles.inputIcon} aria-hidden />
            <input
              className={styles.input}
              value={promo}
              onChange={(e) => onPromoChange(e.target.value)}
              placeholder={t('promo-placeholder')}
              disabled={promoApplied}
            />
          </div>
          <button
            type="button"
            className={styles.promoBtn}
            onClick={onApplyPromo}
            disabled={promoPending || promoApplied || !promo.trim()}
          >
            {promoApplied ? t('applied') : t('apply')}
          </button>
        </div>

        <div className={styles.rows}>
          <div className={styles.row}>
            <span>{t('tickets-line', { count: totals.count })}</span>
            <span>{formatPrice(totals.ticketsSum)}</span>
          </div>
          {totals.serviceFeeSum > 0 ? (
            <div className={styles.row}>
              <span>{t('service-fee')}</span>
              <span>{formatPrice(totals.serviceFeeSum)}</span>
            </div>
          ) : null}
          {totals.discount > 0 ? (
            <div className={`${styles.row} ${styles.rowDiscount}`}>
              <span>{t('discount')}</span>
              <span>−{formatPrice(totals.discount)}</span>
            </div>
          ) : null}
        </div>

        <div className={styles.totalRow}>
          <span>{t('total')}</span>
          <span className={styles.totalValue}>{formatPrice(totals.total)}</span>
        </div>

        <button type="button" className={styles.payBtn} onClick={onPay} disabled={payPending}>
          {payPending ? t('processing') : payLabel}
        </button>

        <p className={styles.terms}>
          <ShieldCheck size={14} aria-hidden />
          {t('terms')}
        </p>
      </div>
    </aside>
  );
};
