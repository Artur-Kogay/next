import { type Country } from '@/shared/config';

export interface CountryPickerProps {
  value: Country;
  onChange: (country: Country) => void;
}
