'use client';

import { type NextWebVitalsMetric } from 'next/app';
import { useReportWebVitals } from 'next/web-vitals';

import { env } from '@/shared/config/env';

export const WebVitals = () => {
  useReportWebVitals((metric: NextWebVitalsMetric) => {
    if (env.NEXT_PUBLIC_APP_ENV === 'development') {
      console.log('[web-vitals]', metric.name, Math.round(metric.value));
    }
  });

  return null;
};
