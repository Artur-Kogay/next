import { z } from 'zod';

const addressSchema = z.object({
  title: z.string(),
  location_lat: z.number().nullable().optional(),
  location_lng: z.number().nullable().optional(),
});

const regionSchema = z.object({
  title: z.string(),
});

const theaterSchema = z.object({
  title: z.string(),
  address: addressSchema.nullable().optional(),
  region: regionSchema.nullable().optional(),
});

const eventDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  image_path: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_free: z.boolean().nullable().optional(),
  age_restriction: z.string().nullable().optional(),
  duration: z.union([z.string(), z.number()]).nullable().optional(),
  is_active: z.string().nullable().optional(),
  theater: theaterSchema.nullable().optional(),
});

const ticketTypeSchema = z.object({
  id: z.number(),
  price: z.number(),
  quantity: z.number(),
  title: z.string(),
});

const otherSessionSchema = z.object({
  date_time: z.string(),
  slug: z.string(),
});

const hallSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export const sessionDetailSchema = z.object({
  id: z.number(),
  date_time: z.string(),
  slug: z.string(),
  status: z.string(),
  min_price: z.number().nullable().optional(),
  is_informational: z.boolean().nullable().optional(),
  left_tickets_count: z.number().nullable().optional(),
  max_tickets_per_customer: z.number().nullable().optional(),
  language: z.string().nullable().optional(),
  event: eventDetailSchema.nullable().optional(),
  ticket_types: z.array(ticketTypeSchema).nullable().optional(),
  other_sessions: z.array(otherSessionSchema).nullable().optional(),
  scheme: z.unknown().nullable().optional(),
  hall: hallSchema.nullable().optional(),
});

export const sessionDetailResponseSchema = z.object({
  payload: sessionDetailSchema,
});

export type SessionDetail = z.infer<typeof sessionDetailSchema>;
