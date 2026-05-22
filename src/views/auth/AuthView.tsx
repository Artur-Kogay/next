'use client';

import { useCallback } from 'react';

import { useSearchParams } from 'next/navigation';

import { AuthFlow, sanitizeRedirect } from '@/features/auth';
import { useRouter } from '@/shared/i18n/navigation';

import styles from './AuthView.module.scss';

export const AuthView = () => {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = sanitizeRedirect(params.get('redirect'));

  const onSuccess = useCallback(() => {
    router.replace(redirect);
  }, [redirect, router]);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <AuthFlow onSuccess={onSuccess} cancelHref={redirect} />
      </div>
    </div>
  );
};
