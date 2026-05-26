'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { tokenAtom, userIdAtom } from '@/features/auth';
import { useRouter } from '@/shared/i18n/navigation';
import { Loader } from '@/shared/ui';

import styles from './Profile.module.scss';
import { useOrders, useProfileData } from '../../api/client';
import { type ProfileTab } from '../../model/tabs';
import { NotificationsTab } from '../NotificationsTab/NotificationsTab';
import { ProfileDataTab } from '../ProfileDataTab/ProfileDataTab';
import { ProfileMobileHeader } from '../ProfileMobileHeader/ProfileMobileHeader';
import { ProfileMobileTabs } from '../ProfileMobileTabs/ProfileMobileTabs';
import { SecurityTab } from '../SecurityTab/SecurityTab';
import { TicketsTab } from '../TicketsTab/TicketsTab';

const splitName = (full: string | null | undefined): { first: string; last: string } => {
  const parts = (full ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') };
};

export const Profile = () => {
  const t = useTranslations('profile');
  const router = useRouter();
  const token = useAtomValue(tokenAtom);
  const setToken = useSetAtom(tokenAtom);
  const setUserId = useSetAtom(userIdAtom);
  const [tab, setTab] = useState<ProfileTab>('orders');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && token === null) {
      router.replace({ pathname: '/auth', query: { redirect: '/profile' } });
    }
  }, [mounted, token, router]);

  const enabled = mounted && !!token;
  const profile = useProfileData(enabled);
  const completed = useOrders('completed', enabled);
  const pending = useOrders('pending_for_payment', enabled);

  const onLogout = useCallback(() => {
    setToken(null);
    setUserId(null);
    router.replace('/');
  }, [setToken, setUserId, router]);

  const { upcomingOrders, pastOrders } = useMemo(() => {
    const completedList = completed.data ?? [];
    const pendingList = pending.data ?? [];
    const now = Date.now();
    const upcoming: typeof completedList = [];
    const past: typeof completedList = [];

    for (const order of completedList) {
      const firstDate = order.items[0]?.event_date;
      const ts = firstDate ? new Date(firstDate).getTime() : NaN;
      if (!Number.isNaN(ts) && ts >= now) upcoming.push(order);
      else past.push(order);
    }

    for (const order of pendingList) {
      if (order.items.length > 0) upcoming.push(order);
    }

    upcoming.sort(
      (a, b) =>
        new Date(a.items[0]?.event_date ?? 0).getTime() -
        new Date(b.items[0]?.event_date ?? 0).getTime(),
    );
    past.sort(
      (a, b) =>
        new Date(b.items[0]?.event_date ?? 0).getTime() -
        new Date(a.items[0]?.event_date ?? 0).getTime(),
    );
    return { upcomingOrders: upcoming, pastOrders: past };
  }, [completed.data, pending.data]);

  const ordersLoading = completed.isPending || pending.isPending;
  const profileLoading = profile.isPending;

  const { first, last } = splitName(profile.data?.full_name);

  const renderTab = () => {
    if (tab === 'orders')
      return <TicketsTab upcoming={upcomingOrders} past={pastOrders} loading={ordersLoading} />;
    if (tab === 'profileData') {
      if (profileLoading || !profile.data) {
        return (
          <div className={styles.loader}>
            <Loader />
          </div>
        );
      }
      return <ProfileDataTab user={profile.data} />;
    }
    if (tab === 'security') return <SecurityTab />;
    if (tab === 'notifications') return <NotificationsTab />;
    return null;
  };

  if (!mounted || !token) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <ProfileMobileHeader
        firstName={first}
        lastName={last}
        email={profile.data?.email ?? ''}
        phone={profile.data?.phone_number ?? ''}
        onLogout={onLogout}
      />

      <ProfileMobileTabs active={tab} onChange={setTab} />

      <div className={styles.header}>
        <h1 className={styles.title}>{t(tab)}</h1>
      </div>

      {renderTab()}
    </div>
  );
};
