'use client';

import { useRef, useState } from 'react';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

import { Link, usePathname } from '@/shared/i18n/navigation';
import { routing } from '@/shared/i18n/routing';
import { useClickOutside } from '@/shared/lib';

import styles from './LocaleSwitcher.module.scss';

export const LocaleSwitcher = () => {
  const active = useLocale();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div ref={containerRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={16} aria-hidden />
        <span className={styles.label}>{active.toUpperCase()}</span>
      </button>
      {open ? (
        <ul className={styles.menu} role="listbox">
          {routing.locales.map((locale) => (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                className={styles.item}
                aria-current={locale === active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {locale.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
