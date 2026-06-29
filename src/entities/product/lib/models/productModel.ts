export interface IProductModel {
  id: number;
  title: string;
  price: number;
  author: string;
  image: string;
  slug: string;
  new?: boolean;
}
