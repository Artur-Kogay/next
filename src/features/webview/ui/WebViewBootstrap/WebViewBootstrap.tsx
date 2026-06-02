'use client';

import { Suspense, useEffect, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { useAtomValue, useSetAtom } from 'jotai';

import { tokenAtom } from '@/shared/model';
import { Loader } from '@/shared/ui';

import { getBakaiToken, getElsomToken, getKicbToken, getMegapayToken } from '../../api/client';
import {
  bakaiDataAtom,
  demirDataAtom,
  elsomDataAtom,
  isWebviewLoadingAtom,
  kicbDataAtom,
  kompanionDataAtom,
  megapayDataAtom,
  webviewTypeAtom,
} from '../../model/atoms';

import type { ElsomData } from '../../model/types';

const BootstrapEffect = () => {
  const params = useSearchParams();
  const ran = useRef(false);

  const setLoading = useSetAtom(isWebviewLoadingAtom);
  const setToken = useSetAtom(tokenAtom);
  const setWebview = useSetAtom(webviewTypeAtom);
  const setBakai = useSetAtom(bakaiDataAtom);
  const setMegapay = useSetAtom(megapayDataAtom);
  const setDemir = useSetAtom(demirDataAtom);
  const setKicb = useSetAtom(kicbDataAtom);
  const setKompanion = useSetAtom(kompanionDataAtom);
  const setElsom = useSetAtom(elsomDataAtom);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const app = params.get('app');
    const elsomString = params.get('elsom_app');

    if (!app && !elsomString) return;

    let cancelled = false;
    setLoading(true);

    const run = async () => {
      try {
        if (app === 'bakai') {
          const phone = params.get('phone') ?? '';
          const sign = params.get('sign') ?? '';
          setWebview('bakai');
          const token = await getBakaiToken({ phone, sign });
          if (cancelled) return;
          if (token) {
            setToken(token);
            setBakai({ phone, sign });
          }
        } else if (app === 'megapay') {
          const phone = params.get('phone') ?? '';
          const fullName = params.get('full_name') ?? '';
          setWebview('megapay');
          const payload = await getMegapayToken({ phone, fullName });
          if (cancelled) return;
          if (payload?.token) {
            setToken(payload.token);
            setMegapay({ phone, fullName });
          }
        } else if (app === 'demir') {
          const phone = params.get('phone') ?? '';
          const fullName = params.get('full_name') ?? '';
          const token = params.get('token');
          setWebview('demir_webhook');
          if (token) {
            setToken(token);
            setDemir({ phone, fullName });
          }
        } else if (app === 'kicb') {
          const phone = params.get('phone') ?? '';
          const fullName = params.get('full_name') ?? '';
          const sign = params.get('sign') ?? '';
          setWebview('kicb_webhook');
          const token = await getKicbToken({ phone, full_name: fullName, sign });
          if (cancelled) return;
          if (token) {
            setToken(token);
            setKicb({ phone, fullName });
          }
        } else if (app === 'kompanion') {
          const phone = params.get('phone') ?? '';
          const fullName = params.get('full_name') ?? '';
          const token = params.get('token');
          setWebview('kompanion');
          if (token) {
            setToken(token);
            setKompanion({ phone, fullName });
          }
        } else if (elsomString) {
          let elsomData: ElsomData | null = null;
          try {
            elsomData = JSON.parse(decodeURIComponent(elsomString)) as ElsomData;
          } catch {
            elsomData = null;
          }
          if (elsomData) {
            setWebview('elsom');
            setElsom(elsomData);
            const token = await getElsomToken(elsomData);
            if (cancelled) return;
            if (token) setToken(token);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    params,
    setBakai,
    setDemir,
    setElsom,
    setKicb,
    setKompanion,
    setLoading,
    setMegapay,
    setToken,
    setWebview,
  ]);

  return null;
};

const Overlay = () => {
  const loading = useAtomValue(isWebviewLoadingAtom);
  if (!loading) return null;
  return <Loader fullScreen size="lg" />;
};

export const WebViewBootstrap = () => (
  <Suspense fallback={null}>
    <BootstrapEffect />
    <Overlay />
  </Suspense>
);
