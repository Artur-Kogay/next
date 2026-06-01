import type { PaymentMethod } from '../../api/schemas';

export interface CheckoutProps {
  paymentMethods: PaymentMethod[];
}

export const FREE_METHOD: PaymentMethod = {
  id: -1,
  code: 'free',
  title: '',
  image_path: null,
  is_enabled: true,
  country: { is_enabled: true },
};

export interface OtpMethodConfig {
  codeLength: number;
  timer: number;
  checkPhone?: boolean;
}

export const OTP_METHODS: Record<string, OtpMethodConfig> = {
  mbank: { codeLength: 4, timer: 120, checkPhone: true },
  bakai: { codeLength: 5, timer: 120, checkPhone: true },
  kompanion: { codeLength: 6, timer: 900 },
  megapay: { codeLength: 4, timer: 120 },
};
