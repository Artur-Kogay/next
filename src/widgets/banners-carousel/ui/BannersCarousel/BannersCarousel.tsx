'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

import { type Banner } from '@/entities/banner';
import { BANNERS_URL } from '@/shared/config';
import { Link } from '@/shared/i18n/navigation';

import styles from './BannersCarousel.module.scss';

interface BannersCarouselProps {
  banners: Banner[];
  variant?: 'main' | 'strip';
}

export const BannersCarousel = ({ banners, variant = 'main' }: BannersCarouselProps) => {
  const validBanners = useMemo(() => banners.filter((b) => b.image_path), [banners]);

  const plugins = useMemo(
    () => (validBanners.length > 1 ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []),
    [validBanners.length],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: validBanners.length > 1, align: 'center' },
    plugins,
  );

  const [selectedIdx, setSelectedIdx] = useState(0);

  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIdx(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  if (validBanners.length === 0) return null;

  const isStrip = variant === 'strip';
  const w = isStrip ? 1280 : 1280;
  const h = isStrip ? 120 : 480;

  return (
    <section className={`${styles.root} ${isStrip ? styles.strip : ''}`}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.track}>
          {validBanners.map((banner, idx) => (
            <div key={banner.id} className={styles.slide}>
              <Link href={banner.link || '/'} className={styles.link}>
                <Image
                  src={`${BANNERS_URL}${banner.image_path}`}
                  alt=""
                  width={w}
                  height={h}
                  className={styles.image}
                  priority={idx === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {validBanners.length > 1 ? (
        <div className={styles.dots}>
          {validBanners.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              className={styles.dot}
              aria-label={`Slide ${idx + 1}`}
              aria-current={idx === selectedIdx}
              onClick={() => scrollTo(idx)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};
