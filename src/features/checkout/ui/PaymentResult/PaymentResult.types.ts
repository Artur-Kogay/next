export type PaymentResultState =
  | { kind: 'redirecting' }
  | { kind: 'qr'; qr: string; orderNumber: string }
  | { kind: 'success'; orderNumber: string; otpPhone?: string };

export interface PaymentResultProps {
  state: PaymentResultState;
  onFinish: () => void;
}
