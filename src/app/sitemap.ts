import { env } from '@/shared/config/env';
import { routing } from '@/shared/i18n/routing';

import type { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const paths = ['/'];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => {
      const url =
        locale === routing.defaultLocale
          ? `${base}${path}`
          : `${base}/${locale}${path === '/' ? '' : path}`;
      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '/' ? 1 : 0.7,
      };
    }),
  );
};

export default sitemap;
