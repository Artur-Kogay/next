import {ProductsList} from '@/widgets/productsList';

import styles from './CatalogPage.module.scss'

function ProductsPage() {
  return (
    <div className={styles.root}>
      <ProductsList />
    </div>
  );
}

export default ProductsPage;