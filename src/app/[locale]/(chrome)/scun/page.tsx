import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ScanView } from '@/views/scan';

import type { Metadata } from 'next';

interface ScunPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: ScunPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'scan' });
  return { title: t('title') };
};

const Page = async ({ params }: ScunPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ScanView />;
};

export default Page;
