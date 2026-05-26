'use client';

import { useCallback, useRef, useState } from 'react';
import type { UIEvent } from 'react';

import { CalendarClock, ChevronLeft, ChevronRight, MapPin, RefreshCw } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { currency } from '@/shared/config';
import { cn } from '@/shared/lib';
import { QrCode } from '@/shared/ui';

import styles from './OrderCard.module.scss';

import type { Order, OrderStatus, Ticket } from '../../api/schemas';

interface OrderCardProps {
  order: Order;
}

type DisplayStatus = 'paid' | 'pending' | 'refunded';

const mapStatus = (status: OrderStatus): DisplayStatus => {
  if (status === 'COMPLETED' || status === 'INVITATION') return 'paid';
  if (status === 'PENDING_FOR_PAYMENT') return 'pending';
  return 'refunded';
};

const statusClass = (status: DisplayStatus): string | undefined => {
  if (status === 'paid') return styles.statusPaid;
  if (status === 'pending') return styles.statusPending;
  if (status === 'refunded') return styles.statusRefunded;
  return undefined;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const t = useTranslations('profile');
  const format = useFormatter();

  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const total = order.items.length;
  const multi = total > 1;
  const firstTicket = order.items[0];

  const display = mapStatus(order.status);
  const eventDate = firstTicket?.event_date ? new Date(firstTicket.event_date) : null;
  const venue = firstTicket?.event.theater_title ?? '';
  const address = firstTicket?.event.address ?? '';

  const goTo = useCallback((idx: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const target = scroller.children[idx] as HTMLElement | undefined;
    if (!target) return;
    scroller.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  }, []);

  const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const items = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, idx) => {
      const dist = Math.abs(item.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = idx;
      }
    });
    setActive(closest);
  }, []);

  const qrFor = (ticket: Ticket) =>
    ticket.qr_number ?? ticket.turnstile_qr ?? ticket.serial_number ?? '';

  return (
    <article className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerBody}>
          <div className={styles.headerTopRow}>
            <h3 className={styles.eventTitle}>{firstTicket?.event.title ?? order.order_number}</h3>
            <span className={cn(styles.statusChip, statusClass(display))}>
              {t(`ticket-status-${display}`)}
            </span>
          </div>
          {(venue || address) && (
            <div className={styles.metaLine}>
              <MapPin size={12} className={styles.metaIcon} aria-hidden />
              <span className={styles.metaText}>
                {[venue, address].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
          {eventDate ? (
            <div className={styles.metaLine}>
              <CalendarClock size={12} className={styles.metaIcon} aria-hidden />
              <span className={styles.metaText}>
                {format.dateTime(eventDate, { day: 'numeric', month: 'long' })} ·{' '}
                {format.dateTime(eventDate, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.scroller} ref={scrollerRef} onScroll={onScroll}>
        {order.items.map((ticket) => (
          <div key={ticket.id} className={styles.slide}>
            <span className={styles.seat}>{ticket.title}</span>

            {ticket.is_refund ? (
              <div className={styles.refundBanner}>
                <RefreshCw size={16} className={styles.refundIcon} aria-hidden />
                <div>
                  <strong>{t('refund-pending-title')}.</strong> {t('refund-pending-hint')}
                </div>
              </div>
            ) : null}

            <div className={styles.ticketBody}>
              <span className={styles.qrWrap}>
                <QrCode
                  value={qrFor(ticket)}
                  className={cn(styles.qr, ticket.is_refund && styles.qrBlurred)}
                />
              </span>
              <div className={styles.priceCol}>
                <div className={styles.priceBlock}>
                  <div className={styles.priceLabel}>{t('price')}</div>
                  <div className={styles.price}>
                    {format.number(ticket.price ?? 0)}
                    <span className={styles.priceCurrency}>{currency.label}</span>
                  </div>
                </div>
                <div className={styles.numbers}>
                  <div className={styles.numberItem}>
                    <span className={styles.numberLabel}>{t('ticket-number')}</span>
                    <span className={styles.numberValue}>{ticket.serial_number}</span>
                  </div>
                  <div className={styles.numberItem}>
                    <span className={styles.numberLabel}>{t('order-number')}</span>
                    <span className={styles.numberValue}>{order.order_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {multi ? (
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="prev"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <div className={styles.dots}>
            {order.items.map((ticket, idx) => (
              <button
                key={ticket.id}
                type="button"
                className={cn(styles.dot, active === idx && styles.dotActive)}
                onClick={() => goTo(idx)}
                aria-label={`${idx + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => goTo(active + 1)}
            disabled={active === total - 1}
            aria-label="next"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>
      ) : null}
    </article>
  );
};
