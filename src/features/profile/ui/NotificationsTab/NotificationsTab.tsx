'use client';

import { Bell, Mail, MessageSquare, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';

import styles from './NotificationsTab.module.scss';
import { SettingRow } from '../SettingRow/SettingRow';

export const NotificationsTab = () => {
  const t = useTranslations('profile');

  return (
    <div className={styles.root}>
      <SettingRow
        icon={<Mail size={20} aria-hidden />}
        title={t('notifications-email')}
        hint={t('notifications-email-hint')}
        action={{ kind: 'toggle', defaultOn: true }}
      />
      <SettingRow
        icon={<MessageSquare size={20} aria-hidden />}
        title={t('notifications-sms')}
        hint={t('notifications-sms-hint')}
        action={{ kind: 'toggle', defaultOn: true }}
      />
      <SettingRow
        icon={<Bell size={20} aria-hidden />}
        title={t('notifications-push')}
        hint={t('notifications-push-hint')}
        action={{ kind: 'toggle', defaultOn: false }}
      />
      <SettingRow
        icon={<Tag size={20} aria-hidden />}
        title={t('notifications-promo')}
        hint={t('notifications-promo-hint')}
        action={{ kind: 'toggle', defaultOn: false }}
      />
    </div>
  );
};
