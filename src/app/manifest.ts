import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => {
  return {
    name: 'Client Web',
    short_name: 'Client Web',
    description: 'Next.js 15 + React 19 + FSD scaffold',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
};

export default manifest;
