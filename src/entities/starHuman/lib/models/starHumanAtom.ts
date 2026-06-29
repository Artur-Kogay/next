import { atom } from 'jotai';

export type Artist = {
  id: number;
  name: string;
  description: string;
  image: string;
  category: 'singer' | 'artist' | 'comedian';
  slug: string;
};

export const artistsAtom = atom<Artist[]>([
  {
    id: 1,
    name: 'Егор Крид',
    description: 'Певец поп-музыки',
    image: '/images/ex4.jpg',
    category: 'singer',
    slug: 'egor-krid',
  },
  {
    id: 2,
    name: 'Тимати',
    description: 'Рэпер и продюсер',
    image: '/images/ex5.jpg',
    category: 'artist',
    slug: 'timati',
  },
  {
    id: 3,
    name: 'Jah Khalib',
    description: 'Певец и автор треков',
    image: '/images/ex6.jpg',
    category: 'singer',
    slug: 'jah-khalib',
  },
  {
    id: 4,
    name: 'Азамат Мусагалиев',
    description: 'Комик и телеведущий',
    image: '/images/ex7.jpg',
    category: 'comedian',
    slug: 'azamat-musagaliev',
  },
  {
    id: 5,
    name: 'Максим Галкин',
    description: 'Комик и шоумен',
    image: '/images/ex4.jpg',
    category: 'comedian',
    slug: 'maxim-galkin',
  },
  {
    id: 6,
    name: 'Баста',
    description: 'Рэпер и музыкант',
    image: '/images/ex5.jpg',
    category: 'artist',
    slug: 'basta',
  },
  {
    id: 7,
    name: 'Zivert',
    description: 'Певица поп-сцены',
    image: '/images/ex6.jpg',
    category: 'singer',
    slug: 'zivert',
  },
  {
    id: 8,
    name: 'Noize MC',
    description: 'Рок и рэп исполнитель',
    image: '/images/ex7.jpg',
    category: 'artist',
    slug: 'noize-mc',
  },
  {
    id: 9,
    name: 'Иван Ургант',
    description: 'Телеведущий и комик',
    image: '/images/ex4.jpg',
    category: 'comedian',
    slug: 'ivan-urgant',
  },
  {
    id: 10,
    name: 'Morgenshtern',
    description: 'Рэпер и шоумен',
    image: '/images/ex5.jpg',
    category: 'artist',
    slug: 'morgenshtern',
  },
]);
