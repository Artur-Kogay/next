import { z } from 'zod';

const paymentCountrySchema = z
  .object({
    id: z.coerce.number().optional(),
    is_enabled: z.boolean().optional().default(true),
  })
  .passthrough();

export const paymentMethodSchema = z
  .object({
    id: z.coerce.number(),
    code: z.string(),
    title: z.coerce.string().optional().default(''),
    image_path: z.string().nullable().optional(),
    is_enabled: z.boolean().optional().default(true),
    country: paymentCountrySchema.nullable().optional(),
  })
  .passthrough();

export const paymentMethodsResponseSchema = z.object({
  payload: z.array(paymentMethodSchema).catch([]),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
