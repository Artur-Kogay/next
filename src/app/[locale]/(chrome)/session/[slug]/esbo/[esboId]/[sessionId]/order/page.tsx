import { notFound } from 'next/navigation';

import { setRequestLocale } from 'next-intl/server';

import { EsboOrderPage } from '@/features/order';
import {
  getEsboPricing,
  getEsboSeats,
  getOrderSession,
  getSchemeHtml,
} from '@/features/order/server';
import { brand } from '@/shared/config';

import type { Metadata } from 'next';

interface EsboPageProps {
  params: Promise<{ locale: string; slug: string; esboId: string; sessionId: string }>;
}

export const generateMetadata = async ({ params }: EsboPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  try {
    const session = await getOrderSession(slug, locale);
    if (!session) return { title: 'Not found' };
    return { title: `${session.event.title} — ${brand.appName}` };
  } catch {
    return { title: brand.appName };
  }
};

const Page = async ({ params }: EsboPageProps) => {
  const { locale, slug, sessionId } = await params;
  setRequestLocale(locale);

  const item = await getOrderSession(slug, locale);
  if (!item) notFound();

  const [esboPricing, esboSeats] = await Promise.all([
    getEsboPricing(sessionId, locale),
    getEsboSeats(sessionId, locale),
  ]);

  if (!esboPricing.length || !esboSeats.length) notFound();

  const schemaHtml = item.scheme?.html_path ? await getSchemeHtml(item.scheme.html_path) : '';

  return (
    <EsboOrderPage
      item={item}
      schemaHtml={schemaHtml}
      esboPricing={esboPricing}
      esboSeats={esboSeats}
    />
  );
};

export default Page;
