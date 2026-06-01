'use client';

import { useCallback, useEffect, useMemo } from 'react';

import { useAtom } from 'jotai';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IoClose } from 'react-icons/io5';

import { formatPrice } from '@/shared/config/currency';
import { useRouter } from '@/shared/lib/i18n/navigation';

import styles from './CartDrawer.module.scss';
import { useBasket, useClearBasket } from '../../api/client';
import { isCartOpenAtom } from '../../model/atoms';
import { CartTicket } from '../CartTicket/CartTicket';
import { Timer } from '../Timer/Timer';

export const CartDrawer = () => {
  const t = useTranslations('cart-modal');
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
            <span>{t('basket')}</span>
            {count > 0 ? <span className={styles.headerCount}>{count}</span> : null}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('close')}>
            <IoClose size={24} />
          </button>
        </div>

        {count === 0 ? (
          <div className={styles.empty}>
            <ShoppingCart size={44} className={styles.emptyIcon} aria-hidden />
            <div className={styles.emptyText}>{t('empty')}</div>
            <div className={styles.emptySubtext}>{t('will-be')}</div>
            <button type="button" className={styles.emptyBtn} onClick={onGoHome}>
              {t('go-home')}
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
                  <span className={styles.summaryLabel}>{t('tickets-label')}</span>
                  <span className={styles.summaryCount}>{count}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>{t('total-label')}</span>
                  <span className={styles.summaryTotal}>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button type="button" className={styles.buyBtn} onClick={onPurchase}>
                {t('checkout-btn')}
              </button>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={onClear}
                disabled={clearBasket.isPending}
              >
                <Trash2 size={15} aria-hidden /> {t('clear-basket')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
