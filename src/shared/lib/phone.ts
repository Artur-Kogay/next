import { COUNTRIES, COUNTRY_ALIASES, env, type Country } from '@/shared/config';

export const findCountry = (code: string): Country | undefined => {
  const resolved = COUNTRY_ALIASES[code] ?? code;
  return COUNTRIES.find((c) => c.code === resolved);
};

export const defaultCountry = (): Country =>
  findCountry(env.NEXT_PUBLIC_COUNTRY_CODE) ?? COUNTRIES[0]!;

export const isHomeCountry = (country: Country): boolean => defaultCountry().code === country.code;

export const sanitizePhone = (country: Country, input: string): string =>
  input.replace(/\D/g, '').slice(0, country.maxDigits);

export const formatPhone = (country: Country, digits: string): string => {
  const d = sanitizePhone(country, digits);
  return d.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

export const fullPhone = (country: Country, digits: string): string =>
  `+${country.dial}${sanitizePhone(country, digits)}`;

export const isValidPhone = (country: Country, digits: string): boolean =>
  sanitizePhone(country, digits).length === country.maxDigits;
