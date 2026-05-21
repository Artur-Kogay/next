type ProfileTab = string;

export type Tab = {
  id: number;
  slug: ProfileTab;
};

export type Ticket = {
  id: number;
  is_refund: boolean;
  event: {
    id: number;
    title: string;
    address: string;
    theater_title: string;
    is_cancelled_event: boolean;
    is_qr_enabled: boolean;
    scanner_type: 'scanner' | 'turnstile';
  };
  discount: string | null;
  title: string;
  serial_number: string;
  price: number;
  is_cancelled_session: boolean;
  event_date: string;
  checked: boolean;
  qr_number: string;
  turnstile_qr?: string;
  turnstile_or_other_data?: {
    qr: string;
    is_cancelled: boolean;
  };
  is_luck?: boolean;
};

export type OrderStatus = 'PENDING_FOR_PAYMENT' | 'COMPLETED' | 'INVITATION' | 'FAILED';

export type Order = {
  discount?: number;
  id: number;
  order_number: string;
  last_payment: { id: string; method: string };
  status: OrderStatus;
  created_at: string;
  total_service_fee: number;
  items: Ticket[];
  total: number;
  fiscal: IFiscal;
  order_comment: string;
  refund_status: {
    id: number;
    status: RefundStatus;
    created_at: string;
  } | null;
};

type IFiscal = {
  completed: string;
};

export type RefundStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
