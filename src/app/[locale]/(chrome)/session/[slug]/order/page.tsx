import { notFound } from 'next/navigation';

import { setRequestLocale } from 'next-intl/server';

import { OrderPage } from '@/features/order';
import { getOrderSession, getSchemeHtml } from '@/features/order/server';
import { brand } from '@/shared/config';

import type { Metadata } from 'next';

interface OrderPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateMetadata = async ({ params }: OrderPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  try {
    const session = await getOrderSession(slug, locale);
    if (!session) return { title: 'Not found' };

    return {
      title: `${session.event.title} — ${brand.appName}`,
    };
  } catch {
    return { title: brand.appName };
  }
};

const Page = async ({ params }: OrderPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = await getOrderSession(slug, locale);
  if (!item) notFound();

  let schemaHtml = '';
  if (item.scheme?.html_path) {
    schemaHtml = await getSchemeHtml(item.scheme.html_path);
  }

  return <OrderPage item={item} schemaHtml={schemaHtml} />;
};

export default Page;
