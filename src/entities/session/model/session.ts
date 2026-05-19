import { atom, useAtomValue } from 'jotai';
import { z } from 'zod';

export const sessionSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  token: z.string(),
});

export type Session = z.infer<typeof sessionSchema>;

export const sessionAtom = atom<Session | null>(null);

export const useSession = () => useAtomValue(sessionAtom);
