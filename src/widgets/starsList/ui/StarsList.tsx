'use client';

import { useAtomValue } from 'jotai';

import { StarHumanCard, artistsAtom } from '@/entities/starHuman';
import { selectedArtistCategoryAtom } from '@/shared/model';

import styles from './StarsList.module.scss';

interface ContentSectionProps {
  title?: string;
}

const StarsList = ({ title }: ContentSectionProps) => {
  const artists = useAtomValue(artistsAtom);
  const selectedCategory = useAtomValue(selectedArtistCategoryAtom);

  const filteredArtists =
    selectedCategory === 'all'
      ? artists
      : artists.filter((artist) => artist.category === selectedCategory);

  if (!filteredArtists.length) return null;

  return (
    <section className={styles.root}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}

      <div className={styles.grid}>
        {filteredArtists.map((item) => (
          <StarHumanCard
            key={item.id}
            type="artist"
            name={item.name}
            description={item.description}
            image={item.image}
            slug={item.slug}
          />
        ))}
      </div>
    </section>
  );
};

export default StarsList;
