'use client';

import QRCode from 'react-qr-code';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QrCode = ({ value, size = 150, className }: QrCodeProps) => (
  <QRCode value={value || ' '} size={size} className={className} />
);
