'use client';

import { useTranslations } from 'next-intl';

import { SearchBar } from '@/features/search';

import styles from './MobileSearch.module.scss';

export const MobileSearch = () => {
  const t = useTranslations('common');

  return (
    <div className={styles.root}>
      <SearchBar placeholder={t('searchPlaceholder')} />
    </div>
  );
};
