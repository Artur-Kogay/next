import type { BasketItem, OrderSession, TicketType } from '../../api/schemas';

export interface TicketCardProps {
  ticket: TicketType;
  item: OrderSession;
  basket: BasketItem[];
}
