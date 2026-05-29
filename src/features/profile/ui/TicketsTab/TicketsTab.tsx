'use client';

import { useState } from 'react';

import { Ticket } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib';
import { Loader } from '@/shared/ui';

import styles from './TicketsTab.module.scss';
import { type Mode, type TicketsTabProps } from './TicketsTab.types';
import { OrderCard } from '../OrderCard/OrderCard';

export const TicketsTab = ({ upcoming, past, loading }: TicketsTabProps) => {
  const t = useTranslations('profile');
  const [mode, setMode] = useState<Mode>('upcoming');

  const list = mode === 'upcoming' ? upcoming : past;

  const emptyTitleKey = mode === 'past' ? 'no-past' : 'no-orders';
  const emptyHintKey = mode === 'past' ? 'no-past-hint' : 'no-orders-hint';

  return (
    <div className={styles.root}>
      <div className={styles.tabs} role="tablist">
        {(['upcoming', 'past'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={cn(styles.tab, mode === m && styles.tabActive)}
            onClick={() => setMode(m)}
          >
            {t(`tab-${m}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.empty}>
          <Loader />
        </div>
      ) : list.length > 0 ? (
        <div className={styles.list}>
          {list.map((order) => (
            <OrderCard key={String(order.id)} order={order} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Ticket size={28} aria-hidden />
          </span>
          <div className={styles.emptyTitle}>{t(emptyTitleKey)}</div>
          <div className={styles.emptyHint}>{t(emptyHintKey)}</div>
          {mode === 'upcoming' ? (
            <button type="button" className={styles.emptyCta}>
              {t('browse-events')}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
