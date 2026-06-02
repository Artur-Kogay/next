import { COUNTRY_ALIASES } from './countries';
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

const WEBVIEW_LOGOS: Record<string, Set<string>> = {
  kg: new Set(['bakai', 'megapay', 'demir_webhook', 'kicb_webhook', 'kompanion']),
  uz: new Set(['demir_webhook', 'kicb_webhook']),
  tj: new Set(),
};

const resolveCountry = (): string => {
  const code = env.NEXT_PUBLIC_COUNTRY_CODE;
  return COUNTRY_ALIASES[code] ?? code;
};

const pickLogo = (): LogoConfig => {
  const country = resolveCountry();
  return LOGOS_BY_COUNTRY[country] ?? LOGOS_BY_COUNTRY.kg!;
};

export const logo: LogoConfig = pickLogo();

export const getWebviewLogo = (webview: string | null | undefined): string | null => {
  if (!webview) return null;
  const country = resolveCountry();
  const supported = WEBVIEW_LOGOS[country];
  if (!supported?.has(webview)) return null;
  return `/images/logos/${country}/${webview}/headerLogo.svg`;
};
