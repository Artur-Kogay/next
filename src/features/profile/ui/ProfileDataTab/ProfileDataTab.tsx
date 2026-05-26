'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { CalendarDays, Mail, Phone, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib';

import styles from './ProfileDataTab.module.scss';
import { useUpdateProfile } from '../../api/client';
import { splitName } from '../../lib/helpers';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';

import type { Gender, ProfileResponse } from '../../api/schemas';

interface ProfileDataTabProps {
  user: ProfileResponse;
}

const isoToDateInput = (raw: string | null | undefined): string => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
};

export const ProfileDataTab = ({ user }: ProfileDataTabProps) => {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');
  const updateProfile = useUpdateProfile();

  const initial = splitName(user.full_name);
  const [firstName, setFirstName] = useState(initial.first);
  const [lastName, setLastName] = useState(initial.last);
  const [email, setEmail] = useState(user.email ?? '');
  const [birthday, setBirthday] = useState(isoToDateInput(user.birthday));
  const [gender, setGender] = useState<Gender | null>(user.gender ?? null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!savedAt) return;
    const id = setTimeout(() => setSavedAt(null), 2500);
    return () => clearTimeout(id);
  }, [savedAt]);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await updateProfile.mutateAsync({
          full_name: `${firstName} ${lastName}`.trim(),
          email,
          birthday: birthday || undefined,
          gender: gender ? (gender.toLowerCase() as 'male' | 'female') : undefined,
        });
        setSavedAt(Date.now());
      } catch {
        // swallow — error surfaced via mutation state below
      }
    },
    [updateProfile, firstName, lastName, email, birthday, gender],
  );

  const errorMessage =
    updateProfile.error?.message && !updateProfile.isPending ? updateProfile.error.message : null;

  return (
    <div className={styles.root}>
      <form className={styles.card} noValidate onSubmit={onSubmit}>
        <div className={styles.head}>
          <ProfileAvatar firstName={firstName} lastName={lastName} email={email} size="lg" />
          <div className={styles.headBody}>
            <div className={styles.name}>
              {firstName} {lastName}
            </div>
            <div className={styles.hint}>{t('personal-info-hint')}</div>
          </div>
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>{tCommon('name')}</span>
            <div className={styles.inputWrap}>
              <UserRound size={16} className={styles.inputIcon} aria-hidden />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('name-placeholder')}
                className={styles.input}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{tCommon('last-name')}</span>
            <div className={styles.inputWrap}>
              <UserRound size={16} className={styles.inputIcon} aria-hidden />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('last-name-placeholder')}
                className={styles.input}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{tCommon('email')}</span>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email-placeholder')}
                className={styles.input}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>{t('birthday')}</span>
            <div className={styles.inputWrap}>
              <CalendarDays size={16} className={styles.inputIcon} aria-hidden />
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder={t('birthday-placeholder')}
                className={styles.input}
              />
            </div>
          </label>

          <label className={cn(styles.field, styles.fieldFull)}>
            <span className={styles.label}>{tCommon('phone')}</span>
            <div className={styles.inputWrap}>
              <Phone size={16} className={styles.inputIcon} aria-hidden />
              <input
                type="tel"
                value={user.phone_number}
                readOnly
                disabled
                className={styles.input}
              />
            </div>
          </label>

          <div className={cn(styles.field, styles.fieldFull)}>
            <span className={styles.label}>{t('gender')}</span>
            <div className={styles.genderRow}>
              <button
                type="button"
                onClick={() => setGender('MALE')}
                className={cn(styles.gender, gender === 'MALE' && styles.genderActive)}
              >
                {t('male')}
              </button>
              <button
                type="button"
                onClick={() => setGender('FEMALE')}
                className={cn(styles.gender, gender === 'FEMALE' && styles.genderActive)}
              >
                {t('female')}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {errorMessage ? (
            <span className={styles.errorHint}>{errorMessage}</span>
          ) : savedAt ? (
            <span className={styles.savedHint}>{t('saved')}</span>
          ) : null}
          <button type="submit" className={styles.submit} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? t('saving') : tCommon('save')}
          </button>
        </div>
      </form>
    </div>
  );
};
