import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Checkout } from '@/features/checkout';
import { getPaymentMethods } from '@/features/checkout/server';

import type { Metadata } from 'next';

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({ params }: CheckoutPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout' });
  return {
    title: t('title'),
  };
};

const Page = async ({ params }: CheckoutPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const paymentMethods = await getPaymentMethods(locale);

  return <Checkout paymentMethods={paymentMethods} />;
};

export default Page;
