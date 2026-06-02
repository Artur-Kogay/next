import { notFound } from 'next/navigation';

import { setRequestLocale } from 'next-intl/server';

import { getContentPage } from '@/entities/content/server';
import { env } from '@/shared/config';
import { ContentView } from '@/views/content';

import type { Metadata } from 'next';

interface ContentPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamic = 'force-dynamic';

const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const generateMetadata = async ({ params }: ContentPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  const page = await getContentPage(slug, locale);

  if (!page) {
    return { title: 'Page not found' };
  }

  const description = stripHtml(page.content).slice(0, 160);

  return {
    title: page.title,
    description,
    openGraph: {
      title: page.title,
      description,
      url: `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/${locale}/content/${page.slug}`,
      type: 'article',
    },
  };
};

const Page = async ({ params }: ContentPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = await getContentPage(slug, locale);
  if (!page) notFound();

  return <ContentView page={page} />;
};

export default Page;
