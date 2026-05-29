export interface OtpStepProps {
  length?: number;
  resendIn?: number;
  onSubmit: (code: string) => void;
  onResend: () => void;
  error?: string | null;
  loading?: boolean;
}
