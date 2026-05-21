import { getTranslations } from 'next-intl/server';

import { getBanners } from '@/entities/banner/server';
import { getCategories } from '@/entities/category/server';
import { getPopular } from '@/entities/event/server';
import { BannersCarousel } from '@/widgets/banners-carousel';
import { CategoriesNav } from '@/widgets/categories-nav';
import { EventsSection } from '@/widgets/events-section';

import styles from './HomeView.module.scss';

interface HomeViewProps {
  locale: string;
}

export const HomeView = async ({ locale }: HomeViewProps) => {
  const [banners, categories, popular, t] = await Promise.all([
    getBanners(locale),
    getCategories(locale),
    getPopular(locale),
    getTranslations({ locale, namespace: 'main-page' }),
  ]);

  const visibleCategories = categories.filter((c) => c.last_sessions.length > 0);
  return (
    <div className={styles.root}>
      {banners.length > 0 ? (
        <section className={styles.hero}>
          <BannersCarousel banners={banners} />
        </section>
      ) : null}

      {visibleCategories.length > 0 ? <CategoriesNav categories={visibleCategories} /> : null}

      {popular.length > 0 ? (
        <EventsSection title={t('popular')} sessions={popular} anchorId="popular" priorityImages />
      ) : null}

      {visibleCategories.map((category) => (
        <div key={category.id} className={styles.categoryBlock}>
          <EventsSection
            title={category.title}
            sessions={category.last_sessions}
            anchorId={`cat-${category.slug}`}
          />
          {category.banners.length > 0 ? (
            <div className={styles.categoryStrip}>
              <BannersCarousel banners={category.banners} variant="strip" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};
