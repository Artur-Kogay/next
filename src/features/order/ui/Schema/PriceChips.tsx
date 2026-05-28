'use client';

import { useEffect } from 'react';

import { useAtom } from 'jotai';

import styles from './Schema.module.scss';
import { selectedColorAtom } from '../../model/atoms';

interface PriceChipsProps {
  prices: { color: string; price: number }[];
}

export function PriceChips({ prices }: PriceChipsProps) {
  const [selectedColor, setSelectedColor] = useAtom(selectedColorAtom);

  useEffect(() => {
    return () => setSelectedColor('');
  }, [setSelectedColor]);

  return (
    <div className={styles.priceFilter}>
      <div className={styles.priceFilterInner}>
        <button
          type="button"
          className={`${styles.priceChip} ${!selectedColor ? styles.priceChipActive : ''}`}
          onClick={() => setSelectedColor('')}
        >
          Все
        </button>
        {prices.map((p, i) => {
          if (p.price === 0) return null;
          const active = selectedColor === p.color;
          return (
            <button
              type="button"
              key={i}
              className={`${styles.priceChip} ${active ? styles.priceChipActive : ''}`}
              onClick={() => setSelectedColor((prev) => (prev === p.color ? '' : p.color))}
            >
              <span className={styles.priceDot} style={{ backgroundColor: p.color }} />
              {p.price.toLocaleString()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
