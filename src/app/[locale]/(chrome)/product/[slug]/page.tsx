'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Crown, Package, Shirt, Banknote } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();

  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);
  const [size, setSize] = useState<string>('');

  return (
    <div className={styles.root}>
      <AsideBar
        productName={title}
        productCount={count}
        productPrice={price}
        setIsAsideOpen={setIsAsideOpen}
        isAsideOpen={isAsideOpen}
        productSize={size}
      />

      <section className={styles.hero}>
        <div className={styles.posterWrap}>
          {MOCK_DATAS.map((image) => (
            <Image
              key={image}
              className={styles.poster}
              src={image}
              width={500}
              height={500}
              alt="image"
            />
          ))}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.metaRow}>
            <Crown size={18} />
            <span>{author}</span>
          </div>

          <div className={styles.count}>
            <Package size={18} />
            <span>
              {t('left')} 2300 {t('products')}
            </span>
          </div>

          <div className={styles.sizes}>
            <Shirt size={18} />
            <span>{t('sizes')}: XS, S, M, XL, XXL</span>
          </div>

          <div className={styles.price}>
            <Banknote size={18} />
            <span className={styles.price_money}>{price}</span>
            <span>{t('som')}</span>
          </div>

          <div className={styles.bottom}>
            <h2 className={styles.sectionTitle}>{t('description')}</h2>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
          </div>

          <div className={styles.btns}>
            <div className={styles.btns_actions}>
              <Counter count={count} setCount={setCount} />
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className={styles.select}
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <button type="button" className={styles.buyButton} onClick={() => setIsAsideOpen(true)}>
              {t('buy')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
