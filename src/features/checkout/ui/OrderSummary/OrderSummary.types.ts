import type { BasketItem } from '@/entities/basket';

export interface Totals {
  ticketsSum: number;
  serviceFeeSum: number;
  discount: number;
  total: number;
  count: number;
}

export interface OrderSummaryProps {
  basket: BasketItem[];
  timer: number;
  totals: Totals;
  promo: string;
  onPromoChange: (value: string) => void;
  onApplyPromo: () => void;
  promoPending: boolean;
  promoApplied: boolean;
  onPay: () => void;
  payPending: boolean;
  payLabel: string;
}
