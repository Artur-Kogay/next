import type { DiscountType } from './discounts';
import type { Event } from './event.types';
import type { Scheme } from './schema.types';
import type { Theater } from './theater.types';

export type BaseType = {
  id: number;
  created_at: Date;
  updated_at?: Date;
};

export type SessionTicketType = BaseType & {
  price: number;
  quantity: number;
  title: string;
  description?: string;
  card_color?: string;
  text_color?: string;
};

export type Hall = {
  id: number;
  title: string;
};

export type OtherSession = {
  date_time: string;
  slug: string;
  language: null | string;
  outer_session_id?: number;
};

export type TSession = BaseType & {
  date_time: string;
  event?: Event;
  min_price?: number | null;
  slug: string;
  is_informational?: boolean;
  ticket_types?: SessionTicketType[];
  left_tickets_count?: number;
  scheme?: Scheme;
  theater?: Theater;
  language: string | null;
  other_sessions?: OtherSession[];
  hall?: Hall;
  max_tickets_per_customer: number;
  status: string;
  discounts: DiscountType[];
  outer_session_id?: string;
};

export interface TOrderItem extends BaseType {
  status?: string;
  ticket_seat_id?: number;
  ticket_area_id?: number;
  scheme_sector_id?: number;
  html_id: string;
}
