'use client';

import Image from 'next/image';

import { Crown, Package, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ProductsList } from '@/widgets/productsList';

import styles from './StarPage.module.scss';

const Page = () => {
  const t = useTranslations();

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.posterWrap}>
          <Image
            src={'/images/ex5.jpg'}
            alt={'image'}
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
            19 {t('products')}
          </div>

          <div className={styles.subscribes}>
            <Users size={18} /> 200000 {t('subscribes')}
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
      <h2 className={styles.title}>{t('artistsProductsTitle')}</h2>
      <ProductsList />
    </div>
  );
};

export default Page;
