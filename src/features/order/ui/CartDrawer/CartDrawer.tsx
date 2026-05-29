'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAtom } from 'jotai';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { IoClose } from 'react-icons/io5';

import { formatPrice } from '@/shared/config/currency';
import { useRouter } from '@/shared/lib/i18n/navigation';

import styles from './CartDrawer.module.scss';
import { useBasket, useClearBasket, useRemoveFromBasket } from '../../api/client';
import { formatSessionDateTime } from '../../lib/format';
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
      <div className={styles.timerInfo}>
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

  const total = ticket.price + ticket.service_fee;

  return (
    <div className={styles.ticketCard}>
      <button
        type="button"
        className={styles.ticketDelete}
        onClick={onDelete}
        disabled={removeFromBasket.isPending}
        aria-label="Удалить билет"
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
            <span>Цена</span>
            <span>{formatPrice(ticket.price)}</span>
          </div>
          <div className={styles.priceRow}>
            <span>Сервисный сбор</span>
            <span>{formatPrice(ticket.service_fee)}</span>
          </div>
          <div className={styles.priceRowTotal}>
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      ) : (
        <div className={styles.ticketPrice}>{formatPrice(total)}</div>
      )}
    </div>
  );
}

export const CartDrawer = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useAtom(isCartOpenAtom);
  const { data: cart } = useBasket();
  const clearBasket = useClearBasket();

  const basketItems = useMemo(() => cart?.basket ?? [], [cart?.basket]);
  const timer = cart?.timer ?? 0;
  const count = basketItems.length;

  const totalPrice = useMemo(
    () => basketItems.reduce((sum, t) => sum + t.price + t.service_fee, 0),
    [basketItems],
  );

  const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const onClear = useCallback(() => clearBasket.mutate(), [clearBasket]);
  const onPurchase = useCallback(() => {
    router.push('/basket/checkout');
    setIsOpen(false);
  }, [router, setIsOpen]);
  const onGoHome = useCallback(() => {
    router.push('/');
    setIsOpen(false);
  }, [router, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose} />
      <aside className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} aria-hidden={!isOpen}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingCart size={18} aria-hidden />
            <span>Корзина</span>
            {count > 0 ? <span className={styles.headerCount}>{count}</span> : null}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
            <IoClose size={24} />
          </button>
        </div>

        {count === 0 ? (
          <div className={styles.empty}>
            <ShoppingCart size={44} className={styles.emptyIcon} aria-hidden />
            <div className={styles.emptyText}>Корзина пуста</div>
            <div className={styles.emptySubtext}>Здесь появятся выбранные билеты</div>
            <button type="button" className={styles.emptyBtn} onClick={onGoHome}>
              На главную
            </button>
          </div>
        ) : (
          <>
            <div className={styles.body}>
              <Timer timer={timer} />
              <div className={styles.tickets}>
                {basketItems.map((ticket) => (
                  <CartTicket key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Билетов</span>
                  <span className={styles.summaryCount}>{count}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Итого</span>
                  <span className={styles.summaryTotal}>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button type="button" className={styles.buyBtn} onClick={onPurchase}>
                Оформить
              </button>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={onClear}
                disabled={clearBasket.isPending}
              >
                <Trash2 size={15} aria-hidden /> Очистить корзину
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
