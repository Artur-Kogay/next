'use client';

import { ShoppingCart } from 'lucide-react';

import styles from './CartButton.module.scss';

interface CartButtonProps {
  count?: number;
}

export const CartButton = ({ count = 0 }: CartButtonProps) => {
  const onClick = () => {};

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.root}
      aria-label={`Cart${count > 0 ? ` (${count})` : ''}`}
    >
      <ShoppingCart size={18} aria-hidden />
      {count > 0 ? <span className={styles.badge}>{count}</span> : null}
    </button>
  );
};
