export interface Country {
  code: 'kg' | 'tj' | 'uz' | 'ru' | 'kz';
  dial: string;
  maxDigits: number;
  flag: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: 'kg', dial: '996', maxDigits: 9, flag: '🇰🇬', name: 'Кыргызстан' },
  { code: 'tj', dial: '992', maxDigits: 9, flag: '🇹🇯', name: 'Таджикистан' },
  { code: 'uz', dial: '998', maxDigits: 9, flag: '🇺🇿', name: 'Узбекистан' },
  { code: 'ru', dial: '7', maxDigits: 10, flag: '🇷🇺', name: 'Россия' },
  { code: 'kz', dial: '7', maxDigits: 10, flag: '🇰🇿', name: 'Казахстан' },
];

export const COUNTRY_ALIASES: Record<string, Country['code']> = {
  tg: 'tj',
  ky: 'kg',
};
