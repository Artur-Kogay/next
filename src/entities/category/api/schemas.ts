import { z } from 'zod';

import { bannerSchema } from '@/entities/banner/api/schemas';
import { sessionListItemSchema } from '@/entities/event/api/schemas';

export const categorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  banners: z.array(bannerSchema).default([]),
  last_sessions: z.array(sessionListItemSchema).default([]),
});

export const categoriesSchema = z.array(categorySchema);

export type Category = z.infer<typeof categorySchema>;
