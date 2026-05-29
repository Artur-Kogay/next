import type { OrderSession } from '../../api/schemas';

export interface SchemeTooltipsProps {
  item: OrderSession;
  areasCount: Record<string, number>;
  showSeat: boolean;
}
