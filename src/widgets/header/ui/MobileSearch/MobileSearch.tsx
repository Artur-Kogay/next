'use client';

import { useTranslations } from 'next-intl';

import { SearchBar } from '@/features/search';

import styles from './MobileSearch.module.scss';

/**
 * Поисковая строка, которая на мобиле живёт отдельной полосой
 * между хедером и контентом. На десктопе скрыта (там поиск в хедере).
 */
export const MobileSearch = () => {
  const t = useTranslations('common');

  return (
    <div className={styles.root}>
      <SearchBar placeholder={t('searchPlaceholder')} />
    </div>
  );
};
