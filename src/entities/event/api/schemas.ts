import { z } from 'zod';

export const eventBriefSchema = z.object({
  id: z.number(),
  image_path: z.string().nullable().optional(),
  is_free: z.boolean().optional(),
  title: z.string(),
  is_pinned: z.boolean().optional(),
});

export const theaterBriefSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export const sessionListItemSchema = z.object({
  id: z.number(),
  slug: z.string(),
  date_time: z.string(),
  event: eventBriefSchema,
  theater: theaterBriefSchema.optional().nullable(),
  min_price: z.number().nullable().optional(),
  left_tickets_count: z.number().nullable().optional(),
  max_tickets_per_customer: z.number().optional(),
  is_informational: z.boolean().optional(),
});

export const sessionListSchema = z.array(sessionListItemSchema);

export type SessionListItem = z.infer<typeof sessionListItemSchema>;
export type EventBrief = z.infer<typeof eventBriefSchema>;
