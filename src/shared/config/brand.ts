import { env } from './env';

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
};

export const brand: BrandConfig = BRANDS[env.NEXT_PUBLIC_APP_NAME] ?? BRANDS.showgotj!;
