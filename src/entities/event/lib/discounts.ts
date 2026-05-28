export type DiscountMethod = 'event_ticket_quantity' | 'payment_method_event';

export interface EventDiscount {
  id: number;
  method: DiscountMethod;
  type: 'PERCENT' | 'FIXED';
  amount: number;
  quantity?: number;
  paymentMethod?: string;
}

// TODO: replace with real discounts from the API once available.
// Mock example wired to the first popular event (ESCAPE FEST, event.id 1206).
const EXAMPLE_EVENT_ID = 1206;

const EXAMPLE_DISCOUNTS: EventDiscount[] = [
  { id: 1, method: 'event_ticket_quantity', type: 'PERCENT', amount: 10, quantity: 3 },
  { id: 2, method: 'event_ticket_quantity', type: 'PERCENT', amount: 15, quantity: 5 },
  { id: 3, method: 'payment_method_event', type: 'PERCENT', amount: 5, paymentMethod: 'MBANK' },
  { id: 4, method: 'payment_method_event', type: 'FIXED', amount: 200, paymentMethod: 'O! Деньги' },
];

export const getEventDiscounts = (eventId: number | undefined): EventDiscount[] =>
  eventId === EXAMPLE_EVENT_ID ? EXAMPLE_DISCOUNTS : [];

export const getDiscountText = (discount: EventDiscount, currencyLabel: string): string =>
  discount.type === 'PERCENT'
    ? `${discount.amount}%`
    : `${discount.amount.toLocaleString()} ${currencyLabel}`;

export const getDiscountCondition = (discount: EventDiscount): string => {
  switch (discount.method) {
    case 'event_ticket_quantity':
      return `От ${discount.quantity} билетов`;
    case 'payment_method_event':
      return `Оплата через ${discount.paymentMethod}`;
    default:
      return '';
  }
};

export const getFullDiscountText = (discount: EventDiscount, currencyLabel: string): string =>
  `${getDiscountCondition(discount)} - скидка ${getDiscountText(discount, currencyLabel)}`;

export const getMaxDiscountPercent = (eventId: number | undefined): number | null => {
  const percents = getEventDiscounts(eventId)
    .filter((d) => d.type === 'PERCENT')
    .map((d) => d.amount);
  return percents.length ? Math.max(...percents) : null;
};
