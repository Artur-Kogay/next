import type { Order } from '../../api/schemas';

export interface OrderCardProps {
  order: Order;
}

export type DisplayStatus = 'paid' | 'pending' | 'refunded';
