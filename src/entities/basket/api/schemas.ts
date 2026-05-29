import { z } from 'zod';

const basketEventSchema = z
  .object({
    id: z.coerce.number().optional(),
    title: z.coerce.string().optional().default(''),
    is_free: z.boolean().nullable().optional(),
  })
  .passthrough();

const basketSessionSchema = z
  .object({
    date_time: z.coerce.string().nullable().optional(),
  })
  .passthrough();

const basketItemSchema = z
  .object({
    id: z.coerce.number(),
    title: z.coerce.string().optional().default(''),
    price: z.coerce.number().optional().default(0),
    service_fee: z.coerce.number().optional().default(0),
    discount: z.coerce.number().optional().default(0),
    ticket_type_id: z.coerce.number().nullable().optional(),
    ticket_seat_id: z.coerce.number().nullable().optional(),
    ticket_area_id: z.coerce.number().nullable().optional(),
    event: basketEventSchema.nullable().optional(),
    session: basketSessionSchema.nullable().optional(),
    row: z.coerce.number().nullable().optional(),
    outer_id: z.coerce.number().nullable().optional(),
  })
  .passthrough();

const basketSchema = z.object({
  basket: z.array(basketItemSchema).catch([]),
  timer: z.coerce.number().catch(0),
});

export const basketResponseSchema = z.object({
  payload: basketSchema,
});

export type BasketItem = z.infer<typeof basketItemSchema>;
export type Basket = z.infer<typeof basketSchema>;
