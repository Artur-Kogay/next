'use client';

import { useAtomValue } from 'jotai';
import { User } from 'lucide-react';

import { isAuthAtom } from '@/features/auth';
import { usePathname, useRouter } from '@/shared/i18n/navigation';

import styles from './ProfileButton.module.scss';

export const ProfileButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuth = useAtomValue(isAuthAtom);

  const onClick = () => {
    if (isAuth) {
      router.push('/profile');
      return;
    }

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const back = `${pathname}${search}`;

    router.push({
      pathname: '/auth',
      query: { redirect: back },
    });
  };

  return (
    <button type="button" onClick={onClick} className={styles.root} aria-label="Profile">
      <User size={18} aria-hidden />
    </button>
  );
};
