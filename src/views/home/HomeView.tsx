import { getTranslations } from 'next-intl/server';

import { getBanners } from '@/entities/banner/server';
import { FilterArtistsList } from '@/features/filterArtists';
import { BannersCarousel } from '@/widgets/banners-carousel';
import { MobileSearch } from '@/widgets/header';
import {StarsList} from '@/widgets/starsList'

import styles from './HomeView.module.scss';
import { type HomeViewProps } from './HomeView.types';


export const HomeView = async ({ locale }: HomeViewProps) => {
  const [banners] = await Promise.all([
    getBanners(locale),
    getTranslations({ locale, namespace: 'main-page' }),
  ]);

  return (
    <div className={styles.root}>
      <MobileSearch />

      {banners.length > 0 ? (
        <section className={styles.hero}>
          <BannersCarousel banners={banners} />
        </section>
      ) : null}

      <FilterArtistsList />
      
      <StarsList />
    </div>
  );
};
