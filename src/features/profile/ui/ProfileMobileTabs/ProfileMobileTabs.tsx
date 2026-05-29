'use client';

import { Bell, Shield, Ticket, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib';

import styles from './ProfileMobileTabs.module.scss';
import { ORDER, type ProfileMobileTabsProps } from './ProfileMobileTabs.types';

import type { ProfileTab } from '../../model/tabs';

const ICONS: Record<ProfileTab, React.ReactNode> = {
  orders: <Ticket size={16} aria-hidden />,
  profileData: <UserRound size={16} aria-hidden />,
  security: <Shield size={16} aria-hidden />,
  notifications: <Bell size={16} aria-hidden />,
};

export const ProfileMobileTabs = ({ active, onChange }: ProfileMobileTabsProps) => {
  const t = useTranslations('profile');

  return (
    <div className={styles.root}>
      {ORDER.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            type="button"
            className={cn(styles.item, isActive && styles.itemActive)}
            onClick={() => onChange(tab)}
          >
            {ICONS[tab]}
            <span>{t(tab)}</span>
          </button>
        );
      })}
    </div>
  );
};
