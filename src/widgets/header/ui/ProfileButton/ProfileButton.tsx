'use client';

import { User } from 'lucide-react';

import styles from './ProfileButton.module.scss';

export const ProfileButton = () => {
  const onClick = () => {};

  return (
    <button type="button" onClick={onClick} className={styles.root} aria-label="Profile">
      <User size={18} aria-hidden />
    </button>
  );
};
