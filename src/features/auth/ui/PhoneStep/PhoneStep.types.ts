import { type Country } from '@/shared/config';

export interface PhoneStepProps {
  initialCountry?: Country;
  initialDigits?: string;
  onSubmit: (input: { country: Country; digits: string }) => void;
}
