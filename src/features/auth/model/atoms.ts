import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'user_id';

export const tokenAtom = atomWithStorage<string | null>(TOKEN_KEY, null, undefined, {
  getOnInit: true,
});

export const userIdAtom = atomWithStorage<string | null>(USER_ID_KEY, null, undefined, {
  getOnInit: true,
});

export const isAuthAtom = atom((get) => get(tokenAtom) !== null);
