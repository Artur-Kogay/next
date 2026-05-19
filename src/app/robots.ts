import { env } from '@/shared/config/env';

import type { MetadataRoute } from 'next';


const robots = (): MetadataRoute.Robots => {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
};

export default robots;
