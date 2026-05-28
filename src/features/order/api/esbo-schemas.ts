import { z } from 'zod';

export const esboSeatSchema = z
  .object({
    outer_id: z.coerce.number(),
    sector_id: z.coerce.number(),
    sector_name: z.coerce.string(),
    row_number: z.coerce.string(),
    seat_number: z.coerce.string(),
    tarif_id: z.coerce.number(),
    tarif_name: z.coerce.string(),
    ticket_status_id: z.coerce.number(),
  })
  .passthrough();

export const esboPriceSchema = z
  .object({
    id: z.coerce.number(),
    color: z.string(),
    price: z.coerce.number(),
    tarifName: z.coerce.string(),
  })
  .passthrough();

export type EsboSeat = z.infer<typeof esboSeatSchema>;
export type EsboPrice = z.infer<typeof esboPriceSchema>;
