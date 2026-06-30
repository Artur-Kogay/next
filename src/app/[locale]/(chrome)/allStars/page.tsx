'use client';

import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';

import { StarHumanCard, artistsAtom } from '@/entities/starHuman';

import styles from './AllStars.module.scss';

function ProductsPage() {
  const t = useTranslations();
  const stars = useAtomValue(artistsAtom);

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t('allStarsPageTitle')}</h1>
      <section className={styles.starsList}>
        {stars.map((item) => (
          <StarHumanCard
            key={item.id}
            type="artist"
            name={item.name}
            description={item.description}
            image={item.image}
            slug={item.slug}
          />
        ))}
      </section>
    </div>
  );
}

export default ProductsPage;
