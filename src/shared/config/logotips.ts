import { COUNTRY_ALIASES } from './countries';
import { env } from './env';

export interface LogotipItem {
  path: string;
  isBlack: boolean;
  withoutMaxWidth?: boolean;
  isWhite?: boolean;
}

const LOGOTIPS_BY_COUNTRY: Record<string, LogotipItem[]> = {
  kg: [
    { path: '/logosPage/kg/allTicketsRow.png', isBlack: false, withoutMaxWidth: true },
    { path: '/logosPage/kg/allTickets.png', isBlack: false },
    { path: '/logosPage/kg/baseLogo.png', isBlack: false },
    { path: '/logosPage/kg/withoutBG.png', isBlack: false },
    { path: '/logosPage/kg/white.png', isBlack: true },
    { path: '/logosPage/kg/black.png', isBlack: false, isWhite: true },
  ],
  uz: [
    { path: '/logosPage/uz/headLineLogo.png', isBlack: false },
    { path: '/logosPage/uz/allTickets.png', isBlack: false },
    { path: '/logosPage/uz/BlackBg.png', isBlack: false },
    { path: '/logosPage/uz/white.png', isBlack: true },
    { path: '/logosPage/uz/WhiteBG.png', isBlack: true },
    { path: '/logosPage/uz/whiteBgWithoutBorder.png', isBlack: true },
  ],
  tj: [
    { path: '/logosPage/tj/default.svg', isBlack: false },
    { path: '/logosPage/tj/default-white.svg', isBlack: false },
    { path: '/logosPage/tj/black.svg', isBlack: true },
    { path: '/logosPage/tj/border.svg', isBlack: true, isWhite: true },
  ],
};

export const getLogotips = (): LogotipItem[] => {
  const code = env.NEXT_PUBLIC_COUNTRY_CODE;
  const resolved = COUNTRY_ALIASES[code] ?? code;
  return LOGOTIPS_BY_COUNTRY[resolved] ?? [];
};
