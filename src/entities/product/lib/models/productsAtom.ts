import { atom } from 'jotai';

export type Product = {
  id: number;
  title: string;
  price: number;
  author: string;
  image: string;
  slug: string;
  new?: boolean;
};

export const productsAtom = atom<Product[]>([
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
]);
