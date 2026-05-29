'use client';

import { useEffect } from 'react';

import { useAtom } from 'jotai';

import styles from './PriceChips.module.scss';
import { type PriceChipsProps } from './PriceChips.types';
import { selectedColorAtom } from '../../model/atoms';

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
