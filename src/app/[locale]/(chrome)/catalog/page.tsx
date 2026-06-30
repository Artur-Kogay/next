import { getTranslations } from 'next-intl/server';

import { ProductsList } from '@/widgets/productsList';

import styles from './CatalogPage.module.scss';

async function ProductsPage() {
  const t = await getTranslations();

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{t('catalogPageTitle')}</h1>
      <ProductsList />
    </div>
  );
}

export default ProductsPage;
