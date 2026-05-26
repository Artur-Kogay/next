'use client';

import { Monitor, Phone, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import styles from './SecurityTab.module.scss';
import { SettingRow } from '../SettingRow/SettingRow';

export const SecurityTab = () => {
  const t = useTranslations('profile');

  return (
    <div className={styles.root}>
      <SettingRow
        icon={<Phone size={20} aria-hidden />}
        title={t('change-phone')}
        hint={t('change-phone-hint')}
        action={{ kind: 'button', label: t('edit') }}
      />
      <SettingRow
        icon={<Monitor size={20} aria-hidden />}
        title={t('active-sessions')}
        hint={t('active-sessions-hint')}
        action={{ kind: 'button', label: t('edit') }}
      />
      <SettingRow
        icon={<Trash2 size={20} aria-hidden />}
        title={t('delete-account')}
        hint={t('delete-account-hint')}
        variant="danger"
        action={{ kind: 'button', label: t('delete-account') }}
      />
    </div>
  );
};
