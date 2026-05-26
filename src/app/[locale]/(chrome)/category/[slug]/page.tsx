import { setRequestLocale } from 'next-intl/server';

import { getCategories } from '@/entities/category/server';
import { brand } from '@/shared/config';
import { CategoryView } from '@/views/category';

import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateMetadata = async ({ params }: CategoryPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  try {
    const categories = await getCategories(locale);
    const current = categories.find((c) => c.slug === slug);
    if (!current) return { title: 'Not found' };
    return { title: `${current.title} — ${brand.appName}` };
  } catch {
    return { title: brand.appName };
  }
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <CategoryView locale={locale} slug={slug} />;
};

export default CategoryPage;
