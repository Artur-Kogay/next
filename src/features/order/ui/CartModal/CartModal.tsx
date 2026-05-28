'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAtom } from 'jotai';
import { IoClose } from 'react-icons/io5';

import { currency } from '@/shared/config/currency';
import { useRouter } from '@/shared/lib/i18n/navigation';

import styles from './CartModal.module.scss';
import { useBasket, useRemoveFromBasket, useClearBasket } from '../../api/client';
import { formatCartTimer } from '../../lib/schema-utils';
import { isCartOpenAtom } from '../../model/atoms';

import type { BasketItem } from '../../api/schemas';

function Timer({ timer }: { timer: number }) {
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer]);

  const isRunning = timeLeft > 0;
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const percentage = useMemo(() => (timeLeft / 900) * 100, [timeLeft]);

  if (timeLeft < 1) return null;

  return (
    <div className={styles.timerRow}>
      <div style={{ flex: 1 }}>
        <div className={styles.timerLabel}>Время до конца брони</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <div className={styles.timerTime}>{formatCartTimer(timeLeft)}</div>
    </div>
  );
}

function CartTicket({ ticket }: { ticket: BasketItem }) {
  const removeFromBasket = useRemoveFromBasket();

  const onDelete = useCallback(() => {
    removeFromBasket.mutate(ticket.outer_id ? ticket.outer_id : ticket.id);
  }, [ticket.id, ticket.outer_id, removeFromBasket]);

  return (
    <div className={styles.ticketCard}>
      <button type="button" className={styles.ticketDelete} onClick={onDelete}>
        <IoClose color="white" size={14} />
      </button>
      <div className={styles.ticketEvent}>Событие: {ticket.event?.title}</div>
      <div className={styles.ticketName}>Билет: {ticket.title}</div>
      <div className={styles.ticketPrices}>
        <span>
          Цена: {ticket.price.toLocaleString()} {currency.label}
        </span>
        {ticket.service_fee ? (
          <>
            <span>
              Сервисный сбор: {ticket.service_fee.toLocaleString()} {currency.label}
            </span>
            <span>
              Итого: {(ticket.price + ticket.service_fee).toLocaleString()} {currency.label}
            </span>
          </>
        ) : null}
      </div>
      {ticket.session?.date_time && (
        <div className={styles.ticketDate}>
          Дата:{' '}
          {new Date(ticket.session.date_time).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
}

export const CartModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useAtom(isCartOpenAtom);
  const { data: cart } = useBasket();
  const clearBasket = useClearBasket();

  const basketItems = useMemo(() => cart?.basket ?? [], [cart?.basket]);
  const timer = cart?.timer ?? 0;

  const totalPrice = useMemo(
    () => basketItems.reduce((sum, t) => sum + t.price + t.service_fee, 0),
    [basketItems],
  );

  const onClear = useCallback(() => {
    clearBasket.mutate();
  }, [clearBasket]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onGoHome = useCallback(() => {
    router.push('/');
    setIsOpen(false);
  }, [router, setIsOpen]);

  const onPurchase = useCallback(() => {
    router.push('/basket/checkout');
    setIsOpen(false);
  }, [router, setIsOpen]);

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.overlay} onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose}>
          <IoClose size={28} />
        </button>

        <div className={styles.title}>Корзина</div>

        {!basketItems.length ? (
          <div className={styles.empty}>
            <div className={styles.emptyText}>Корзина пуста</div>
            <div className={styles.emptySubtext}>Здесь появятся выбранные билеты</div>
            <button type="button" className={styles.goHomeBtn} onClick={onGoHome}>
              На главную
            </button>
          </div>
        ) : (
          <>
            <Timer timer={timer} />
            <div className={styles.tickets}>
              {basketItems.map((ticket) => (
                <CartTicket key={ticket.id} ticket={ticket} />
              ))}
            </div>
            <div className={styles.footer}>
              <div className={styles.total}>
                Итого: {totalPrice.toLocaleString()} {currency.label}
              </div>
              <div className={styles.buttons}>
                <button type="button" className={styles.buyBtn} onClick={onPurchase}>
                  Оформить
                </button>
                <button type="button" className={styles.clearBtn} onClick={onClear}>
                  Очистить корзину
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
