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

export const getOrCreateUserUuid = (): string => {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
};
