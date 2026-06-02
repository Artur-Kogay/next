'use client';

import { useCallback, useRef, useState } from 'react';

import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { CheckCircle2, Smartphone, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn, useBrowser } from '@/shared/lib';

import styles from './TicketScanner.module.scss';
import { type ScanResultView } from './TicketScanner.types';
import { checkTicket } from '../../api/client';

const useIsMobile = () => {
  const { isInApp } = useBrowser();
  if (isInApp) return true;
  if (typeof navigator === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
};

export const TicketScanner = () => {
  const t = useTranslations('scan');
  const tCommon = useTranslations('common');
  const isMobile = useIsMobile();

  const [result, setResult] = useState<ScanResultView | null>(null);
  const lockedRef = useRef(false);

  const handleScan = useCallback(
    async (codes: IDetectedBarcode[]) => {
      if (lockedRef.current) return;
      const raw = codes[0]?.rawValue;
      if (!raw) return;

      lockedRef.current = true;
      const res = await checkTicket(raw);

      if (res.ok) {
        setResult({
          status: 'success',
          title: res.status,
          details: [
            t('order-number', { number: res.payload.order_number }),
            t('serial', { serial: res.payload.serial_number }),
            t('scan-count', { count: res.payload.scan_count }),
          ],
        });
      } else {
        setResult({ status: 'error', title: res.status || t('invalid') });
      }

      setTimeout(() => {
        lockedRef.current = false;
        setResult(null);
      }, 5000);
    },
    [t],
  );

  if (!isMobile) {
    return (
      <div className={styles.desktopMsg}>
        <Smartphone size={40} className={styles.desktopIcon} aria-hidden />
        <p>{tCommon('scunner-usage')}</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.scannerWrap}>
        <Scanner onScan={handleScan} onError={console.error} />
      </div>

      {result ? (
        <div className={cn(styles.resultCard, styles[result.status])}>
          <div className={styles.cardHeader}>
            {result.status === 'success' ? (
              <CheckCircle2 size={20} className={styles.icon} aria-hidden />
            ) : (
              <XCircle size={20} className={styles.icon} aria-hidden />
            )}
            <p className={styles.cardTitle}>{result.title}</p>
          </div>
          {result.details?.length ? (
            <div className={styles.details}>
              {result.details.map((line, i) => (
                <p key={i} className={styles.detailLine}>
                  {line}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
