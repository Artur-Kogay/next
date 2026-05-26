import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import { getCategories } from '@/entities/category/server';
import { EventCard } from '@/entities/event';
import { CategoriesNav } from '@/widgets/categories-nav';

import styles from './CategoryView.module.scss';

interface CategoryViewProps {
  locale: string;
  slug: string;
}

export const CategoryView = async ({ locale, slug }: CategoryViewProps) => {
  const [categories, t] = await Promise.all([
    getCategories(locale),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const current = categories.find((c) => c.slug === slug);
  if (!current) notFound();

  const sessions = current.last_sessions;

  return (
    <div className={styles.root}>
      <CategoriesNav categories={categories} />

      <h1 className={styles.title}>{current.title}</h1>

      {sessions.length > 0 ? (
        <div className={styles.grid}>
          {sessions.map((session, idx) => (
            <EventCard key={session.id} session={session} priority={idx < 6} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>{t('emptyResults')}</div>
      )}
    </div>
  );
};
