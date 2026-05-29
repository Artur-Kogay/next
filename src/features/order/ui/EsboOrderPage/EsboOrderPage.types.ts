import type { EsboPrice, EsboSeat } from '../../api/esbo-schemas';
import type { OrderSession } from '../../api/schemas';

export interface EsboOrderPageProps {
  item: OrderSession;
  schemaHtml: string;
  esboPricing: EsboPrice[];
  esboSeats: EsboSeat[];
}
