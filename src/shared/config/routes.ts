import { env } from './env';

export const ROUTES = {
  home: '/',
  search: '/search',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

const stripSlash = (url: string) => url.replace(/\/$/, '');

/** CDN-префикс для баннеров: `${API}/storage/banners/<image_path>` */
export const BANNERS_URL = `${stripSlash(env.NEXT_PUBLIC_BASE_API_URL)}/storage/banners/`;

/** CDN-префикс для картинок событий и др.: `${API}/storage/images/<image_path>` */
export const IMAGES_URL = `${stripSlash(env.NEXT_PUBLIC_BASE_API_URL)}/storage/images/`;
