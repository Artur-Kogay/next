import { type ReactNode } from 'react';

import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { brand, env } from '@/shared/config';
import { routing } from '@/shared/i18n/routing';
import { themeInitScript } from '@/shared/lib/theme-init-script';
import { AppProviders } from '@/shared/providers/AppProviders';
import { WebVitals } from '@/shared/providers/WebVitals';

import type { Metadata, Viewport } from 'next';

import '@/shared/styles/globals.scss';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
};

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta-data' });

  const FALLBACKS: Record<string, 'kg' | 'uz' | 'ru' | 'tj'> = {
    tg: 'tj',
    ky: 'kg',
  };
  const code = env.NEXT_PUBLIC_COUNTRY_CODE;
  const metaKey = (FALLBACKS[code] ?? code) as 'kg' | 'uz' | 'ru' | 'tj';
  const safeKey = ['kg', 'uz', 'ru', 'tj'].includes(metaKey) ? metaKey : 'kg';

  const title = t(`${safeKey}.title`);
  const description = t(`${safeKey}.description`);

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: title,
      template: `%s — ${brand.appName}`,
    },
    description,
    alternates: {
      canonical: '/',
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l === routing.defaultLocale ? '' : l}`]),
      ),
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: env.NEXT_PUBLIC_SITE_URL,
      siteName: brand.appName,
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
};

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-accent={brand.accent}
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
        <WebVitals />
      </body>
    </html>
  );
};

export default LocaleLayout;
