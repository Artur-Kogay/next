'use client';

import { useSetAtom } from 'jotai';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useBasket } from '@/entities/basket';
import { formatPrice } from '@/shared/config/currency';

import styles from './CheckoutCta.module.scss';
import { isCartOpenAtom } from '../../model/atoms';

export const CheckoutCta = () => {
  const t = useTranslations('cart-modal');
  const { data: cart } = useBasket();
  const setCartOpen = useSetAtom(isCartOpenAtom);
  const basket = cart?.basket ?? [];
  const count = basket.length;

  if (count === 0) return null;

  const total = basket.reduce((sum, t) => sum + t.price + t.service_fee, 0);

  return (
    <button type="button" className={styles.cta} onClick={() => setCartOpen(true)}>
      <span className={styles.count}>{count}</span>
      <span className={styles.label}>{t('go-to-checkout')}</span>
      <span className={styles.total}>{formatPrice(total)}</span>
      <ArrowRight size={18} aria-hidden />
    </button>
  );
};
