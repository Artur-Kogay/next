'use client';

import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';

import { ProductCard, productsAtom } from '@/entities/product';

import styles from './CatalogPage.module.scss';

function ProductsPage() {
  const t = useTranslations();
  const products = useAtomValue(productsAtom);

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t('catalogPageTitle')}</h1>
      <section className={styles.productsList}>
        {products.map((item) => (
          <ProductCard
            key={item.id}
            slug={item.slug}
            title={item.title}
            image={item.image}
            price={item.price}
            new={item.new}
            author={item.author}
          />
        ))}
      </section>
    </div>
  );
}

export default ProductsPage;
