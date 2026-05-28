'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { CalendarDays, Clock, Globe, MapPin, Ticket } from 'lucide-react';
import { useFormatter } from 'next-intl';

import { Discounts, getEventDiscounts, type SessionDetail } from '@/entities/event';
import { currency, IMAGES_URL } from '@/shared/config';
import { cn } from '@/shared/lib';
import { Link } from '@/shared/lib/i18n/navigation';

import styles from './SessionView.module.scss';

interface SessionViewProps {
  session: SessionDetail;
}

const formatDuration = (raw: string | number | null | undefined): string | null => {
  if (raw == null) return null;
  if (typeof raw === 'number') {
    const h = Math.floor(raw / 60);
    const m = raw % 60;
    if (h > 0 && m > 0) return `${h} ч ${m} мин`;
    if (h > 0) return `${h} ч`;
    return `${m} мин`;
  }
  return raw;
};

export const SessionView = ({ session }: SessionViewProps) => {
  const format = useFormatter();

  const title = session.event?.title ?? '';
  const posterSrc = session.event?.image_path ? IMAGES_URL + session.event.image_path : null;
  const venue = session.event?.theater?.title ?? '';
  const region = session.event?.theater?.region?.title ?? '';
  const address = session.event?.theater?.address?.title ?? '';
  const dbLat = session.event?.theater?.address?.location_lat;
  const dbLng = session.event?.theater?.address?.location_lng;
  const hasCoords = dbLat != null && dbLng != null;
  const coords: [number, number] | null = hasCoords ? [dbLng, dbLat] : null;
  const duration = formatDuration(session.event?.duration);
  const ageRestriction = session.event?.age_restriction;
  const language = session.language;
  const description = session.event?.description;

  const discounts = getEventDiscounts(session.event?.id);

  const isSoldOut = session.left_tickets_count != null && session.left_tickets_count <= 0;
  const isInactive =
    !['ACTIVE', 'active'].includes(session.status ?? '') ||
    ['COMPLETED', 'AWAITING_CLARIFICATION'].includes(session.event?.is_active ?? '');
  const isDisabled = isSoldOut || isInactive || !!session.is_informational;

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

  const buyLabel = useMemo(() => {
    if (isSoldOut) return 'Билеты распроданы';
    if (isInactive) return 'Продажа завершена';
    return 'Купить билет';
  }, [isSoldOut, isInactive]);

  return (
    <div className={styles.root}>
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
            <span className={styles.ageBadge}>от {ageRestriction.replace('+', '')} лет</span>
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
              <span>Осталось {session.left_tickets_count} билетов</span>
            </div>
          ) : null}
          {language ? (
            <div className={styles.metaRow}>
              <Globe size={16} className={styles.metaIcon} aria-hidden />
              <span>
                Язык:{' '}
                {language.toLowerCase() === 'ru'
                  ? 'русский'
                  : language.toLowerCase() === 'en'
                    ? 'английский'
                    : language}
              </span>
            </div>
          ) : null}

          {session.min_price != null ? (
            <div className={styles.priceRow}>
              <span className={styles.priceFrom}>от</span>
              <span className={styles.price}>{session.min_price.toLocaleString('ru-RU')}</span>
              <span className={styles.priceCurrency}>{currency.label}</span>
            </div>
          ) : null}

          {isDisabled ? (
            <button type="button" className={styles.buyButton} disabled>
              {buyLabel}
            </button>
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
          <h2 className={styles.datesTitle}>Другие даты</h2>
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
            <h2 className={styles.sectionTitle}>Описание</h2>
            <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
          </section>
        ) : null}

        {venue ? (
          <section className={styles.venueSection}>
            <h2 className={styles.sectionTitle}>Место проведения</h2>
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
