'use client';

import QRCode from 'react-qr-code';

import { type QrCodeProps } from './QrCode.types';

export const QrCode = ({ value, size = 150, className }: QrCodeProps) => (
  <QRCode value={value || ' '} size={size} className={className} />
);
