import Image from 'next/image';

import { useFormatter, useTranslations } from 'next-intl';

import { IMAGES_URL, currency } from '@/shared/config';
import { Link } from '@/shared/i18n/navigation';

import styles from './EventCard.module.scss';
import { type SessionListItem } from '../../api/schemas';

interface EventCardProps {
  session: SessionListItem;
  priority?: boolean;
}

export const EventCard = ({ session, priority = false }: EventCardProps) => {
  const t = useTranslations('main-page');
  const format = useFormatter();

  const { event, min_price, date_time, slug } = session;
  const imgSrc = event.image_path ? `${IMAGES_URL}${event.image_path}` : null;
  const date = new Date(date_time);

  const priceLabel = event.is_free
    ? t('free')
    : min_price != null
      ? t('price-from', { price: format.number(min_price), currency: currency.label })
      : t('sold-out');

  const priceClass = event.is_free
    ? styles.priceBadgeFree
    : min_price != null
      ? styles.priceBadge
      : styles.priceBadgeMuted;

  const weekday = format.dateTime(date, { weekday: 'short' });
  const dayMonth = format.dateTime(date, { day: 'numeric', month: 'long' });
  const time = format.dateTime(date, { hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/session/${slug}`} className={styles.root}>
      <div className={styles.imageWrap}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden />
        )}

        {event.is_pinned ? <span className={styles.pinBadge}>{t('hit')}</span> : null}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title} title={event.title}>
          {event.title}
        </h3>

        <time className={styles.date} dateTime={date_time}>
          {weekday}, {dayMonth} {time}
        </time>

        <span className={priceClass}>{priceLabel}</span>
      </div>
    </Link>
  );
};
