import type { Order } from '../../api/schemas';

export interface TicketsTabProps {
  upcoming: Order[];
  past: Order[];
  loading?: boolean;
}

export type Mode = 'upcoming' | 'past';
