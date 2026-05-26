'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { themeAtom } from '@/shared/model/theme';

import styles from './ThemeToggle.module.scss';

export const ThemeToggle = () => {
  const t = useTranslations('common');
  const [theme, setTheme] = useAtom(themeAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={styles.root}
      aria-label={t('switchTheme')}
      aria-pressed={isDark}
    >
      {isDark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
};
