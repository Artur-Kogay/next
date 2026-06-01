export interface OtpFormProps {
  phone: string;
  codeLength: number;
  timer: number;
  name?: string;
  confirmPending: boolean;
  onConfirm: (otp: string) => void;
  onExpire: () => void;
  onCancel: () => void;
}
