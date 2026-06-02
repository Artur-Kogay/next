'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { CalendarDays, Clock, Globe, MapPin, Ticket } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Discounts, getEventDiscounts } from '@/entities/event';
import { currency, IMAGES_URL } from '@/shared/config';
import { cn, useBrowser } from '@/shared/lib';
import { Link } from '@/shared/lib/i18n/navigation';

import styles from './SessionView.module.scss';
import { type SessionViewProps } from './SessionView.types';

export const SessionView = ({ session }: SessionViewProps) => {
  const format = useFormatter();
  const t = useTranslations('event');
  const { isInstagram } = useBrowser();

  const title = session.event?.title ?? '';
  const posterSrc = session.event?.image_path ? IMAGES_URL + session.event.image_path : null;
  const venue = session.event?.theater?.title ?? '';
  const region = session.event?.theater?.region?.title ?? '';
  const address = session.event?.theater?.address?.title ?? '';
  const dbLat = session.event?.theater?.address?.location_lat;
  const dbLng = session.event?.theater?.address?.location_lng;
  const hasCoords = dbLat != null && dbLng != null;
  const coords: [number, number] | null = hasCoords ? [dbLng, dbLat] : null;
  const ageRestriction = session.event?.age_restriction;
  const language = session.language;
  const description = session.event?.description;

  const discounts = getEventDiscounts(session.event?.id);

  const isSoldOut = session.left_tickets_count != null && session.left_tickets_count <= 0;
  const isInactive =
    !['ACTIVE', 'active'].includes(session.status ?? '') ||
    ['COMPLETED', 'AWAITING_CLARIFICATION'].includes(session.event?.is_active ?? '');
  const isDisabled = isSoldOut || isInactive || !!session.is_informational;

  const pinned = !isInstagram && !isDisabled;

  const sessionDate = useMemo(() => {
    try {
      const d = new Date(session.date_time);
      return format.dateTime(d, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return session.date_time;
    }
  }, [session.date_time, format]);

  const otherSessions = useMemo(() => {
    if (!session.other_sessions?.length) return [];
    return session.other_sessions.map((s) => {
      const d = new Date(s.date_time);
      const label = format.dateTime(d, {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      return { slug: s.slug, label, active: s.slug === session.slug };
    });
  }, [session.other_sessions, session.slug, format]);

  const duration = useMemo(() => {
    const raw = session.event?.duration;
    if (raw == null) return null;
    if (typeof raw === 'number') {
      const h = Math.floor(raw / 60);
      const m = raw % 60;
      if (h > 0 && m > 0) return `${h} ${t('hours-short')} ${m} ${t('minutes-short')}`;
      if (h > 0) return `${h} ${t('hours-short')}`;
      return `${m} ${t('minutes-short')}`;
    }
    return raw;
  }, [session.event?.duration, t]);

  const languageLabel = useMemo(() => {
    if (!language) return null;
    const lower = language.toLowerCase();
    if (lower === 'ru') return t('lang-ru');
    if (lower === 'en') return t('lang-en');
    return language;
  }, [language, t]);

  const buyLabel = useMemo(() => {
    if (isSoldOut) return t('sold-out');
    if (isInactive) return t('sales-ended');
    return t('buy-ticket');
  }, [isSoldOut, isInactive, t]);

  return (
    <div className={cn(styles.root, pinned && styles.rootPinned)}>
      <section className={styles.hero}>
        <div className={styles.posterWrap}>
          {posterSrc ? (
            <Image
              src={posterSrc}
              alt={title}
              width={600}
              height={800}
              className={styles.poster}
              priority
            />
          ) : null}
          {ageRestriction ? (
            <span className={styles.ageBadge}>
              {t('age-restriction', { age: ageRestriction.replace('+', '') })}
            </span>
          ) : null}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.metaRow}>
            <CalendarDays size={16} className={styles.metaIcon} aria-hidden />
            <span>{sessionDate}</span>
          </div>
          {venue ? (
            <div className={styles.metaRow}>
              <MapPin size={16} className={styles.metaIcon} aria-hidden />
              <span>
                {venue}
                {region ? ` · ${region}` : ''}
                {address ? `, ${address}` : ''}
              </span>
            </div>
          ) : null}
          {duration ? (
            <div className={styles.metaRow}>
              <Clock size={16} className={styles.metaIcon} aria-hidden />
              <span>{duration}</span>
            </div>
          ) : null}
          {session.left_tickets_count != null && session.left_tickets_count > 0 ? (
            <div className={styles.metaRow}>
              <Ticket size={16} className={styles.metaIcon} aria-hidden />
              <span>{t('tickets-left', { count: session.left_tickets_count })}</span>
            </div>
          ) : null}
          {language ? (
            <div className={styles.metaRow}>
              <Globe size={16} className={styles.metaIcon} aria-hidden />
              <span>
                {t('lang')}: {languageLabel}
              </span>
            </div>
          ) : null}

          {session.min_price != null ? (
            <div className={styles.priceRow}>
              <span className={styles.priceFrom}>{t('from')}</span>
              <span className={styles.price}>{session.min_price.toLocaleString('ru-RU')}</span>
              <span className={styles.priceCurrency}>{currency.label}</span>
            </div>
          ) : null}

          {isDisabled ? (
            <button type="button" className={styles.buyButton} disabled>
              {buyLabel}
            </button>
          ) : pinned ? (
            <div className={styles.buyDock}>
              <Link
                href={`/session/${session.slug}/order`}
                className={cn(styles.buyButton, styles.buyButtonPinned)}
              >
                {buyLabel}
              </Link>
            </div>
          ) : (
            <Link href={`/session/${session.slug}/order`} className={styles.buyButton}>
              {buyLabel}
            </Link>
          )}

          <Discounts discounts={discounts} />
        </div>
      </section>

      {otherSessions.length > 1 ? (
        <section className={styles.datesSection}>
          <h2 className={styles.datesTitle}>{t('other-dates')}</h2>
          <div className={styles.dates}>
            {otherSessions.map((s) => (
              <Link
                key={s.slug}
                href={`/session/${s.slug}`}
                className={cn(styles.dateChip, s.active && styles.dateChipActive)}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className={styles.bottom}>
        {description ? (
          <section>
            <h2 className={styles.sectionTitle}>{t('description')}</h2>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
          </section>
        ) : null}

        {venue ? (
          <section className={styles.venueSection}>
            <h2 className={styles.sectionTitle}>{t('address')}</h2>
            <div className={styles.venueRow}>
              <MapPin size={16} className={styles.venueRowIcon} aria-hidden />
              <span>
                {venue}
                {region ? ` · ${region}` : ''}
                {address ? `, ${address}` : ''}
              </span>
            </div>
            {coords ? (
              <div className={styles.mapWrap}>
                <YMaps>
                  <Map defaultState={{ center: coords, zoom: 15 }} width="100%" height="100%">
                    <Placemark geometry={coords} />
                  </Map>
                </YMaps>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
};
