export type WebviewType =
  | 'bakai'
  | 'elsom'
  | 'megapay'
  | 'demir_webhook'
  | 'kicb_webhook'
  | 'kompanion';

export interface BakaiData {
  phone: string;
  sign: string;
}

export interface MegapayData {
  phone: string;
  fullName: string;
}

export interface DemirData {
  phone: string;
  fullName: string;
}

export interface KicbData {
  phone: string;
  fullName: string;
}

export interface KompanionData {
  phone: string;
  fullName: string;
}

export interface ElsomData {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  dob: string;
  gender: 'M' | 'f';
  citizenship: string;
  passporti: string;
  passportinn: string;
  expirationDate: string;
  paymentKey: string;
}
