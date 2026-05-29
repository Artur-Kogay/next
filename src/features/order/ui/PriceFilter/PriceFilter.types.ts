import type { OrderItem, OrderSession } from '../../api/schemas';

export interface PriceFilterProps {
  item: OrderSession;
  orderItems: OrderItem[];
}
