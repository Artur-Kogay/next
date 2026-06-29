'use client'

import Image from 'next/image';

import { ProductsList } from '@/widgets/productsList';

import { Crown, Package, Users, BookText } from 'lucide-react';

import styles from './StarPage.module.scss';

const Page = ({
                           name,
                            }: {
  type: 'artist';
  name: string;
  description: string;
  image?: string;
  slug: string;
}) => {

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.posterWrap}>
          <Image
            src={'/images/ex5.jpg'}
            alt={name}
            width={600}
            height={500}
            className={styles.poster}
            priority
          />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>Егор Крид</h1>

          <div className={styles.typeBadge}>
            <Crown size={18} />
            Певец
          </div>

          <div className={styles.products}>
            <Package size={18} />
            19 товаров
          </div>

          <div className={styles.subscribes}>
            <Users size={18} /> 200000 подписчиков
          </div>

          <div className={styles.description}>
            Егор Крид — российский певец, автор песен, музыкант и один из самых узнаваемых
            представителей современной поп-музыки. Свою творческую карьеру он начал еще в
            подростковом возрасте, публикуя собственные композиции и каверы в интернете. Благодаря
            таланту, харизме и современному звучанию его работы быстро привлекли внимание широкой
            аудитории, что стало началом успешного пути на большой сцене.
          </div>
        </div>
      </section>
      <h2 className={styles.title}>Товары звезды</h2>
      <ProductsList />
    </div>
  );
};

export default Page;