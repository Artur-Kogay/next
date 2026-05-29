import { type Country } from '@/shared/config';

import { type SmsService } from '../../api/schemas';

export interface SmsServiceStepProps {
  phone: string;
  country: Country;
  onSelect: (service: SmsService) => void;
}

export const HINT_KEY: Record<string, 'telegram' | 'smspro'> = {
  telegram: 'telegram',
  smspro: 'smspro',
};

export const PHONE_BASED_CODES = new Set(['smspro']);
