/* eslint-disable @next/next/no-img-element */
'use client';

import { useTranslations } from 'next-intl';

import { brand, getLogotips } from '@/shared/config';
import { cn } from '@/shared/lib';

import styles from './LogotipsView.module.scss';

export const LogotipsView = () => {
  const t = useTranslations('footerpages');
  const items = getLogotips();

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.gallery}>
          {items.map((item) => {
            const imgClass = item.withoutMaxWidth ? styles.imgWide : styles.img;
            if (item.isBlack) {
              return (
                <div key={item.path} className={styles.blackBlock}>
                  <a href={item.path} download>
                    <img className={imgClass} src={item.path} alt="logo" />
                  </a>
                </div>
              );
            }
            return (
              <a
                key={item.path}
                href={item.path}
                download
                className={cn(styles.lightLink, item.isWhite && styles.whiteBg)}
              >
                <img className={imgClass} src={item.path} alt="logo" />
              </a>
            );
          })}
        </div>

        <div className={styles.text}>
          <p className={styles.heading}>{t('logotipsstep1')}</p>
          <p>{t('logotipsstep2')}</p>
          <p>
            {t('logotipsstep3')}{' '}
            <a href={`mailto:${brand.email}`} className={styles.link}>
              {brand.email}
            </a>
          </p>
          <p>{t('logotipsstep4')}</p>
          <p>
            {t('logotipsstep5')}{' '}
            <a href={`mailto:${brand.email}`} className={styles.link}>
              {brand.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
