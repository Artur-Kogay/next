import type { BasketItem } from '@/entities/basket';

import type { PaymentMethod } from '../../api/schemas';
import type { Totals } from '../OrderSummary/OrderSummary.types';

export interface CheckoutProps {
  paymentMethods: PaymentMethod[];
}

/* TODO: placeholder data for design only — replace with real basket once logic is wired back. */
export const MOCK_TIMER = 600;

export const MOCK_BASKET: BasketItem[] = [
  {
    id: 1,
    title: 'Входной билет',
    price: 3000,
    service_fee: 0,
    discount: 0,
    event: { title: 'Название мероприятия' },
    session: { date_time: '2026-05-30T19:00:00' },
  },
  {
    id: 2,
    title: 'Входной билет',
    price: 5000,
    service_fee: 100,
    discount: 0,
    event: { title: 'Название мероприятия' },
    session: { date_time: '2026-05-31T19:00:00' },
  },
];

export const MOCK_TOTALS: Totals = {
  ticketsSum: 8000,
  serviceFeeSum: 100,
  discount: 0,
  total: 8100,
  count: 2,
};
