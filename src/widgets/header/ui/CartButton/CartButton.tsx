'use client';

import { ShoppingCart } from 'lucide-react';

import styles from './CartButton.module.scss';

export const CartButton = () => {
  return (
    <button type="button" className={styles.root} aria-label="Cart">
      <ShoppingCart size={18} aria-hidden />
    </button>
  );
};
