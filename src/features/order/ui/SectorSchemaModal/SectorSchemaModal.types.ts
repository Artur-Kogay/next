import type { BasketItem, OrderItem, OrderSession } from '../../api/schemas';
import type { SectorState } from '../Schema/Schema.types';

export interface SectorSchemaModalProps {
  isOpen: boolean;
  sector: SectorState | undefined;
  item: OrderSession;
  basket: BasketItem[];
  orderItems: OrderItem[];
  onClose: () => void;
}
