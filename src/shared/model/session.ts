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

const generateUuid = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    void 0;
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getOrCreateUserUuid = (): string => {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = generateUuid();
    window.localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
};
