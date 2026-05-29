'use client';

import { useSetAtom } from 'jotai';
import { ShoppingCart } from 'lucide-react';

import { isCartOpenAtom, useBasket } from '@/features/order';

import styles from './CartButton.module.scss';

export const CartButton = () => {
  const { data: cart } = useBasket();
  const setCartOpen = useSetAtom(isCartOpenAtom);

  const count = cart?.basket.length ?? 0;

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className={styles.root}
      aria-label={`Cart${count > 0 ? ` (${count})` : ''}`}
    >
      <ShoppingCart size={18} aria-hidden />
      {count > 0 ? <span className={styles.badge}>{count}</span> : null}
    </button>
  );
};
