'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { Link, usePathname } from '@/shared/lib/i18n/navigation';
import { LocaleSwitcher } from '@/widgets/header/ui/LocaleSwitcher/LocaleSwitcher';

import styles from './Burger.module.scss';

export default function Burger() {
  const [open, setOpen] = useState(false);
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
              Звезды
            </Link>
            <Link className={pathname === '/catalog' ? styles.activeLink : ''} href={'/catalog'}>
              Каталог
            </Link>
          </div>
          <LocaleSwitcher />
        </div>
      </div>

      {open && <button className={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  );
}
