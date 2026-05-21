import { env } from './env';

export interface CurrencyConfig {
  code: 'KGS' | 'TJS' | 'RUB' | 'UZS';
  label: string;
}

const BY_COUNTRY: Record<string, CurrencyConfig> = {
  kg: { code: 'KGS', label: 'сом' },
  tj: { code: 'TJS', label: 'сомони' },
  ru: { code: 'RUB', label: '₽' },
  uz: { code: 'UZS', label: 'сум' },
};

const ALIASES: Record<string, string> = {
  tg: 'tj',
};

const pick = (): CurrencyConfig => {
  const code = env.NEXT_PUBLIC_COUNTRY_CODE;
  const resolved = ALIASES[code] ?? code;
  return BY_COUNTRY[resolved] ?? BY_COUNTRY.kg!;
};

export const currency: CurrencyConfig = pick();
