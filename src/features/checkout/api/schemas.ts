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

export const payResponseSchema = z
  .object({
    order_number: z.coerce.string().optional().default(''),
    qr: z.string().nullable().optional(),
    qr_base64: z.string().nullable().optional(),
    app_link: z.string().nullable().optional(),
    redirect_url: z.string().nullable().optional(),
    otp_sent_phone: z.string().nullable().optional(),
    pay_data: z.object({ pay_url: z.string().nullable().optional() }).nullable().optional(),
  })
  .passthrough();

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type PayResponse = z.infer<typeof payResponseSchema>;

export interface PayInput {
  user_email: string;
  phone_number?: string;
  redirect_url?: string;
  comment?: string;
  type?: string;
  user_info?: {
    full_name?: string;
    birthday?: string;
    gender?: string;
  };
}
