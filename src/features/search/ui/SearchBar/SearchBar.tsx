'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';

import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EventCard, useSearchSessions } from '@/entities/event';
import { useClickOutside, useDebounce } from '@/shared/lib';
import { usePathname } from '@/shared/lib/i18n/navigation';
import { Loader } from '@/shared/ui';

import styles from './SearchBar.module.scss';
import { type SearchBarProps } from './SearchBar.types';

export const SearchBar = ({ placeholder }: SearchBarProps) => {
  const t = useTranslations('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debounced = useDebounce(query.trim(), 350);

  useEffect(() => {
    setIsOpen(false);
    setQuery('');
  }, [pathname]);

  const { data, isFetching, isError } = useSearchSessions(debounced);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const onClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const hasResults = !!data && data.length > 0;
  const showEmpty = isOpen && debounced.length > 0 && !isFetching && !hasResults;

  return (
    <div ref={containerRef} className={styles.root}>
      <div className={styles.field}>
        <Search className={styles.icon} aria-hidden size={18} />
        <input
          type="search"
          value={query}
          onChange={onChange}
          onFocus={() => debounced.length > 0 && setIsOpen(true)}
          placeholder={placeholder ?? t('searchPlaceholder')}
          className={styles.input}
          aria-label={t('searchPlaceholder')}
        />
        {query.length > 0 ? (
          <button type="button" className={styles.clear} onClick={onClear} aria-label={t('cancel')}>
            <X size={16} aria-hidden />
          </button>
        ) : null}
      </div>

      {isOpen && debounced.length > 0 ? (
        <div className={styles.dropdown} role="listbox">
          {isFetching && !hasResults ? (
            <div className={styles.state}>
              <Loader size="sm" ariaLabel={t('loading')} />
            </div>
          ) : isError ? (
            <div className={styles.state}>{t('error')}</div>
          ) : hasResults ? (
            <div className={styles.results}>
              {data.slice(0, 8).map((session) => (
                <EventCard key={session.id} session={session} />
              ))}
            </div>
          ) : showEmpty ? (
            <div className={styles.state}>{t('emptyResults')}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
