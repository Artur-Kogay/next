import { setRequestLocale } from 'next-intl/server';

import { AuthView } from '@/views/auth';

export const dynamic = 'force-dynamic';

interface AuthPageProps {
  params: Promise<{ locale: string }>;
}

const AuthPage = async ({ params }: AuthPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuthView />;
};

export default AuthPage;
