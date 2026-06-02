'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { TicketScanner } from '@/features/ticket-scan';
import { useRouter } from '@/shared/lib/i18n/navigation';
import { isAuthAtom, tokenAtom } from '@/shared/model';
import { Loader } from '@/shared/ui';

import styles from './ScanView.module.scss';

export const ScanView = () => {
  const t = useTranslations('scan');
  const router = useRouter();
  const params = useSearchParams();

  const isAuth = useAtomValue(isAuthAtom);
  const setToken = useSetAtom(tokenAtom);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const routeToken = params.get('token');
    if (routeToken) setToken(routeToken);
  }, [params, setToken]);

  useEffect(() => {
    if (mounted && !isAuth && !params.get('token')) {
      router.replace('/auth?redirect=/scun');
    }
  }, [mounted, isAuth, params, router]);

  if (!mounted || !isAuth) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t('title')}</h1>
      <TicketScanner />
    </div>
  );
};
