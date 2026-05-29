import type { EsboPrice, EsboSeat } from '../../api/esbo-schemas';
import type { BasketItem, OrderSession } from '../../api/schemas';

export interface EsboSchemaProps {
  item: OrderSession;
  schemaHtml: string;
  esboPricing: EsboPrice[];
  esboSeats: EsboSeat[];
  basket: BasketItem[];
}
