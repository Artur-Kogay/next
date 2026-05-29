import type { BasketItem, OrderSession } from '../../api/schemas';

export interface EntryTicketsProps {
  item: OrderSession;
  basket: BasketItem[];
}
