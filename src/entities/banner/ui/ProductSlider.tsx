'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { useState } from 'react';

import Image from 'next/image';

import clsx from 'clsx';
import { type Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import styles from './ProductSlider.module.scss';

interface ProductSliderProps {
    images: string[]
}

function ProductSlider({ images }: ProductSliderProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  return (
    <div className={styles.root}>
      <div className={styles.slider}>
        <Swiper
          modules={[Autoplay]}
          onSwiper={setSwiper}
          className={styles.slider}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index} className={styles.slider_slide}>
              <Image
                src={image}
                alt={'slide'}
                className={styles.poster}
                priority={index === 0}
                fill
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.pagination}>
        {images?.map((img, index) => (
          <button
            key={index}
            type="button"
            className={clsx(styles.bullet, active === index && styles.active)}
            onClick={() => swiper?.slideToLoop(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductSlider;