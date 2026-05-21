export type PaymentMethodDiscount = {
  country_id: number;
  discount_amount: number;
  discount_id: number;
  discount_type: 'FIXED' | 'PERCENT';
  id: number;
  method: {
    id: number;
    name: 'payment_method_event';
  };
  payload: {
    event_id: number;
    payment_method_code: string;
  };
  quantity: number;
};

export type TicketsCountDiscount = {
  country_id: number;
  discount_amount: number;
  discount_id: number;
  discount_type: 'FIXED' | 'PERCENT';
  id: number;
  method: { id: number; name: 'event_ticket_quantity' };
  payload: { event_id: number };
  quantity: number;
};

export type DiscountType = PaymentMethodDiscount | TicketsCountDiscount;
