'use client';

import { useAtomValue } from 'jotai';

import { ProductCard, productsAtom } from '@/entities/product';

import styles from './ProductsList.module.scss';

interface ProductsListProps {
  title?: string;
  searchQuery?: string;
}

const ProductsList = ({ title }: ProductsListProps) => {
  const products = useAtomValue(productsAtom);

  return (
    <section className={styles.root}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}

      <div className={styles.grid}>
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
      </div>
    </section>
  );
};

export default ProductsList;
