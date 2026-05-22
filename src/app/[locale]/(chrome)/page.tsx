import { setRequestLocale } from 'next-intl/server';

import { HomeView } from '@/views/home';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeView locale={locale} />;
};

export default HomePage;
