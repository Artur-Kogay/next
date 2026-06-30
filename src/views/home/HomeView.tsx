import { getTranslations } from 'next-intl/server';

import { getBanners } from '@/entities/banner/server';
import { ProductCard } from '@/entities/product';
import { FilterArtistsList } from '@/features/filterArtists';
import { BannersCarousel } from '@/widgets/banners-carousel';
import { MobileSearch } from '@/widgets/header';
import { StarsList } from '@/widgets/starsList';

import styles from './HomeView.module.scss';
import { type HomeViewProps } from './HomeView.types';

export const HomeView = async ({ locale }: HomeViewProps) => {
  const [banners, t] = await Promise.all([getBanners(locale), getTranslations()]);

  const products = [
    {
      id: 1,
      title: 'Худи Black Oversize',
      price: 4990,
      author: 'Тимати',
      image: '/images/ex8.jpg',
      slug: 'hoodie-black-oversize',
      new: true,
    },
    {
      id: 2,
      title: 'Футболка White Basic',
      price: 1990,
      author: 'Егор Крид',
      image: '/images/ex9.jpg',
      slug: 'tshirt-white-basic',
      new: true,
    },
    {
      id: 3,
      title: 'Кепка Street Black',
      price: 1490,
      author: 'Тимати',
      image: '/images/ex10.jpg',
      slug: 'cap-street-black',
      new: true,
    },
    {
      id: 4,
      title: 'Свитшот Grey Minimal',
      price: 3590,
      author: 'JONY',
      image: '/images/ex8.jpg',
      slug: 'sweatshirt-grey-minimal',
      new: true,
    },
    {
      id: 5,
      title: 'Худи Neon Green',
      price: 5290,
      author: 'Егор Крид',
      image: '/images/ex9.jpg',
      slug: 'hoodie-neon-green',
      new: true,
    },
    {
      id: 6,
      title: 'Футболка Oversize Black',
      price: 2190,
      author: 'Макс Корж',
      image: '/images/ex10.jpg',
      slug: 'tshirt-oversize-black',
      new: true,
    },
    {
      id: 7,
      title: 'Штаны Cargo Street',
      price: 6490,
      author: 'Тимати',
      image: '/images/ex8.jpg',
      slug: 'cargo-pants-street',
      new: true,
    },
    {
      id: 8,
      title: 'Худи Classic Grey',
      price: 4790,
      author: 'JONY',
      image: '/images/ex9.jpg',
      slug: 'hoodie-classic-grey',
      new: true,
    },
    {
      id: 9,
      title: 'Лонгслив White Clean',
      price: 2390,
      author: 'Егор Крид',
      image: '/images/ex10.jpg',
      slug: 'longsleeve-white-clean',
      new: true,
    },
    {
      id: 10,
      title: 'Футболка Dark Wave',
      price: 1990,
      author: 'Макс Корж',
      image: '/images/ex8.jpg',
      slug: 'tshirt-dark-wave',
      new: true,
    },
  ];

  return (
    <div className={styles.root}>
      <MobileSearch />

      {banners.length > 0 ? (
        <section className={styles.hero}>
          <BannersCarousel banners={banners} />
        </section>
      ) : null}

      <h2 className={styles.title}>{t('homePage.stars')}</h2>
      <FilterArtistsList />
      <StarsList />

      <h2 className={styles.title}>{t('homePage.products')}</h2>
      <section className={styles.products}>
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
};
