'use client';

import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SearchBar } from '@/features/search';
import { brand } from '@/shared/config';
import { Link } from '@/shared/lib/i18n/navigation';

import styles from './Header.module.scss';
import { CartButton } from '../CartButton/CartButton';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';
import { Logo } from '../Logo/Logo';
import { ProfileButton } from '../ProfileButton/ProfileButton';

export const Header = () => {
  const t = useTranslations('common');

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label={brand.appName}>
          <Logo alt={brand.appName} />
        </Link>

        <div className={styles.searchSlot}>
          <SearchBar placeholder={t('searchPlaceholder')} />
        </div>

        <div className={styles.actions}>
          <a className={styles.phone} href={`tel:${brand.phone.replace(/\s+/g, '')}`}>
            <Phone size={14} aria-hidden />
            <span>{brand.phone}</span>
          </a>
          <LocaleSwitcher />
          <CartButton />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};
