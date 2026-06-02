'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib';
import { themeAtom, type Theme } from '@/shared/model/theme';

import styles from './ThemeToggle.module.scss';

const OPTIONS: {
  value: Theme;
  Icon: typeof Sun;
  labelKey: 'themeLight' | 'themeSystem' | 'themeDark';
}[] = [
  { value: 'light', Icon: Sun, labelKey: 'themeLight' },
  { value: 'system', Icon: Monitor, labelKey: 'themeSystem' },
  { value: 'dark', Icon: Moon, labelKey: 'themeDark' },
];

export const ThemeToggle = () => {
  const t = useTranslations('common');
  const [theme, setTheme] = useAtom(themeAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={styles.root} role="radiogroup" aria-label={t('switchTheme')}>
      {OPTIONS.map(({ value, Icon, labelKey }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(labelKey)}
            className={cn(styles.option, active && styles.optionActive)}
            onClick={() => setTheme(value)}
          >
            <Icon size={16} aria-hidden />
          </button>
        );
      })}
    </div>
  );
};
