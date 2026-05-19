import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

export const themeAtom = atomWithStorage<Theme>(THEME_STORAGE_KEY, 'system', undefined, {
  getOnInit: false,
});

export const resolvedThemeAtom = atom<ResolvedTheme>('light');
