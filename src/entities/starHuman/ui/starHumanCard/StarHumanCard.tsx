import Image from 'next/image';

import { Link } from '@/shared/lib/i18n/navigation';

import styles from './StarHumanCard.module.scss';

type StarHumanCardProps = {
  type: 'artist';
  slug: string;
  name: string;
  description: string;
  image?: string;
  onClick?: () => void;
};

const StarHumanCard = ({
                                slug,
                                name,
                                description,
                                image,
                                onClick,
                              }: StarHumanCardProps) => {

  return (
    <Link href={`/star/${slug}`} className={styles.root} onClick={onClick}>
      <div className={styles.imageWrap}>
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden />
        )}

        <span className={styles.pinBadge}>Artist</span>

      </div>

      <div className={styles.body}>
        <h3 className={styles.title} title={name}>
          {name}
        </h3>

        <p className={styles.date}>{description}</p>
      </div>
    </Link>
  );
};

export default StarHumanCard;