import { z } from 'zod';

export const bannerSchema = z.object({
  id: z.number(),
  image_path: z.string(),
  link: z.string(),
  mobile_banner: z.string().nullable().optional(),
  priority: z.number(),
});

export const bannersSchema = z.array(bannerSchema);

export type Banner = z.infer<typeof bannerSchema>;
