import type { EsboPrice, EsboSeat } from '../../api/esbo-schemas';
import type { BasketItem, OrderSession } from '../../api/schemas';
import type { SectorState } from '../Schema/Schema.types';

export interface SectorSchemaEsboModalProps {
  isOpen: boolean;
  sector: SectorState | undefined;
  item: OrderSession;
  basket: BasketItem[];
  esboSeats: EsboSeat[];
  esboPricing: EsboPrice[];
  onClose: () => void;
}
