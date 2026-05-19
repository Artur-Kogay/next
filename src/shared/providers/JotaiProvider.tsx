'use client';

import { type ReactNode } from 'react';

import { Provider } from 'jotai';

interface JotaiProviderProps {
  children: ReactNode;
}

export const JotaiProvider = ({ children }: JotaiProviderProps) => {
  return <Provider>{children}</Provider>;
};
