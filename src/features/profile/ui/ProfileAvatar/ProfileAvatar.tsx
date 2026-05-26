import { useMemo } from 'react';

import { cn } from '@/shared/lib';

import styles from './ProfileAvatar.module.scss';

interface ProfileAvatarProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProfileAvatar = ({
  firstName,
  lastName,
  email,
  size = 'md',
  className,
}: ProfileAvatarProps) => {
  const initials = useMemo(() => {
    const first = firstName?.trim()?.[0] ?? '';
    const last = lastName?.trim()?.[0] ?? '';
    const fallback = email?.trim()?.[0] ?? '?';
    return (first + last || fallback).toUpperCase();
  }, [firstName, lastName, email]);

  return (
    <div className={cn(styles.root, styles[size], className)} aria-hidden>
      {initials}
    </div>
  );
};
