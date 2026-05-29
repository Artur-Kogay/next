'use client';

import { useMemo } from 'react';

import { ShieldCheck, Tag, Ticket } from 'lucide-react';

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
  const groups = useMemo(() => {
    const map = new Map<string, { title: string; date: string; count: number; sum: number }>();
    basket.forEach((t) => {
      const date = t.session?.date_time ?? '';
      const key = `${t.event?.title ?? ''}__${date}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        existing.sum += t.price + t.service_fee;
      } else {
        map.set(key, {
          title: t.event?.title ?? 'Билет',
          date,
          count: 1,
          sum: t.price + t.service_fee,
        });
      }
    });
    return [...map.values()];
  }, [basket]);

  return (
    <aside className={styles.summary}>
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Ваш заказ</h2>

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
                <div className={styles.groupMeta}>
                  {g.count} {g.count === 1 ? 'билет' : 'билетов'}
                </div>
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
              placeholder="Промокод"
              disabled={promoApplied}
            />
          </div>
          <button
            type="button"
            className={styles.promoBtn}
            onClick={onApplyPromo}
            disabled={promoPending || promoApplied || !promo.trim()}
          >
            {promoApplied ? 'Применён' : 'Применить'}
          </button>
        </div>

        <div className={styles.rows}>
          <div className={styles.row}>
            <span>Билеты ({totals.count})</span>
            <span>{formatPrice(totals.ticketsSum)}</span>
          </div>
          {totals.serviceFeeSum > 0 ? (
            <div className={styles.row}>
              <span>Сервисный сбор</span>
              <span>{formatPrice(totals.serviceFeeSum)}</span>
            </div>
          ) : null}
          {totals.discount > 0 ? (
            <div className={`${styles.row} ${styles.rowDiscount}`}>
              <span>Скидка</span>
              <span>−{formatPrice(totals.discount)}</span>
            </div>
          ) : null}
        </div>

        <div className={styles.totalRow}>
          <span>Итого</span>
          <span className={styles.totalValue}>{formatPrice(totals.total)}</span>
        </div>

        <button type="button" className={styles.payBtn} onClick={onPay} disabled={payPending}>
          {payPending ? 'Обработка…' : payLabel}
        </button>

        <p className={styles.terms}>
          <ShieldCheck size={14} aria-hidden />
          Нажимая кнопку, вы соглашаетесь с правилами покупки и возврата билетов.
        </p>
      </div>
    </aside>
  );
};
