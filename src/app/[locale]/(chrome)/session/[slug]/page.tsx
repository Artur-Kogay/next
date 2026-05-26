import { notFound } from 'next/navigation';

import { setRequestLocale } from 'next-intl/server';

import { getSession } from '@/entities/event/server';
import { brand, IMAGES_URL } from '@/shared/config';
import { SessionView } from '@/views/session';

import type { Metadata } from 'next';

interface SessionPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const generateMetadata = async ({ params }: SessionPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  try {
    const session = await getSession(slug, locale);
    if (!session) return { title: 'Not found' };

    const title = `${session.event?.title ?? slug} — ${brand.appName}`;
    const image = session.event?.image_path ? IMAGES_URL + session.event.image_path : undefined;

    return {
      title,
      openGraph: image ? { images: [{ url: image }] } : undefined,
    };
  } catch {
    return { title: brand.appName };
  }
};

const SessionPage = async ({ params }: SessionPageProps) => {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const session = await getSession(slug, locale);
  if (!session) notFound();

  return <SessionView session={session} />;
};

export default SessionPage;
