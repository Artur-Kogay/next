'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import toast from 'react-hot-toast';
import { BiMinus, BiPlus } from 'react-icons/bi';

import { currency } from '@/shared/config/currency';

import styles from './TicketCard.module.scss';
import { type TicketCardProps } from './TicketCard.types';
import { useAddToBasket, useRemoveFromBasket } from '../../api/client';
import { isDarken } from '../../lib/schema-utils';

export function TicketCard({ ticket, item, basket }: TicketCardProps) {
  const addToBasket = useAddToBasket();
  const removeFromBasket = useRemoveFromBasket();

  const [quantity, setQuantity] = useState(ticket.quantity);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [ticket.description]);

  const inBasket = useMemo(
    () => basket.filter((b) => b.ticket_type_id === ticket.id),
    [basket, ticket.id],
  );

  const onAdd = useCallback(() => {
    if (quantity <= 0) return;

    if (basket.length) {
      const isFree = !!item.event?.is_free;
      const haveIsFree = !!basket.find((b) => b.event?.is_free);
      if (isFree !== haveIsFree) {
        toast.error('Очистите корзину и добавьте билет');
        return;
      }
    }

    if (item.max_tickets_per_customer) {
      if (
        basket.filter((b) => b.event?.id === item.event.id).length >= item.max_tickets_per_customer
      ) {
        toast.error(`Максимум билетов в одни руки ${item.max_tickets_per_customer}`);
        return;
      }
    }

    addToBasket.mutate({
      event_id: item.event.id,
      session_id: item.id,
      ticket_type_id: ticket.id,
    });
    setQuantity((prev) => prev - 1);
  }, [quantity, basket, item, ticket.id, addToBasket]);

  const onRemove = useCallback(() => {
    const ticketInBasket = basket.find((b) => b.ticket_type_id === ticket.id);
    if (!ticketInBasket) return;

    removeFromBasket.mutate(ticketInBasket.id);
    setQuantity((prev) => prev + 1);
  }, [basket, ticket.id, removeFromBasket]);

  const cardColor = ticket.card_color?.trim() ?? '';
  const hasColor = /^#[0-9a-f]{6}$/i.test(cardColor);
  const darkBg = hasColor && isDarken(cardColor);
  const onColor =
    ticket.text_color?.trim() || (hasColor ? (darkBg ? '#ffffff' : '#15171a') : undefined);

  const topStyle = hasColor ? { backgroundColor: cardColor } : undefined;
  const onColorStyle = onColor ? { color: onColor } : undefined;
  const badgeStyle = hasColor
    ? {
        color: onColor,
        backgroundColor: darkBg ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.1)',
        borderColor: 'transparent',
      }
    : undefined;
  const dotStyle = hasColor ? { backgroundColor: onColor } : undefined;

  return (
    <div className={`${styles.card} ${inBasket.length ? styles.cardSelected : ''}`}>
      <div className={`${styles.top} ${hasColor ? styles.topColored : ''}`} style={topStyle}>
        <div className={styles.title} style={onColorStyle}>
          {ticket.title}
        </div>
        <div
          className={`${styles.left} ${quantity === 0 ? styles.soldOut : ''}`}
          style={badgeStyle}
        >
          <span className={styles.leftDot} style={dotStyle} />
          {quantity > 0 ? `Осталось ${quantity}` : 'Распродано'}
        </div>
      </div>

      {ticket.description && (
        <>
          <div
            ref={descRef}
            className={`${styles.desc} ${!expanded ? styles.clamped : ''}`}
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          />
          {overflowing ? (
            <button type="button" className={styles.toggle} onClick={() => setExpanded((p) => !p)}>
              {expanded ? 'Скрыть' : 'Подробнее'}
            </button>
          ) : null}
        </>
      )}

      <div className={styles.perforation} />

      <div className={styles.footer}>
        <div className={styles.priceWrap}>
          <span className={styles.priceLabel}>Цена</span>
          <span className={styles.price}>
            {ticket.price.toLocaleString()}
            <span className={styles.priceCur}>{currency.label}</span>
          </span>
        </div>
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            disabled={!inBasket.length || removeFromBasket.isPending}
            onClick={onRemove}
          >
            <BiMinus size={18} />
          </button>
          <span className={styles.count}>{inBasket.length}</span>
          <button
            type="button"
            className={styles.stepBtn}
            disabled={quantity <= 0 || addToBasket.isPending}
            onClick={onAdd}
          >
            <BiPlus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
