import { setRequestLocale } from 'next-intl/server';

import { ProfileView } from '@/views/profile';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileView />;
};

export default ProfilePage;
