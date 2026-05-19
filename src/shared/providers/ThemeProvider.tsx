'use client';

import { useEffect, type ReactNode } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { resolvedThemeAtom, themeAtom } from '@/shared/model/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useAtomValue(themeAtom);
  const setResolved = useSetAtom(resolvedThemeAtom);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const resolved =
        theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      document.documentElement.setAttribute('data-theme', resolved);
      setResolved(resolved);
    };

    apply();

    if (theme === 'system') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    return undefined;
  }, [theme, setResolved]);

  return <>{children}</>;
};
