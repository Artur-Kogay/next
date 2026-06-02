import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type {
  BakaiData,
  DemirData,
  ElsomData,
  KicbData,
  KompanionData,
  MegapayData,
  WebviewType,
} from './types';

export const webviewTypeAtom = atomWithStorage<WebviewType | null>('webview', null, undefined, {
  getOnInit: true,
});

export const isWebviewLoadingAtom = atom<boolean>(false);

export const bakaiDataAtom = atomWithStorage<BakaiData | null>('webview:bakai', null, undefined, {
  getOnInit: true,
});

export const megapayDataAtom = atomWithStorage<MegapayData | null>(
  'webview:megapay',
  null,
  undefined,
  { getOnInit: true },
);

export const demirDataAtom = atomWithStorage<DemirData | null>('webview:demir', null, undefined, {
  getOnInit: true,
});

export const kicbDataAtom = atomWithStorage<KicbData | null>('webview:kicb', null, undefined, {
  getOnInit: true,
});

export const kompanionDataAtom = atomWithStorage<KompanionData | null>(
  'webview:kompanion',
  null,
  undefined,
  { getOnInit: true },
);

export const elsomDataAtom = atomWithStorage<ElsomData | null>('webview:elsom', null, undefined, {
  getOnInit: true,
});
