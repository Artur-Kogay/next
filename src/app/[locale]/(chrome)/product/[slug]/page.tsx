'use client';

import {useState} from 'react';

import { Crown, Package, Shirt, Banknote } from 'lucide-react';

import { ProductSlider } from '@/entities/banner';
import { Counter } from '@/features/counter';
import { AsideBar } from '@/widgets/asideBar';

import styles from './ProductPage.module.scss';


const MOCK_DATAS = ['/images/ex9.jpg', '/images/ex10.jpg', '/images/ex11.jpg'];

const ProductPage = ({
  title = 'Футболка Egor Kreed',
  author = 'Egor Kreed',
  price = 4990,
  description = `
    <p>Премиальная футболка из хлопка с фирменным дизайном артиста.</p>
    <p>Ограниченный дроп. Подходит для повседневной носки.</p>
  `,
}) => {
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1)

  return (
    <div className={styles.root}>
      <AsideBar
        productName={title}
        productCount={count}
        productPrice={price}
        setIsAsideOpen={setIsAsideOpen}
        isAsideOpen={isAsideOpen}
      />

      <section className={styles.hero}>
        <div className={styles.posterWrap}>
          <ProductSlider images={MOCK_DATAS} />
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.metaRow}>
              <Crown size={18} />
            <span>{author}</span>
          </div>

          <div className={styles.count}>
            <Package size={18} />
            <span>Осталось 2300 товаров</span>
          </div>

          <div className={styles.sizes}>
            <Shirt size={18} />
            <span>Размеры: XS, S, M, XL, XXL</span>
          </div>

          <div className={styles.price}>
            <Banknote size={18} />
            <span className={styles.price_money}>{price}</span>
            <span>сом</span>
          </div>

          <div className={styles.btns}>
            <Counter count={count} setCount={setCount} />
            <button type="button" className={styles.buyButton} onClick={() => setIsAsideOpen(true)}>
              Купить
            </button>
          </div>
        </div>
      </section>

      <div className={styles.bottom}>
        <h2 className={styles.sectionTitle}>Описание</h2>

        <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
};

export default ProductPage;