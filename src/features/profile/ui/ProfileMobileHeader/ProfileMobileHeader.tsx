'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import styles from './ProfileMobileHeader.module.scss';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';

interface ProfileMobileHeaderProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onLogout: () => void;
}

export const ProfileMobileHeader = ({
  firstName,
  lastName,
  email,
  phone,
  onLogout,
}: ProfileMobileHeaderProps) => {
  const t = useTranslations('profile');

  return (
    <div className={styles.root}>
      <ProfileAvatar firstName={firstName} lastName={lastName} email={email} size="md" />
      <div className={styles.body}>
        <div className={styles.name}>
          {firstName} {lastName}
        </div>
        <div className={styles.phone}>{phone}</div>
      </div>
      <button type="button" className={styles.logout} onClick={onLogout} aria-label={t('exit')}>
        <LogOut size={18} aria-hidden />
      </button>
    </div>
  );
};
