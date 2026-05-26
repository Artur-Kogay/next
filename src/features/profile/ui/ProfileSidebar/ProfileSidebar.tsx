'use client';

import { Bell, LogOut, Shield, Ticket, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib';

import styles from './ProfileSidebar.module.scss';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';

import type { ProfileTab } from '../../model/tabs';

interface ProfileSidebarProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  user: { firstName: string; lastName: string; phone: string; email: string };
  ticketsCount: number;
}

const TAB_ICONS: Record<ProfileTab, React.ReactNode> = {
  orders: <Ticket size={18} aria-hidden />,
  profileData: <UserRound size={18} aria-hidden />,
  security: <Shield size={18} aria-hidden />,
  notifications: <Bell size={18} aria-hidden />,
};

const TAB_ORDER: ProfileTab[] = ['orders', 'profileData'];

export const ProfileSidebar = ({
  active,
  onChange,
  onLogout,
  user,
  ticketsCount,
}: ProfileSidebarProps) => {
  const t = useTranslations('profile');

  return (
    <aside className={styles.root}>
      <div className={styles.identity}>
        <ProfileAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          size="lg"
        />
        <div>
          <div className={styles.name}>
            {user.firstName} {user.lastName}
          </div>
          <div className={styles.phone}>{user.phone}</div>
        </div>
      </div>

      <nav className={styles.nav} aria-label={t('title')}>
        {TAB_ORDER.map((tab) => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              type="button"
              className={cn(styles.item, isActive && styles.itemActive)}
              onClick={() => onChange(tab)}
            >
              <span className={styles.itemIcon}>{TAB_ICONS[tab]}</span>
              <span className={styles.itemLabel}>{t(tab)}</span>
              {tab === 'orders' && ticketsCount > 0 ? (
                <span className={styles.itemBadge}>{ticketsCount}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button type="button" className={styles.logout} onClick={onLogout}>
          <LogOut size={18} aria-hidden />
          <span>{t('exit')}</span>
        </button>
      </div>
    </aside>
  );
};
