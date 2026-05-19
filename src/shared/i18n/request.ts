import { type AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

type Locale = (typeof routing.locales)[number];

const isLocale = (value: string | undefined): value is Locale =>
  !!value && (routing.locales as readonly string[]).includes(value);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = isLocale(requested) ? requested : routing.defaultLocale;

  const mod = (await import(`../../../messages/${locale}.json`)) as {
    default: AbstractIntlMessages;
  };

  return {
    locale,
    messages: mod.default,
  };
});
