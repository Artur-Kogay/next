import { z } from 'zod';

export const genderSchema = z.enum(['MALE', 'FEMALE']);
export type Gender = z.infer<typeof genderSchema>;

export const profileSchema = z.object({
  id: z.union([z.string(), z.number()]),
  phone_number: z.string(),
  full_name: z.string().nullable().optional(),
  birthday: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  gender: genderSchema.nullable().optional(),
});

export type ProfileResponse = z.infer<typeof profileSchema>;

export interface UpdateProfileInput {
  full_name: string;
  email: string;
  birthday?: string;
  gender?: 'male' | 'female';
}

export const orderStatusSchema = z.enum([
  'PENDING_FOR_PAYMENT',
  'COMPLETED',
  'INVITATION',
  'FAILED',
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const refundStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED']);
export type RefundStatus = z.infer<typeof refundStatusSchema>;

export const ticketEventSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().nullable().default(''),
  address: z.string().nullable().optional(),
  theater_title: z.string().nullable().optional(),
  is_cancelled_event: z.boolean().optional(),
  is_qr_enabled: z.boolean().optional(),
  scanner_type: z.string().nullable().optional(),
});

export const ticketSchema = z.object({
  id: z.union([z.string(), z.number()]),
  is_refund: z.boolean().default(false),
  event: ticketEventSchema,
  discount: z.union([z.string(), z.number()]).nullable().optional(),
  title: z.string().nullable().default(''),
  serial_number: z.string().nullable().default(''),
  price: z.number().nullable().default(0),
  is_cancelled_session: z.boolean().optional(),
  event_date: z.string().nullable().default(''),
  checked: z.boolean().optional(),
  qr_number: z.string().nullable().optional(),
  turnstile_qr: z.string().nullable().optional(),
  is_luck: z.boolean().optional(),
});

export type Ticket = z.infer<typeof ticketSchema>;

export const orderSchema = z.object({
  id: z.union([z.string(), z.number()]),
  order_number: z.string().nullable().default(''),
  status: orderStatusSchema.catch('COMPLETED'),
  created_at: z.string().nullable().default(''),
  total: z.number().nullable().optional(),
  total_service_fee: z.number().nullable().optional(),
  discount: z.union([z.string(), z.number()]).nullable().optional(),
  items: z.array(ticketSchema).default([]),
  order_comment: z.string().nullable().optional(),
  refund_status: z
    .object({
      id: z.union([z.string(), z.number()]),
      status: refundStatusSchema,
      created_at: z.string(),
    })
    .nullable()
    .optional(),
});

export type Order = z.infer<typeof orderSchema>;

export const ordersListSchema = z.array(orderSchema);

export interface RefundInput {
  order_number: string;
  phone_number: string;
  full_name: string;
  payment_method: string;
  cancelled_comment: string;
  type: string;
  tickets: string[];
}
