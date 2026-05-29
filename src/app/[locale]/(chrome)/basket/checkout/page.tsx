import { setRequestLocale } from 'next-intl/server';

import { Checkout } from '@/features/checkout';
import { getPaymentMethods } from '@/features/checkout/server';
import { brand } from '@/shared/config';

import type { Metadata } from 'next';

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = (): Metadata => ({
  title: `Оформление заказа — ${brand.appName}`,
});

const Page = async ({ params }: CheckoutPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const paymentMethods = await getPaymentMethods(locale);

  return <Checkout paymentMethods={paymentMethods} />;
};

export default Page;
