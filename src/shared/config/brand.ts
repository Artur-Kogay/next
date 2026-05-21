import { env } from './env';

/** Доступные бренд-цвета. Каждый соответствует шкале в палитре. */
export type AccentColor = 'blue' | 'orange' | 'violet' | 'red' | 'cyan' | 'yellow';

export interface BrandConfig {
  appName: string;
  phone: string;
  email: string;
  address: string;
  copyright: string;
  telegram: string;
  instagram: string;
  support: string;
  accent: AccentColor;
}

const BRANDS: Record<string, BrandConfig> = {
  showgotj: {
    appName: 'ShowGo.tj',
    phone: '+996 704 144 155',
    email: 'info@showgo.tj',
    address: '',
    copyright: 'ООО "ShowGo Services TJ"',
    telegram: 'https://t.me/showgotj_official',
    instagram: 'https://www.instagram.com/showgo.tj/',
    support: 'https://t.me/showgotj',
    accent: 'blue',
  },
  kassir: {
    appName: 'Kassir.kg',
    phone: '+996 704 144 155',
    email: 'info@kassir.kg',
    address: 'г.Бишкек, ул. Исанова 105/3',
    copyright: 'ОсОО "Билет Онлайн"',
    telegram: 'https://t.me/kassirkgz',
    instagram: 'https://www.instagram.com/kassir.kg/',
    support: 'https://wa.me/996700266933',
    accent: 'yellow',
  },
  showgo: {
    appName: 'ShowGo.uz',
    phone: '+998 90 005 26 46',
    email: 'info@showgo.uz',
    address: '',
    copyright: 'ООО "ShowGo Services"',
    telegram: 'https://t.me/showgouz_official',
    instagram: 'https://www.instagram.com/showgo.uz/',
    support: 'https://t.me/showgouz',
    accent: 'blue',
  },
};

export const brand: BrandConfig = BRANDS[env.NEXT_PUBLIC_APP_NAME] ?? BRANDS.showgotj!;
