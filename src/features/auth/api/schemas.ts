import { z } from 'zod';

export const smsServiceSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  image_path: z.string().nullable().optional(),
  is_enabled: z.boolean(),
});

export const smsServicesSchema = z.array(smsServiceSchema);

export type SmsService = z.infer<typeof smsServiceSchema>;

export const authResponseSchema = z.object({
  token: z.string(),
  user_id: z.union([z.string(), z.number()]).optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
