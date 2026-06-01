export type PaymentResultState =
  | { kind: 'redirecting' }
  | { kind: 'qr'; qr: string; orderNumber: string }
  | {
      kind: 'otp';
      code: string;
      phone: string;
      orderNumber: string;
      codeLength: number;
      timer: number;
      name?: string;
    }
  | { kind: 'success'; orderNumber: string };

export interface PaymentResultProps {
  state: PaymentResultState;
  onFinish: () => void;
  onConfirmOtp: (otp: string) => void;
  confirmPending: boolean;
  onExpire: () => void;
  onCancel: () => void;
}
