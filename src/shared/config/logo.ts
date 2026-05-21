import { env } from './env';

export interface LogoConfig {
  light: string;
  dark: string;
  width: number;
  height: number;
}

const LOGOS_BY_COUNTRY: Record<string, LogoConfig> = {
  kg: {
    light: '/images/logos/kg/headerLogo.svg',
    dark: '/images/logos/kg/headerLogo.svg',
    width: 160,
    height: 40,
  },
  uz: {
    light: '/images/logos/uz/headerLogo.svg',
    dark: '/images/logos/uz/headerLogo.svg',
    width: 160,
    height: 40,
  },
  tj: {
    light: '/images/logos/tj/headerLogo.svg',
    dark: '/images/logos/tj/headerLogo.svg',
    width: 160,
    height: 40,
  },
};

const COUNTRY_ALIASES: Record<string, string> = {
  tg: 'tj',
  ky: 'kg',
};

const pickLogo = (): LogoConfig => {
  const code = env.NEXT_PUBLIC_COUNTRY_CODE;
  const resolved = COUNTRY_ALIASES[code] ?? code;
  return LOGOS_BY_COUNTRY[resolved] ?? LOGOS_BY_COUNTRY.kg!;
};

export const logo: LogoConfig = pickLogo();
