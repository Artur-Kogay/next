'use client';

import { useCallback } from 'react';

import { useTranslations } from 'next-intl';
import { IoClose } from 'react-icons/io5';

import { formatPrice } from '@/shared/config/currency';
import { formatSessionDateTime } from '@/shared/lib';

import styles from './CartTicket.module.scss';
import { type CartTicketProps } from './CartTicket.types';
import { useRemoveFromBasket } from '../../api/client';

export function CartTicket({ ticket }: CartTicketProps) {
  const t = useTranslations('cart-modal');
  const removeFromBasket = useRemoveFromBasket();

  const onDelete = useCallback(() => {
    removeFromBasket.mutate(ticket.outer_id ? ticket.outer_id : ticket.id);
  }, [ticket.id, ticket.outer_id, removeFromBasket]);

  const total = ticket.price + ticket.service_fee;

  return (
    <div className={styles.ticketCard}>
      <button
        type="button"
        className={styles.ticketDelete}
        onClick={onDelete}
        disabled={removeFromBasket.isPending}
        aria-label={t('remove-ticket')}
      >
        <IoClose size={16} />
      </button>
      <div className={styles.ticketEvent}>{ticket.event?.title}</div>
      <div className={styles.ticketName}>{ticket.title}</div>
      {ticket.session?.date_time ? (
        <div className={styles.ticketDate}>{formatSessionDateTime(ticket.session.date_time)}</div>
      ) : null}
      {ticket.service_fee > 0 ? (
        <div className={styles.ticketPrices}>
          <div className={styles.priceRow}>
            <span>{t('price')}</span>
            <span>{formatPrice(ticket.price)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>{t('service-fee')}</span>
            <span>{formatPrice(ticket.service_fee)}</span>
          </div>
          <div className={styles.priceRowTotal}>
            <span>{t('total-label')}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      ) : (
        <div className={styles.ticketPrice}>{formatPrice(total)}</div>
      )}
    </div>
  );
}
