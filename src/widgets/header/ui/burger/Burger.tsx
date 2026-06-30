'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/shared/lib/i18n/navigation';
import { LocaleSwitcher } from '@/widgets/header/ui/LocaleSwitcher/LocaleSwitcher';

import styles from './Burger.module.scss';

export default function Burger() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        className={clsx(styles.burger, open && styles.open)}
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label="menu"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={clsx(styles.menu, open && styles.menuOpen)}>
        <div className={styles.menu_content}>
          <div className={styles.links}>
            <Link className={pathname === '/' ? styles.activeLink : ''} href={'/'}>
              {t('appHeader.main')}
            </Link>
            <Link className={pathname === '/allStars' ? styles.activeLink : ''} href={'/allStars'}>
              {t('appHeader.stars')}
            </Link>
            <Link className={pathname === '/catalog' ? styles.activeLink : ''} href={'/catalog'}>
              {t('appHeader.catalog')}
            </Link>
          </div>
          <LocaleSwitcher />
        </div>
      </div>

      {open && <button className={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  );
}
