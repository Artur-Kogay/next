import { z } from 'zod';

const seatSchema = z.object({
  id: z.number(),
  html_id: z.string(),
  price: z.number(),
  color: z.string(),
  scheme_sector_id: z.number().nullable().optional(),
});

const schemeAreaSchema = z.object({
  html_id: z.string(),
});

const areaSchema = z.object({
  id: z.number(),
  price: z.number(),
  color: z.string(),
  left_tickets_count: z.number(),
  scheme_area: schemeAreaSchema,
});

const sectorSchema = z.object({
  id: z.number(),
  sector_id: z.string(),
  html_path: z.string().nullable().optional(),
  disabled: z.boolean().optional(),
});

const schemeSchema = z.object({
  html_path: z.string().nullable().optional(),
  seats: z.array(seatSchema).default([]),
  areas: z.array(areaSchema).default([]),
  sectors: z.array(sectorSchema).default([]),
});

const ticketTypeSchema = z.object({
  id: z.number(),
  price: z.number(),
  quantity: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  card_color: z.string().nullable().optional(),
  text_color: z.string().nullable().optional(),
});

const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_free: z.boolean().nullable().optional(),
});

const sessionSchema = z.object({
  date_time: z.string(),
  slug: z.string(),
});

const hallSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export const orderSessionSchema = z.object({
  id: z.number(),
  slug: z.string(),
  date_time: z.string(),
  status: z.string().nullable().optional(),
  max_tickets_per_customer: z.number().nullable().optional(),
  event: eventSchema,
  scheme: schemeSchema.nullable().optional(),
  ticket_types: z.array(ticketTypeSchema).default([]),
  other_sessions: z.array(sessionSchema).default([]),
  hall: hallSchema.nullable().optional(),
});

export const orderSessionResponseSchema = z.object({
  payload: orderSessionSchema,
});

const basketEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_free: z.boolean().nullable().optional(),
});

const basketSessionSchema = z.object({
  date_time: z.string(),
});

const basketItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  service_fee: z.number(),
  discount: z.number(),
  ticket_type_id: z.number().nullable().optional(),
  ticket_seat_id: z.number().nullable().optional(),
  ticket_area_id: z.number().nullable().optional(),
  event: basketEventSchema.nullable().optional(),
  session: basketSessionSchema.nullable().optional(),
  row: z.number().nullable().optional(),
  outer_id: z.number().nullable().optional(),
});

const basketSchema = z.object({
  basket: z.array(basketItemSchema).default([]),
  timer: z.number().default(0),
});

export const basketResponseSchema = z.object({
  payload: basketSchema,
});

const orderItemSchema = z.object({
  id: z.number(),
  html_id: z.string().nullable().optional(),
  ticket_seat_id: z.number().nullable().optional(),
  scheme_sector_id: z.number().nullable().optional(),
});

export const orderItemsResponseSchema = z.object({
  payload: z.object({
    order_items: z.array(orderItemSchema).default([]),
  }),
});

export type Seat = z.infer<typeof seatSchema>;
export type Area = z.infer<typeof areaSchema>;
export type Sector = z.infer<typeof sectorSchema>;
export type Scheme = z.infer<typeof schemeSchema>;
export type TicketType = z.infer<typeof ticketTypeSchema>;
export type OrderSession = z.infer<typeof orderSessionSchema>;
export type BasketItem = z.infer<typeof basketItemSchema>;
export type Basket = z.infer<typeof basketSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
