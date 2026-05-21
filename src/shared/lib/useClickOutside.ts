'use client';

import { useEffect, useRef, type RefObject } from 'react';
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
): void => {
  const callbackRef = useRef(onOutside);
  callbackRef.current = onOutside;

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        callbackRef.current();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref]);
};
