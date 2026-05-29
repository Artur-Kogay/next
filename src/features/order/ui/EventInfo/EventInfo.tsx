'use client';

import { CalendarDays, MapPin } from 'lucide-react';

import styles from './EventInfo.module.scss';
import { formatSessionDateTime } from '../../lib/format';

import type { OrderSession } from '../../api/schemas';

export const EventInfo = ({ item }: { item: OrderSession }) => {
  const date = item.date_time ? formatSessionDateTime(item.date_time) : null;

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{item.event.title}</h1>
      {date || item.hall?.title ? (
        <div className={styles.meta}>
          {date ? (
            <span className={styles.metaItem}>
              <CalendarDays size={15} aria-hidden />
              {date}
            </span>
          ) : null}
          {item.hall?.title ? (
            <span className={styles.metaItem}>
              <MapPin size={15} aria-hidden />
              {item.hall.title}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
