import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LogotipsView } from '@/views/logotips';

import type { Metadata } from 'next';

interface LogotipsPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({ params }: LogotipsPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'footer' });
  return { title: t('logo') };
};

const Page = async ({ params }: LogotipsPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LogotipsView />;
};

export default Page;
