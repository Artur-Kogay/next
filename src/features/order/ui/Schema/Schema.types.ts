import type { BasketItem, OrderItem, OrderSession } from '../../api/schemas';

export type SectorState = {
  id: string;
  title: string;
};

export interface SchemaProps {
  item: OrderSession;
  orderItems: OrderItem[];
  schemaHtml: string;
  basket: BasketItem[];
}
