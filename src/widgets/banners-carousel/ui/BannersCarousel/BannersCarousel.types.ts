import { type Banner } from '@/entities/banner';

export interface BannersCarouselProps {
  banners: Banner[];
  variant?: 'main' | 'strip';
}
