'use client';

import { useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { COUNTRIES, type Country } from '@/shared/config';
import { useClickOutside } from '@/shared/lib';

import styles from './CountryPicker.module.scss';

interface CountryPickerProps {
  value: Country;
  onChange: (country: Country) => void;
}

export const CountryPicker = ({ value, onChange }: CountryPickerProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div ref={containerRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.flag} aria-hidden>
          {value.flag}
        </span>
        <span className={styles.dial}>+{value.dial}</span>
        <ChevronDown size={14} aria-hidden className={styles.chevron} />
      </button>

      {open ? (
        <ul className={styles.menu} role="listbox">
          {COUNTRIES.map((country) => {
            const isActive = country.code === value.code;
            return (
              <li key={country.code}>
                <button
                  type="button"
                  className={styles.item}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                >
                  <span className={styles.flag} aria-hidden>
                    {country.flag}
                  </span>
                  <span className={styles.itemName}>{country.name}</span>
                  <span className={styles.itemDial}>+{country.dial}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
