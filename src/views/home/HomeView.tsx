import { getTranslations } from 'next-intl/server';

import { getBanners } from '@/entities/banner/server';
import { FilterArtistsList } from '@/features/filterArtists';
import { BannersCarousel } from '@/widgets/banners-carousel';
import { MobileSearch } from '@/widgets/header';
import { ProductsList } from '@/widgets/productsList';
import { StarsList } from '@/widgets/starsList';

import styles from './HomeView.module.scss';
import { type HomeViewProps } from './HomeView.types';

export const HomeView = async ({ locale }: HomeViewProps) => {
  const [banners, t] = await Promise.all([getBanners(locale), getTranslations()]);

  return (
    <div className={styles.root}>
      <MobileSearch />

      {banners.length > 0 ? (
        <section className={styles.hero}>
          <BannersCarousel banners={banners} />
        </section>
      ) : null}

      <h2 className={styles.title}>{t('homePage.stars')}</h2>
      <FilterArtistsList />
      <StarsList />

      <h2 className={styles.title}>{t('homePage.products')}</h2>
      <ProductsList />
    </div>
  );
};
