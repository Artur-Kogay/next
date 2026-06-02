import { z } from 'zod';

export const contentPageStatusSchema = z.enum(['draft', 'published', 'archived']);

export const contentPageSchema = z
  .object({
    id: z.coerce.string(),
    slug: z.string(),
    title: z.string().default(''),
    content: z.string().default(''),
    linkTicket: z.string().nullable().optional().default(''),
    status: contentPageStatusSchema.optional(),
  })
  .passthrough();

export type ContentPageStatus = z.infer<typeof contentPageStatusSchema>;
export type ContentPage = z.infer<typeof contentPageSchema>;
